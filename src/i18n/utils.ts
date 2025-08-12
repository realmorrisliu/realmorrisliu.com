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

export function getLanguageFromURL(url: URL): Language {
  const lang = url.searchParams.get("lang");
  return lang === "zh" ? "zh" : "en";
}

export function getLangSwitchUrl(currentUrl: URL, targetLang: Language): string {
  const url = new URL(currentUrl);
  if (targetLang === "en") {
    url.searchParams.delete("lang");
  } else {
    url.searchParams.set("lang", targetLang);
  }
  return url.pathname + url.search;
}

export function getHtmlLangAttribute(lang: Language): string {
  return lang === "zh" ? "zh-CN" : "en";
}
