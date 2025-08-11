import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NavigationService from "../navigators/NavigationService";
import { API_BASE_URL } from "../config/api";

export const mainUrl = API_BASE_URL;

console.log('🔌 API URL:', API_BASE_URL); // أظهر عنوان API في سجلات التصحيح

// إنشاء نسخة من Axios مع التكوين الأساسي
const axiosInstance = axios.create({
  baseURL: mainUrl,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  // إضافة مهلة زمنية لمنع انتظار الطلبات إلى ما لا نهاية
  timeout: 20000, // زيادة المهلة الزمنية إلى 20 ثانية
});

// نسخة إضافية للاستخدام في تحديث الرمز المميز
const customInstance = axios.create({
  baseURL: mainUrl,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

/**
 * تعيين ترويسات المصادقة لنسخة Axios محددة
 * @param {AxiosInstance} instance - نسخة Axios المراد إعدادها
 */
const setAuthHeaders = async (instance) => {
  try {
    const accessToken = await AsyncStorage.getItem("access_token");
    if (accessToken) {
      // استخدام تنسيق Bearer للترويسة كما هو مطلوب في الAPI
      instance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      console.log('🔑 تم تعيين رمز المصادقة:', `Bearer ${accessToken.substring(0, 15)}...`);
    } else {
      // مسح أي ترويسة مصادقة موجودة
      delete instance.defaults.headers.common["Authorization"];
      console.log('ℹ️ لا يوجد رمز مصادقة محفوظ');
    }
  } catch (error) {
    console.error("❌ خطأ أثناء إعداد ترويسات المصادقة:", error);
  }
};

// تهيئة ترويسات المصادقة
(async () => {
  await setAuthHeaders(axiosInstance);
  await setAuthHeaders(customInstance);
})();

/**
 * إعادة تعيين ترويسات المصادقة (يتم استدعاؤها بعد تسجيل الدخول أو الخروج)
 */
export const refreshAuthHeaders = async () => {
  await setAuthHeaders(axiosInstance);
  await setAuthHeaders(customInstance);
};

// إضافة معترض لتسجيل تفاصيل الطلبات قبل إرسالها
axiosInstance.interceptors.request.use(request => {
  // طباعة تفاصيل الطلب للتشخيص
  console.log('🔄 إرسال طلب API:', request.method?.toUpperCase(), request.url);
  console.log('🧩 ترويسات الطلب:', JSON.stringify(request.headers));
  
  // التأكد من أن Content-Type مضبوط بشكل صحيح لطلبات POST
  if (request.method === 'post' || request.method === 'put' || request.method === 'patch') {
    request.headers["Content-Type"] = "application/json";
  }
  
  return request;
});

// معالجة الاستجابات والأخطاء
axiosInstance.interceptors.response.use(
  response => {
    console.log('✅ استجابة ناجحة من API:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    // تشخيص تفصيلي للأخطاء
    if (error.code === 'ECONNABORTED') {
      console.error('⏱️ انتهت مهلة الطلب:', error.config.url);
    } else if (error.code === 'ERR_NETWORK') {
      console.error('🌐 خطأ في الشبكة (تأكد من تشغيل الخادم الخلفي):', error.message);
    } else if (error.response) {
      // الخادم رد بكود حالة خارج نطاق 2xx
      console.error(`❌ خطأ في استجابة الخادم (${error.response.status}):`, error.response.data);
    } else if (error.request) {
      // تم إجراء الطلب ولكن لم يتم تلقي أي استجابة
      console.error('⚠️ لم يتم تلقي استجابة من الخادم:', error.config.url);
    } else {
      // حدث خطأ عند إعداد الطلب
      console.error('🔴 خطأ في إعداد الطلب:', error.message);
    }

    // التحقق من وجود response قبل محاولة الوصول إلى خصائصه
    if (!error.response) {
      return Promise.reject(
        new Error("خطأ في الاتصال بالشبكة. يرجى التحقق من اتصال الإنترنت وتأكد من تشغيل الخادم الخلفي.")
      );
    }

    const originalRequest = error.config;

    // إذا كان الخطأ بسبب عدم وجود مصادقة، قم بتوجيه المستخدم لتسجيل الدخول
    if (error.response.status === 401) {
      await AsyncStorage.removeItem("access_token");
      await AsyncStorage.removeItem("refresh_token");
      NavigationService.navigate("Login");
      return Promise.reject(error);
    }

    // محاولة تحديث الرمز المميز إذا كان غير صالح
    if (
      error.response.status === 401 &&
      (error.response.data.code === "token_not_valid" || error.response.data.detail === "Invalid token")
    ) {
      const refreshToken = await AsyncStorage.getItem("refresh_token");

      if (refreshToken) {
        try {
          // محاولة تحديث الرمز المميز
          const response = await customInstance.post(API_BASE_URL + "/api/token/refresh/", {
            refresh: refreshToken,
          });
          
          // تخزين الرموز المميزة الجديدة
          await AsyncStorage.setItem("access_token", response.data.access);
          if (response.data.refresh) {
            await AsyncStorage.setItem("refresh_token", response.data.refresh);
          }

          // تحديث ترويسات المصادقة
          axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

          // إعادة محاولة الطلب الأصلي
          return axiosInstance(originalRequest);
        } catch (err) {
          console.error('❌ فشل تحديث الرمز المميز:', err);
          // مسح الرموز المميزة وتوجيه المستخدم لتسجيل الدخول مجدداً
          await AsyncStorage.removeItem("access_token");
          await AsyncStorage.removeItem("refresh_token");
          NavigationService.navigate("Login");
        }
      } else {
        console.log("رمز التحديث غير متوفر.");
        NavigationService.navigate("Login");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
