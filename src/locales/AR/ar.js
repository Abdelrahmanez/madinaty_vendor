// components
import { processingTranslations } from "./components";
import componentsTranslations from "./components";
// pages
import screensTranslations from "./screens";
import authScreensTranslations from "./screens/authScreensTranslations";
// common
import commonTranslations from "./common";

// ----------------------------------------------------------------------

const ar = {
  ...screensTranslations,
  ...authScreensTranslations,
  ...componentsTranslations,
  ...commonTranslations,
  // Keep the nested structure for backward compatibility
  componentsTranslations: { processingTranslations },
};

export default ar;
