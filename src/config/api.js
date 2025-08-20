/**
 * API Configuration
 * --------------------------------------------
 * تكوين عناوين API والنقاط النهائية المستخدمة في التطبيق
 */

// Base URL for all API requests
export const API_BASE_URL = "http://192.168.3.10:8000/api/v1";

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
    // Restaurant delivery zones endpoints
    RESTAURANT_ZONES: "/delivery-zones/restaurant/zones",
    SET_ZONE_PRICE: "/delivery-zones/restaurant/zones/set-price",
    UPDATE_ZONE_PRICE: (id) => `/delivery-zones/restaurant/zones/${id}/price`,
    DEACTIVATE_ZONE: "/delivery-zones/restaurant/zones/deactivate",
    VALIDATE_RESTAURANT_ZONES: "/delivery-zones/restaurant/zones/validate",
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
    CREATE: "/dishes",
    UPDATE: (id) => `/dishes/${id}`,
    DELETE: (id) => `/dishes/${id}`,
    TOGGLE_AVAILABILITY: (id) => `/dishes/${id}/toggle-availability`,
    // Size management
    UPDATE_SIZE: (dishId, sizeId) => `/dishes/${dishId}/sizes/${sizeId}`,
    UPDATE_SIZE_STOCK: (dishId, sizeId) => `/dishes/${dishId}/sizes/${sizeId}/stock`,
    ADD_SIZE: (dishId) => `/dishes/${dishId}/sizes`,
    // Addon management
    ADD_ADDONS: (dishId) => `/dishes/${dishId}/addons`,
    REMOVE_ADDONS: (dishId) => `/dishes/${dishId}/addons`,
    // Offer management
    UPDATE_OFFER: (dishId) => `/dishes/${dishId}/offer`,
    DELETE_OFFER: (dishId) => `/dishes/${dishId}/offer`,
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
    UPDATE_STATUS: (id) => `/orders/${id}/status`,
    CANCEL: (id) => `/orders/${id}/cancel`,
  },
  NOTIFICATION: {
    REGISTER_TOKEN: "/users/push-token",  // تحديث للنقطة النهائية الصحيحة
    UNREGISTER_TOKEN: "/users/push-token",  // تحديث للنقطة النهائية الصحيحة
    USER_PREFERENCES: "/notifications/preferences",
  },
  PROMO_CODES: {
    VALIDATE: "/promocodes/validate",
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
    RESTAURANT_LIST: "/promocodes/restaurant",
    RESTAURANT_CREATE: "/promocodes/restaurant",
    RESTAURANT_UPDATE: (id) => `/promocodes/restaurant/${id}`,
    RESTAURANT_DELETE: (id) => `/promocodes/restaurant/${id}`,
  },
  ADDONS: {
    LIST: "/addons",
    DETAIL: (id) => `/addons/${id}`,
    RESTAURANT_ADDONS: (restaurantId) => `/restaurants/${restaurantId}/addons`,
    CREATE: (restaurantId) => `/restaurants/${restaurantId}/addons`,
    UPDATE: (restaurantId, addonId) => `/restaurants/${restaurantId}/addons/${addonId}`,
    DELETE: (restaurantId, addonId) => `/restaurants/${restaurantId}/addons/${addonId}`,
  },
};

// Debug: Log the API endpoints to verify they're loaded correctly
console.log('🔍 API_ENDPOINTS loaded:', Object.keys(API_ENDPOINTS));
console.log('🔍 ORDERS endpoints loaded:', Object.keys(API_ENDPOINTS.ORDERS));
console.log('🔍 UPDATE_STATUS function type:', typeof API_ENDPOINTS.ORDERS.UPDATE_STATUS);
console.log('🔍 CANCEL function type:', typeof API_ENDPOINTS.ORDERS.CANCEL);

export default {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: API_ENDPOINTS
}; 