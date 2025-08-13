// i18
import i18n from "i18next";
// react-i18next
import { initReactI18next } from "react-i18next";
// react-native-async-storage
import AsyncStorage from "@react-native-async-storage/async-storage";
// locales
import enLocales from "./EN/en";
import arLocales from "./AR/ar";
// config
import { defaultLang } from "../../config"; // Your default language config

// Initialize i18n
i18n.use(initReactI18next).init({
  resources: {
    en: { translations: enLocales },
    ar: { translations: arLocales },
  },
  lng: defaultLang.value, // Set default language
  fallbackLng: "en",
  debug: false,
  ns: ["translations"],
  defaultNS: "translations",
  interpolation: {
    escapeValue: false,
  },
});

// Function to set language
export const setLanguage = async (lng) => {
  await AsyncStorage.setItem("i18nextLng", lng);
  i18n.changeLanguage(lng);
};

// Load stored language when app starts
const loadLanguage = async () => {
  try {
    const storedLang = await AsyncStorage.getItem("i18nextLng");
    if (storedLang) {
      i18n.changeLanguage(storedLang);
    }
  } catch (error) {
    console.error("Failed to load language from storage", error);
  }
};
loadLanguage(); // Call it immediately

export default i18n;
