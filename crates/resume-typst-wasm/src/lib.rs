use std::collections::HashMap;
use std::path::PathBuf;
use std::sync::Once;

use js_sys::{Array, Object, Reflect, Uint8Array};
use typst::diag::{FileError, FileResult, SourceDiagnostic};
use typst::foundations::{Bytes, Datetime, Duration};
use typst::syntax::{FileId, RootedPath, Source, VirtualPath, VirtualRoot};
use typst::text::{Font, FontBook};
use typst::utils::LazyHash;
use typst::{Library, LibraryExt, World};
use typst_layout::PagedDocument;
use typst_pdf::PdfOptions;
use typst_svg::SvgOptions;
use wasm_bindgen::prelude::*;

static PANIC_HOOK: Once = Once::new();

#[wasm_bindgen]
pub fn compile_resume_preview(
    main_path: String,
    files: JsValue,
    font_buffers: Array,
) -> Result<JsValue, JsValue> {
    let (document, warnings) = compile_document(main_path, files, font_buffers)?;

    let pages = Array::new();
    let svg_options = SvgOptions::default();
    for page in document.pages() {
        pages.push(&JsValue::from_str(&typst_svg::svg(page, &svg_options)));
    }

    let output = Object::new();
    Reflect::set(&output, &JsValue::from_str("pages"), &pages)?;
    Reflect::set(&output, &JsValue::from_str("warnings"), &warnings)?;

    Ok(output.into())
}

#[wasm_bindgen]
pub fn compile_resume_pdf(
    main_path: String,
    files: JsValue,
    font_buffers: Array,
) -> Result<JsValue, JsValue> {
    let (document, warnings) = compile_document(main_path, files, font_buffers)?;

    let pdf_bytes = typst_pdf::pdf(&document, &PdfOptions::default())
        .map_err(|diagnostics| JsValue::from_str(&format_diagnostics(&diagnostics)))?;

    let output = Object::new();
    Reflect::set(
        &output,
        &JsValue::from_str("pdf_bytes"),
        &Uint8Array::from(pdf_bytes.as_slice()),
    )?;
    Reflect::set(&output, &JsValue::from_str("warnings"), &warnings)?;

    Ok(output.into())
}

fn compile_document(
    main_path: String,
    files: JsValue,
    font_buffers: Array,
) -> Result<(PagedDocument, Array), JsValue> {
    PANIC_HOOK.call_once(console_error_panic_hook::set_once);

    let files = read_files(files)?;
    let fonts = read_fonts(font_buffers)?;
    let world = BrowserWorld::new(main_path, files, fonts)?;

    let warned = typst::compile::<PagedDocument>(&world);
    let document = warned
        .output
        .map_err(|diagnostics| JsValue::from_str(&format_diagnostics(&diagnostics)))?;

    let warnings = Array::new();
    for warning in warned.warnings {
        warnings.push(&JsValue::from_str(&format_diagnostic(&warning)));
    }

    Ok((document, warnings))
}

struct BrowserWorld {
    library: LazyHash<Library>,
    book: LazyHash<FontBook>,
    main: FileId,
    files: HashMap<String, String>,
    fonts: Vec<Font>,
    today: Datetime,
}

impl BrowserWorld {
    fn new(
        main_path: String,
        files: HashMap<String, String>,
        fonts: Vec<Font>,
    ) -> Result<Self, JsValue> {
        if fonts.is_empty() {
            return Err(JsValue::from_str("No valid Typst fonts were loaded"));
        }

        let main = file_id(&main_path)?;
        let book = FontBook::from_fonts(fonts.iter());
        let today = Datetime::from_ymd(2026, 7, 6)
            .ok_or_else(|| JsValue::from_str("Failed to create stable Typst date"))?;

        Ok(Self {
            library: LazyHash::new(Library::default()),
            book: LazyHash::new(book),
            main,
            files,
            fonts,
            today,
        })
    }
}

impl World for BrowserWorld {
    fn library(&self) -> &LazyHash<Library> {
        &self.library
    }

    fn book(&self) -> &LazyHash<FontBook> {
        &self.book
    }

    fn main(&self) -> FileId {
        self.main
    }

    fn source(&self, id: FileId) -> FileResult<Source> {
        let path = world_path(id)?;
        if !path.ends_with(".typ") {
            return Err(FileError::NotSource);
        }

        self.files
            .get(&path)
            .map(|text| Source::new(id, text.clone()))
            .ok_or_else(|| FileError::NotFound(PathBuf::from(path)))
    }

    fn file(&self, id: FileId) -> FileResult<Bytes> {
        let path = world_path(id)?;
        self.files
            .get(&path)
            .map(|text| Bytes::from_string(text.clone()))
            .ok_or_else(|| FileError::NotFound(PathBuf::from(path)))
    }

    fn font(&self, index: usize) -> Option<Font> {
        self.fonts.get(index).cloned()
    }

    fn today(&self, _offset: Option<Duration>) -> Option<Datetime> {
        Some(self.today)
    }
}

fn file_id(path: &str) -> Result<FileId, JsValue> {
    let vpath = VirtualPath::new(path)
        .map_err(|error| JsValue::from_str(&format!("Invalid Typst path {path}: {error}")))?;
    Ok(RootedPath::new(VirtualRoot::Project, vpath).intern())
}

fn world_path(id: FileId) -> FileResult<String> {
    if !matches!(id.root(), VirtualRoot::Project) {
        return Err(FileError::Package(typst::diag::PackageError::Other(Some(
            "packages are not available".into(),
        ))));
    }

    Ok(id.vpath().get_without_slash().to_owned())
}

fn read_files(files: JsValue) -> Result<HashMap<String, String>, JsValue> {
    let object = Object::from(files);
    let keys = Object::keys(&object);
    let mut out = HashMap::with_capacity(keys.length() as usize);

    for key in keys.iter() {
        let path = key
            .as_string()
            .ok_or_else(|| JsValue::from_str("Typst file map contains a non-string key"))?;
        let value = Reflect::get(&object, &JsValue::from_str(&path))?;
        let text = value
            .as_string()
            .ok_or_else(|| JsValue::from_str(&format!("Typst file {path} is not text")))?;
        out.insert(path, text);
    }

    Ok(out)
}

fn read_fonts(font_buffers: Array) -> Result<Vec<Font>, JsValue> {
    let mut fonts = Vec::new();

    for value in font_buffers.iter() {
        let bytes = Uint8Array::new(&value);
        let mut buffer = vec![0; bytes.length() as usize];
        bytes.copy_to(&mut buffer);
        fonts.extend(Font::iter(Bytes::new(buffer)));
    }

    Ok(fonts)
}

fn format_diagnostics(diagnostics: &[SourceDiagnostic]) -> String {
    diagnostics
        .iter()
        .map(format_diagnostic)
        .collect::<Vec<_>>()
        .join("\n")
}

fn format_diagnostic(diagnostic: &SourceDiagnostic) -> String {
    let mut message = diagnostic.message.to_string();

    for hint in &diagnostic.hints {
        message.push_str("\nhint: ");
        message.push_str(&hint.v.to_string());
    }

    message
}
