import processingTranslations from './processingTranslations';
import commonTranslations from './commonTranslations';

const componentsTranslations = {
  ...processingTranslations,
  ...commonTranslations,
  
  // تنبيهات الاتصال
  connectionAlert: {
    noInternet: "لا يوجد اتصال بالإنترنت",
    serverUnreachable: "الخادم غير متاح، يرجى المحاولة لاحقًا",
    retry: "إعادة المحاولة"
  },
  
  // شاشة عدم الاتصال
  offlineScreen: {
    title: "لا يوجد اتصال بالإنترنت",
    message: "يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى",
    serverTitle: "الخادم غير متاح",
    serverMessage: "نواجه بعض المشاكل في الوصول إلى خوادمنا. يرجى المحاولة مرة أخرى بعد قليل.",
    retry: "إعادة المحاولة"
  }
};

export default componentsTranslations;
