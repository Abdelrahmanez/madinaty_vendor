import axiosInstance from '../../../services/axios';
import { API_ENDPOINTS } from '../../../config/api';

/**
 * API functions لإدارة مناطق التوصيل للمطعم
 */

// جلب جميع مناطق التوصيل للمطعم
export const getRestaurantDeliveryZones = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.DELIVERY_ZONES.RESTAURANT_ZONES);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// تعيين سعر لمنطقة توصيل
export const setZonePrice = async (zoneId, price) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.DELIVERY_ZONES.SET_ZONE_PRICE, {
      zoneId,
      price
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// تحديث سعر منطقة توصيل
export const updateZonePrice = async (zoneId, price) => {
  try {
    const response = await axiosInstance.put(API_ENDPOINTS.DELIVERY_ZONES.UPDATE_ZONE_PRICE(zoneId), {
      price
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// إلغاء تفعيل منطقة توصيل
export const deactivateZone = async (zoneId) => {
  try {
    const response = await axiosInstance.patch(API_ENDPOINTS.DELIVERY_ZONES.DEACTIVATE_ZONE, {
      zoneId
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// التحقق من أن المطعم لديه أسعار لجميع المناطق النشطة
export const validateRestaurantZones = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.DELIVERY_ZONES.VALIDATE_RESTAURANT_ZONES);
    return response.data;
  } catch (error) {
    throw error;
  }
};
