import processingTranslations from './processingTranslations';
import commonTranslations from './commonTranslations';

const componentsTranslations = {
  ...processingTranslations,
  ...commonTranslations,
  
  // Connection alerts
  connectionAlert: {
    noInternet: "No internet connection",
    serverUnreachable: "Server is unreachable, please try again later",
    retry: "Retry"
  },
  
  // Offline screen
  offlineScreen: {
    title: "No Internet Connection",
    message: "Please check your internet connection and try again",
    serverTitle: "Server Unavailable",
    serverMessage: "We're having trouble reaching our servers. Please try again later.",
    retry: "Retry Connection"
  }
};

export default componentsTranslations;
