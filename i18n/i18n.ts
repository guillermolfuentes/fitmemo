import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import translationEn from "./locales/en-US/translation.json";
import translationEs from "./locales/es-ES/translation.json";

const locales = Localization.getLocales();

let deviceLanguage = locales.length > 0 && locales[0].languageTag ? locales[0].languageTag : "en-US";

//deviceLanguage = "en-US";

const resources = {
  "en-US": { translation: translationEn },
  "es-ES": { translation: translationEs },
};

const initI18n = async () => {
  i18n.use(initReactI18next).init({
    compatibilityJSON: "v3",
    resources,
    lng: deviceLanguage,
    fallbackLng: "en-US",
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;
