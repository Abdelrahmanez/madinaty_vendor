// i18
import i18n from "i18next";
// react-i18next
import { initReactI18next } from "react-i18next";
// react-native-async-storage
import AsyncStorage from "@react-native-async-storage/async-storage";
// I18nManager for RTL support
import { I18nManager } from "react-native";
// locales
import enLocales from "./EN/en";
import arLocales from "./AR/ar";
// config
import { defaultLang } from "../../config"; // Your default language config

// Define languages with their RTL setting
const languages = {
  en: { rtl: false },
  ar: { rtl: true },
};

// تحديد العربية كاللغة الافتراضية وRTL كاتجاه افتراضي
const DEFAULT_LANGUAGE = 'ar';

// Set RTL as default immediately for Arabic language
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);
console.log("تم تحديد اتجاه RTL كافتراضي للتطبيق");

// Initialize i18n
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enLocales },
    ar: { translation: arLocales },
  },
  lng: DEFAULT_LANGUAGE, // تحديد العربية كلغة افتراضية
  fallbackLng: "ar", // تحديد العربية كلغة احتياطية
  debug: true, // Enable debug to help find issues
  interpolation: {
    escapeValue: false,
  },
});

/**
 * Function to set language and handle RTL
 * @param {string} lng - The language code to set
 * @param {boolean} forceRestart - Whether to force app restart for RTL changes
 */
export const setLanguage = async (lng, forceRestart = false) => {
  try {
    // Save language to storage
    await AsyncStorage.setItem("i18nextLng", lng);
    
    // Get RTL setting for the language
    const isRTL = languages[lng]?.rtl || false;
    
    // If RTL setting is different from current, we need to update I18nManager
    if (I18nManager.isRTL !== isRTL) {
      // Update RTL setting
      I18nManager.allowRTL(isRTL);
      await I18nManager.forceRTL(isRTL);
      
      // If forcing restart is enabled, restart app to apply RTL changes fully
      if (forceRestart) {
        // This is just a comment - in a real app, you'd use RNRestart.Restart();
        console.log("App should restart to apply RTL changes fully");
      }
    }
    
    // Change language in i18n
    i18n.changeLanguage(lng);
    
    console.log(`Language changed to ${lng}, RTL: ${isRTL}`);
  } catch (error) {
    console.error("Failed to set language", error);
  }
};

// Load stored language when app starts
const loadLanguage = async () => {
  try {
    const storedLang = await AsyncStorage.getItem("i18nextLng");
    if (storedLang) {
      // Apply RTL setting without force restart on app load
      await setLanguage(storedLang, false);
    } else {
      // If no language is stored, set default to Arabic with RTL
      await setLanguage(DEFAULT_LANGUAGE, false);
    }
  } catch (error) {
    console.error("Failed to load language from storage", error);
  }
};
loadLanguage(); // Call it immediately

export default i18n;
export const isRTL = i18n.language === "ar";