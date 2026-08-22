import { type Language } from "@i18n/utils";

const subsetFontFile = "NotoSansCJKsc-ResumeSubset.ttf";

export function getResumeTypstAssetUrls(currentLang: Language) {
  // All three ship with the site under public/. The overrides exist so the
  // heavy wasm or font can be pointed at a CDN without a rebuild of the pages.
  const wasmBaseUrl = (
    import.meta.env.PUBLIC_RESUME_TYPST_WASM_BASE_URL ?? "/resume-typst-wasm"
  ).replace(/\/$/, "");
  const fontBaseUrl = (
    import.meta.env.PUBLIC_RESUME_TYPST_FONT_BASE_URL ?? "/resume-typst/fonts"
  ).replace(/\/$/, "");
  const previewLang = currentLang === "zh" ? "zh" : "en";

  return {
    previewUrl: `/resume-typst-preview/${previewLang}.svg`,
    wasmBaseUrl,
    wasmBridgeUrl: `${wasmBaseUrl}/browser.js`,
    wasmBinaryUrl: `${wasmBaseUrl}/resume_typst_wasm_bg.wasm`,
    fontUrls: [`${fontBaseUrl}/${subsetFontFile}`],
  };
}
