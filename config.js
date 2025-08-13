export const cookiesKey = {
  themeMode: "themeMode",
  themeDirection: "themeDirection",
};

// Default App Settings
export const defaultSettings = {
  themeMode: "light",
  themeDirection: "ltr",
};

// Multi-Language Support
export const allLangs = [
  {
    label: "English",
    value: "en",
    icon: require("./assets/icons/en_flag.png"),
  },
  {
    label: "Arabic (Egypt)",
    value: "ar",
    icon: require("./assets/icons/ar_flag.png"),
  },
];

export const defaultLang =
  allLangs.find((lang) => lang.value === "en") || allLangs[0];
