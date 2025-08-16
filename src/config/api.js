/**
 * API Configuration
 * --------------------------------------------
 * تكوين عناوين API والنقاط النهائية المستخدمة في التطبيق
 */

// Base URL for all API requests
export const API_BASE_URL = "http://192.168.1.19:8000/api/v1";

// API Endpoints organized by module
export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: "/auth/signup",
    LOGIN: "/auth/login",
    REFRESH_TOKEN: "/auth/refresh-token",
    LOGOUT: "/auth/logout",
    SET_FINANCIAL_PIN: "/auth/set-financial-pin",
    VERIFY_FINANCIAL_PIN: "/auth/verify-financial-pin",
  },
  DELIVERY_ZONES: {
    LIST: "/delivery-zones",
    ACTIVE: "/delivery-zones/active",
    DETAIL: (id) => `/delivery-zones/${id}`,
  },
  USER: {
    PROFILE: "/users/me",
    UPDATE_PASSWORD: "/users/update-password",
    ADDRESSES: "/users/addresses",
    DEFAULT_ADDRESS: "/users/addresses/default",
    ADDRESS: (id) => `/users/addresses/${id}`,
    SET_DEFAULT_ADDRESS: (id) => `/users/addresses/${id}/set-default`,
    PUSH_TOKEN: "/users/push-token",  // إضافة نقطة نهاية لتوكن الإشعارات
  },
  RESTAURANTS: {
    LIST: "/restaurants",
    DETAIL: (id) => {
      console.log("Fetching restaurant detail for id:", id);
      return `/restaurants/${id}`;
    },
    MY_RESTAURANT: "/restaurants/my-restaurant",

  },
  CATEGORIES: {
    LIST: (type) => `/categories?type=${type}`,
    DETAIL: (id) => `/categories/${id}`,
  },
  DISHES: {
    LIST: "/dishes",
    DETAIL: (id) => `/dishes/${id}`,
  },
  CART: {
    GET: "/cart",
    ADD: "/cart/add",
    REMOVE: (itemId) => `/cart/remove/${itemId}`,
    UPDATE: (itemId) => `/cart/update/${itemId}`,
    EMPTY: "/cart/empty",
  },
  ORDERS: {
    LIST: "/orders",
    CREATE: "/orders",
    DETAIL: (id) => `/orders/${id}`,
  },
  NOTIFICATION: {
    REGISTER_TOKEN: "/users/push-token",  // تحديث للنقطة النهائية الصحيحة
    UNREGISTER_TOKEN: "/users/push-token",  // تحديث للنقطة النهائية الصحيحة
    USER_PREFERENCES: "/notifications/preferences",
  },
  PROMO_CODES: {
    VALIDATE: "/promo-codes/validate",
  },
  BANNER_OFFERS: {
    LIST: "/banner-offers",
    DETAIL: (id) => `/banner-offers/${id}`,
    FEATURED: "/banner-offers/featured",
  },
  ADVERTISEMENTS: {
    LIST: "/advertisements",
    DETAIL: (id) => `/advertisements/${id}`,
    RECORD_CLICK: (id) => `/advertisements/click/${id}`,
  },
  PROMOCODE: {
    VALIDATE: "/promocodes/validate",
  },
};

export default {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: API_ENDPOINTS
}; 