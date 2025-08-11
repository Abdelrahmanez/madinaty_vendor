import axiosInstance from "./axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_ENDPOINTS } from "../config/api";

/**
 * تسجيل مستخدم جديد
 * @param {Object} requestData - بيانات التسجيل
 * @param {string} requestData.name - الاسم الكامل
 * @param {string} requestData.phoneNumber - رقم الهاتف
 * @param {string} requestData.password - كلمة المرور
 * @param {string} requestData.address - عنوان النص
 * @param {string} requestData.areaId - معرف منطقة التوصيل
 * @returns {Promise} استجابة API
 */
export const registerRequest = async (requestData) => {
  try {
    console.log('Sending signup request to:', API_ENDPOINTS.AUTH.SIGNUP, requestData);
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.SIGNUP, requestData);
    console.log('Signup API raw response:', response);
    
    const responseData = response.data;
    console.log('Signup API response data:', responseData);
    
    // تخزين رموز المصادقة عند التسجيل الناجح
    // نتعامل مع هياكل استجابة API المختلفة
    const accessToken = responseData?.accessToken || responseData?.data?.accessToken || responseData?.token;
    const refreshToken = responseData?.refreshToken || responseData?.data?.refreshToken || responseData?.refresh_token;
    
    if (accessToken) {
      console.log('Storing auth tokens');
      await AsyncStorage.setItem("access_token", accessToken);
      
      if (refreshToken) {
        await AsyncStorage.setItem("refresh_token", refreshToken);
      }
      
      axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      console.log('No access token found in the response');
    }
    
    // تهيئة كائن الاستجابة مع الحقول الضرورية
    const formattedResponse = {
      success: true,
      accessToken: accessToken,
      refreshToken: refreshToken,
      // نستخرج معلومات المستخدم من أي موقع محتمل في الاستجابة
      user: responseData?.data?.user || responseData?.user || responseData?.data,
      // نحتفظ بكامل البيانات الأصلية
      originalData: responseData
    };
    
    return formattedResponse;
  } catch (error) {
    console.error("خطأ في طلب التسجيل:", error);
    console.error("تفاصيل الخطأ:", error.response?.data || error.message);
    // استخراج رسالة الخطأ من الاستجابة إذا كانت موجودة
    const errorMessage = error.response?.data?.message || "حدث خطأ أثناء إنشاء الحساب";
    throw new Error(errorMessage);
  }
};

/**
 * تسجيل الدخول برقم الهاتف وكلمة المرور
 * @param {Object} requestData - بيانات تسجيل الدخول
 * @param {string} requestData.phoneNumber - رقم الهاتف
 * @param {string} requestData.password - كلمة المرور
 * @returns {Promise} استجابة API مع الرموز
 */
export const loginRequest = async (requestData) => {
  try {
    console.log('Sending login request to:', API_ENDPOINTS.AUTH.LOGIN, requestData);
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, requestData);
    console.log('Login API raw response:', response);
    
    const responseData = response.data;
    console.log('Login API response data:', responseData);
    
    // تخزين رموز المصادقة
    // نتعامل مع هياكل استجابة API المختلفة
    const accessToken = responseData?.accessToken || responseData?.data?.accessToken || responseData?.token;
    const refreshToken = responseData?.refreshToken || responseData?.data?.refreshToken || responseData?.refresh_token;
    
    if (accessToken) {
      console.log('Storing auth tokens');
      await AsyncStorage.setItem("access_token", accessToken);
      
      if (refreshToken) {
        await AsyncStorage.setItem("refresh_token", refreshToken);
      }
      
      axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      console.log('No access token found in the response');
    }
    
    // تهيئة كائن الاستجابة مع الحقول الضرورية
    const formattedResponse = {
      success: true,
      accessToken: accessToken,
      refreshToken: refreshToken,
      // نستخرج معلومات المستخدم من أي موقع محتمل في الاستجابة
      user: responseData?.data?.user || responseData?.user || responseData?.data,
      // نحتفظ بكامل البيانات الأصلية
      originalData: responseData
    };
    
    return formattedResponse;
  } catch (error) {
    console.error("خطأ في طلب تسجيل الدخول:", error);
    console.error("تفاصيل الخطأ:", error.response?.data || error.message);
    // استخراج رسالة الخطأ من الاستجابة إذا كانت موجودة
    const errorMessage = error.response?.data?.message || "رقم الهاتف أو كلمة المرور غير صحيحة";
    throw new Error(errorMessage);
  }
};

/**
 * تحديث رمز الوصول باستخدام رمز التحديث
 * @returns {Promise} استجابة API مع رمز وصول جديد
 */
export const refreshTokenRequest = async () => {
  const refreshToken = await AsyncStorage.getItem("refresh_token");
  
  if (!refreshToken) {
    throw new Error('لا يوجد رمز تحديث متاح');
  }
  
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
      refreshToken,
    });
    
    // تخزين رمز الوصول الجديد
    if (response && response.data && response.data.accessToken) {
      await AsyncStorage.setItem("access_token", response.data.accessToken);
      axiosInstance.defaults.headers.Authorization = `Bearer ${response.data.accessToken}`;
    }
    
    return response.data;
  } catch (error) {
    console.error("خطأ في طلب تحديث الرمز:", error);
    throw new Error("فشل تحديث جلسة الاتصال. يرجى تسجيل الدخول مرة أخرى.");
  }
};

/**
 * تسجيل الخروج وإبطال رمز التحديث
 * @returns {Promise} استجابة API
 */
export const logoutRequest = async () => {
  const refreshToken = await AsyncStorage.getItem("refresh_token");
  
  try {
    // محاولة استدعاء نقطة نهاية تسجيل الخروج فقط إذا كان لدينا رمز
    if (refreshToken) {
      await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken });
    }
  } catch (error) {
    console.error('خطأ في تسجيل الخروج:', error);
  } finally {
    // دائمًا مسح التخزين المحلي عند تسجيل الخروج
    await AsyncStorage.removeItem("access_token");
    await AsyncStorage.removeItem("refresh_token");
    delete axiosInstance.defaults.headers.Authorization;
  }
  
  return { status: 'success', message: 'تم تسجيل الخروج بنجاح' };
};

/**
 * تعيين أو تحديث رمز PIN المالي (للمطاعم / المسؤولين)
 * @param {string} pin - رمز PIN المراد تعيينه
 * @returns {Promise} استجابة API
 */
export const setFinancialPinRequest = async (pin) => {
  try {
    const response = await axiosInstance.patch(API_ENDPOINTS.AUTH.SET_FINANCIAL_PIN, { pin });
    return response.data || { status: 'success', message: 'تم تعيين رمز PIN بنجاح' };
  } catch (error) {
    console.error("خطأ في تعيين رمز PIN المالي:", error);
    throw error;
  }
};

/**
 * التحقق من رمز PIN المالي
 * @param {string} pin - رمز PIN للتحقق منه
 * @returns {Promise} استجابة API
 */
export const verifyFinancialPinRequest = async (pin) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.VERIFY_FINANCIAL_PIN, { pin });
    return response.data || { status: 'success', message: 'تم التحقق من رمز PIN' };
  } catch (error) {
    console.error("خطأ في التحقق من رمز PIN المالي:", error);
    throw error;
  }
};
