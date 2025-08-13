import enTranslations from "./translations/en.json";
import zhTranslations from "./translations/zh.json";

export type Language = "en" | "zh";
export type TranslationKey = typeof enTranslations;

const translations = {
  en: enTranslations,
  zh: zhTranslations,
} as const;

export function getTranslations(lang: Language = "en"): TranslationKey {
  return translations[lang] || translations.en;
}

export function getLanguageFromPath(pathname: string): Language {
  const pathSegments = pathname.split("/").filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];
  return lastSegment === "zh" ? "zh" : "en";
}

export function createLangSwitchUrl(targetLang: Language, hash: string = ""): string {
  if (targetLang === "en") {
    return `/so-far${hash}`;
  } else {
    return `/so-far/zh${hash}`;
  }
}

export function getHtmlLangAttribute(lang: Language): string {
  return lang === "zh" ? "zh-CN" : "en";
}
