import axiosInstance from "../../../services/axios";
import { API_BASE_URL, API_ENDPOINTS } from "../../../config/api";
import * as Device from 'expo-device';

/**
 * إرسال أو تحديث Expo push token للمستخدم
 * @param {string} token - الـ Expo push token الخاص بالجهاز
 * @returns {Promise} استجابة API
 */
export const registerPushToken = async (token) => {
  try {
    if (!token) {
      return { success: false, error: 'لا يوجد رمز إشعارات' };
    }

    
    // استخدام النقطة النهائية المحددة في ملف التكوين
    const response = await axiosInstance.post(
      API_ENDPOINTS.NOTIFICATION.REGISTER_TOKEN,
      { token }
    );
    
    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage = error.response?.data?.message || "حدث خطأ أثناء تسجيل رمز الإشعارات";
    return { success: false, error: errorMessage };
  }
};

/**
 * إلغاء تسجيل Expo push token (عند تسجيل الخروج)
 * @param {string} token - الـ Expo push token المراد إلغاء تسجيله
 * @returns {Promise} استجابة API
 */
export const unregisterPushToken = async (token) => {
  try {
    if (!token) {
      return { success: false, error: 'لا يوجد رمز إشعارات' };
    }
    
    
    // استخدام النقطة النهائية المحددة في ملف التكوين
    const response = await axiosInstance.delete(
      API_ENDPOINTS.NOTIFICATION.UNREGISTER_TOKEN,
      {
        data: { token }
      }
    );
    
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}; 
