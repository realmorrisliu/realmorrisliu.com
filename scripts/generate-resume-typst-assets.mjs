#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const { default: subsetFont } = await import("subset-font");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const sourceDir = path.join(repoRoot, "public/resume-typst");
const previewDir = path.join(repoRoot, "public/resume-typst-preview");
const fontDir = path.join(sourceDir, "fonts");
const fullFontPath = path.join(fontDir, "NotoSansCJKsc-Regular.otf");
const subsetFontPath = path.join(fontDir, "NotoSansCJKsc-ResumeSubset.ttf");

const asciiText = Array.from({ length: 95 }, (_, index) => String.fromCharCode(index + 32)).join(
  ""
);

const readJson = async relativePath =>
  JSON.parse(await readFile(path.join(repoRoot, relativePath), "utf8"));

const visibleForPdf = items => items.filter(item => item.showInPdf !== false);

const projectGithubLabel = project => project.githubUrl?.replace("https://github.com/", "");

const contactLinks = () => [
  {
    label: "morrisliu1994@outlook.com",
    url: "mailto:morrisliu1994@outlook.com",
  },
  {
    label: "github.com/realmorrisliu",
    url: "https://github.com/realmorrisliu",
  },
  {
    label: "x.com/realmorrisliu",
    url: "https://x.com/realmorrisliu",
  },
  {
    label: "realmorrisliu.com",
    url: "https://realmorrisliu.com",
  },
];

const getResumePdfData = (translations, lang) => {
  const t = translations[lang];
  const workPositions = visibleForPdf([...t.soFar.work.positions]);
  const workProjects = visibleForPdf([...t.soFar.projects.workProjects.items]);
  const personalProjects = visibleForPdf([...t.soFar.projects.personalProjects.items]);

  return {
    lang,
    name: "Morris Liu",
    title: t.soFar.pdf.pageTitle,
    description: t.soFar.pdf.pageDescription,
    summary: t.soFar.resumeSummary,
    contact: contactLinks(),
    sections: {
      skills: t.soFar.skills.title,
      work: t.soFar.work.title,
      education: t.soFar.education.title,
      workProjects: t.soFar.projects.workProjects.title,
      personalProjects: t.soFar.projects.personalProjects.title,
    },
    skills: t.soFar.skills.categories.map(category => ({
      title: category.title,
      stack: category.stack,
    })),
    work: workPositions.map(position => ({
      title: position.title,
      company: position.company,
      period: position.period,
      description: position.description,
    })),
    education: t.soFar.education.items.map(item => ({
      school: item.school,
      degree: item.degree,
      period: item.period,
      description: item.description,
    })),
    workProjects: workProjects.map(project => ({
      title: project.title,
      company: project.company,
      period: project.period,
      description: project.description,
      github: "",
    })),
    personalProjects: personalProjects.map(project => ({
      title: project.title,
      period: "",
      description: project.description,
      github: projectGithubLabel(project) ?? "",
      githubUrl: project.githubUrl ?? "",
    })),
    counts: {
      workPositions: workPositions.length,
      workProjects: workProjects.length,
      personalProjects: personalProjects.length,
    },
  };
};

const collectText = value => {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(collectText).join("\n");
  }

  if (value && typeof value === "object") {
    return Object.values(value).map(collectText).join("\n");
  }

  return "";
};

const formatBytes = bytes => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KiB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(1)} MiB`;
};

const loadCompiler = async () => {
  const wasmModuleUrl = pathToFileURL(
    path.join(repoRoot, "public/resume-typst-wasm/resume_typst_wasm.js")
  ).href;
  const wasmBinary = await readFile(
    path.join(repoRoot, "public/resume-typst-wasm/resume_typst_wasm_bg.wasm")
  );
  const wasmModule = await import(wasmModuleUrl);

  await wasmModule.default({ module_or_path: wasmBinary });

  return wasmModule;
};

const generateSubsetFont = async subsetText => {
  const fullFont = await readFile(fullFontPath);
  const subset = await subsetFont(fullFont, subsetText, {
    targetFormat: "sfnt",
    preserveNameIds: [1, 2, 3, 4, 5, 6, 16, 17],
  });

  await writeFile(subsetFontPath, subset);

  console.log(
    `Generated ${path.relative(repoRoot, subsetFontPath)} (${formatBytes(fullFont.byteLength)} -> ${formatBytes(subset.byteLength)})`
  );

  return new Uint8Array(subset);
};

const generatePreview = async ({
  compiler,
  data,
  entrySource,
  sharedSource,
  lang,
  subsetFontBytes,
}) => {
  const mainPath = `resume.${lang}.typ`;
  const dataPath = `resume.${lang}.json`;
  const result = compiler.compile_resume_preview(
    mainPath,
    {
      "resume.typ": sharedSource,
      [mainPath]: entrySource,
      [dataPath]: JSON.stringify(data),
    },
    [subsetFontBytes]
  );

  if (result.warnings?.length) {
    console.warn(`Typst warnings for ${lang}:`);
    for (const warning of result.warnings) {
      console.warn(warning);
    }
  }

  if (result.pages.length !== 1) {
    throw new Error(
      `Expected ${lang} resume preview to render one page, got ${result.pages.length}`
    );
  }

  const outputPath = path.join(previewDir, `${lang}.svg`);
  await writeFile(outputPath, result.pages[0]);
  console.log(
    `Generated ${path.relative(repoRoot, outputPath)} (${formatBytes(result.pages[0].length)})`
  );
};

const main = async () => {
  const translations = {
    en: await readJson("src/i18n/translations/en.json"),
    zh: await readJson("src/i18n/translations/zh.json"),
  };
  const data = {
    en: getResumePdfData(translations, "en"),
    zh: getResumePdfData(translations, "zh"),
  };

  const [sharedSource, entryEnSource, entryZhSource] = await Promise.all([
    readFile(path.join(sourceDir, "resume.typ"), "utf8"),
    readFile(path.join(sourceDir, "resume.en.typ"), "utf8"),
    readFile(path.join(sourceDir, "resume.zh.typ"), "utf8"),
    mkdir(previewDir, { recursive: true }),
  ]);

  const subsetText = [
    asciiText,
    "GitHub: Noto Sans CJK SC",
    sharedSource,
    entryEnSource,
    entryZhSource,
    collectText(data.en),
    collectText(data.zh),
  ].join("\n");

  const [compiler, subsetFontBytes] = await Promise.all([
    loadCompiler(),
    generateSubsetFont(subsetText),
  ]);

  await generatePreview({
    compiler,
    data: data.en,
    entrySource: entryEnSource,
    sharedSource,
    lang: "en",
    subsetFontBytes,
  });
  await generatePreview({
    compiler,
    data: data.zh,
    entrySource: entryZhSource,
    sharedSource,
    lang: "zh",
    subsetFontBytes,
  });
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
