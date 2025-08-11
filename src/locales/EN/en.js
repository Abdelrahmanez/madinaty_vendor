// components
import { processingTranslations } from "./components";
import componentsTranslations from "./components";
// pages
import screensTranslations from "./screens";
import authScreensTranslations from "./screens/authScreensTranslations";
// common
import commonTranslations from "./common";

// ----------------------------------------------------------------------

const en = {
  ...screensTranslations,
  ...authScreensTranslations,
  ...componentsTranslations,
  ...commonTranslations,
  componentsTranslations: { processingTranslations },
};

export default en;
