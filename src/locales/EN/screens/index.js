import homeScreenTranslations from './homeScreenTranslations';
import authScreensTranslations from './authScreensTranslations';
import addressScreenTranslations from './addressScreenTranslations';
import paymentMethodsTranslations from './paymentMethodsTranslations';
import orderHistoryTranslations from './orderHistoryTranslations';
import currentOrdersTranslations from './currentOrdersTranslations';
import orderTrackingTranslations from './orderTrackingTranslations';
import orderDetailsTranslations from './orderDetailsTranslations';
import cartScreenTranslations from './cartScreenTranslations';
import restaurantsScreenTranslations from './restaurantsScreenTranslations';
import dishScreenTranslations from './dishScreenTranslations';
import searchScreenTranslations from './searchScreenTranslations';
import profileScreenTranslations from './profileScreenTranslations';

const screensTranslations = {
  ...homeScreenTranslations,
  ...authScreensTranslations,
  ...addressScreenTranslations,
  ...paymentMethodsTranslations,
  ...orderHistoryTranslations,
  ...currentOrdersTranslations,
  ...orderTrackingTranslations,
  ...orderDetailsTranslations,
  ...cartScreenTranslations,
  ...restaurantsScreenTranslations,
  ...dishScreenTranslations,
  ...searchScreenTranslations,
  ...profileScreenTranslations,
  loginScreen: authScreensTranslations.loginScreen,
  signupScreen: authScreensTranslations.signupScreen,
  addressScreen: addressScreenTranslations.addressScreen,
  paymentMethodsScreen: paymentMethodsTranslations.paymentMethodsScreen,
  orderHistoryScreen: orderHistoryTranslations.orderHistoryScreen,
  currentOrdersScreen: currentOrdersTranslations.currentOrdersScreen,
  orderTrackingScreen: orderTrackingTranslations.orderTrackingScreen,
  orderDetailsScreen: orderDetailsTranslations.orderDetailsScreen,
  cartScreen: cartScreenTranslations.cartScreen,
  restaurantsScreen: restaurantsScreenTranslations.restaurantsScreen,
  dishScreen: dishScreenTranslations.dishScreen,
  searchScreen: searchScreenTranslations.searchScreen,
  profileScreen: profileScreenTranslations.profileScreen,
  common: {
    home: "Home",
    restaurants: "Restaurants",
    offers: "Offers",
    orders: "Orders",
    cart: "Cart",
    profile: "Profile",
    settings: "Settings",
    save: "Save",
    cancel: "Cancel",
    search: "Search",
    notifications: "Notifications",
    logout: "Logout"
  }
};

export default screensTranslations;
