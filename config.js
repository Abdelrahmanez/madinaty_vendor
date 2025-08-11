export const cookiesKey = {
  themeMode: "themeMode",
  themeDirection: "themeDirection",
};

// Default App Settings
export const defaultSettings = {
  themeMode: "light",
  themeDirection: "rtl",
};

// Multi-Language Support
export const allLangs = [
  {
    label: "Arabic (Egypt)",
    value: "ar",
    icon: require("./assets/icons/ar_flag.png"),
  },
  {
    label: "English",
    value: "en",
    icon: require("./assets/icons/en_flag.png"),
  },
  
];

export const defaultLang =
  allLangs.find((lang) => lang.value === "ar") || allLangs[0];
