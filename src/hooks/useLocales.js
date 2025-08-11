import { useEffect, useState } from "react";
// react-native
import { I18nManager } from "react-native";
// react-i18next
import { useTranslation } from "react-i18next";
// react-native-async-storage
import AsyncStorage from "@react-native-async-storage/async-storage";
// config
import { allLangs, defaultLang } from "../../config";
// i18
import i18n from "../locales/i18n";
// expo
import * as Updates from "expo-updates";

export default function useLocales() {
  const { t: translate } = useTranslation();
  const [currentLang, setCurrentLang] = useState(defaultLang);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadStoredLanguage = async () => {
      try {
        const storedLang = await AsyncStorage.getItem("i18nextLng");
        const selectedLang =
          allLangs.find((lang) => lang.value === storedLang) || defaultLang;

        setCurrentLang(selectedLang);
        await i18n.changeLanguage(selectedLang.value);

        I18nManager.forceRTL(selectedLang.value === "ar");
      } catch (error) {
        console.error("Failed to load language from storage", error);
      }
    };

    loadStoredLanguage();
  }, []);

  const handleChangeLanguage = async (newLang) => {
    try {
      setLoading(true);

      await AsyncStorage.setItem("i18nextLng", newLang);
      await i18n.changeLanguage(newLang);

      const isRTL = newLang === "ar";
      if (I18nManager.isRTL !== isRTL) {
        I18nManager.forceRTL(isRTL);
      }

      Updates.reloadAsync();
    } catch (error) {
      console.error("Failed to update language", error);
    }
  };

  return {
    onChangeLang: handleChangeLanguage,
    translate: (text, options) => translate(text, options),
    currentLang,
    allLangs,
    loading,
  };
}
