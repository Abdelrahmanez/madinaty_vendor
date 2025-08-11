import axiosInstance from "./axios";
import { API_BASE_URL, API_ENDPOINTS } from "../config/api";
import * as Device from 'expo-device';

/**
 * إرسال أو تحديث Expo push token للمستخدم
 * @param {string} token - الـ Expo push token الخاص بالجهاز
 * @returns {Promise} استجابة API
 */
export const registerPushToken = async (token) => {
  try {
    if (!token) {
      console.error('لا يوجد رمز إشعارات للتسجيل');
      return { success: false, error: 'لا يوجد رمز إشعارات' };
    }

    console.log('تسجيل token الإشعارات:', token);
    
    // استخدام النقطة النهائية المحددة في ملف التكوين
    const response = await axiosInstance.post(
      API_ENDPOINTS.NOTIFICATION.REGISTER_TOKEN,
      { token }
    );
    
    console.log('استجابة تسجيل token الإشعارات:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('خطأ في تسجيل token الإشعارات:', error);
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
      console.error('لا يوجد رمز إشعارات لإلغاء تسجيله');
      return { success: false, error: 'لا يوجد رمز إشعارات' };
    }
    
    console.log('إلغاء تسجيل token الإشعارات:', token);
    
    // استخدام النقطة النهائية المحددة في ملف التكوين
    const response = await axiosInstance.delete(
      API_ENDPOINTS.NOTIFICATION.UNREGISTER_TOKEN,
      {
        data: { token }
      }
    );
    
    console.log('استجابة إلغاء تسجيل token الإشعارات:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('خطأ في إلغاء تسجيل token الإشعارات:', error);
    return { success: false, error: error.message };
  }
}; 