import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import commonEn from "./locales/en/common.json";
import commonAr from "./locales/ar/common.json";

// Detect saved language in localStorage or default to English
const savedLanguage = localStorage.getItem("i18nextLng") || "en";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: commonEn,
      },
      ar: {
        common: commonAr,
      },
    },
    lng: savedLanguage,
    fallbackLng: "en",
    defaultNS: "common",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

// Handle standard document properties dynamically upon initialization
const handleDirectionSync = (lng: string) => {
  document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = lng;
};

// Initial sync
handleDirectionSync(i18n.language);

// Sync on subsequent changes
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("i18nextLng", lng);
  handleDirectionSync(lng);
});

export default i18n;
