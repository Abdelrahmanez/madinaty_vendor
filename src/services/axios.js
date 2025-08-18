import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NavigationService from "../navigation/NavigationService";
import { API_BASE_URL, API_ENDPOINTS } from "../config/api";
import useAuthStore from "../stores/authStore";

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
  
  // ضبط Content-Type فقط إذا لم يكن Multipart
  if (request.method === 'post' || request.method === 'put' || request.method === 'patch') {
    const explicitHeader = request.headers && (request.headers["Content-Type"] || request.headers["content-type"]);
    const isMultipart = explicitHeader && String(explicitHeader).toLowerCase().includes('multipart/form-data');
    const isFormData = typeof FormData !== 'undefined' && request.data instanceof FormData;
    // If sending FormData, let axios set the correct boundary automatically
    if (isFormData) {
      if (request.headers["Content-Type"]) delete request.headers["Content-Type"];
      if (request.headers["content-type"]) delete request.headers["content-type"];
    } else if (!isMultipart) {
      request.headers["Content-Type"] = "application/json";
    }
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

    const originalRequest = error.config || {};

    // Queue-based refresh handling
    if (error.response.status === 401) {
      const refreshToken = await AsyncStorage.getItem("refresh_token");

      // Do not attempt refresh for auth endpoints to avoid loops
      const isAuthEndpoint = (originalRequest.url || '').includes(API_ENDPOINTS.AUTH.LOGIN)
        || (originalRequest.url || '').includes(API_ENDPOINTS.AUTH.SIGNUP)
        || (originalRequest.url || '').includes(API_ENDPOINTS.AUTH.REFRESH_TOKEN);

      if (!refreshToken || isAuthEndpoint) {
        // Hard logout
        await AsyncStorage.removeItem("access_token");
        await AsyncStorage.removeItem("refresh_token");
        try {
          const setUnauthenticated = useAuthStore.getState()?.setUnauthenticated;
          setUnauthenticated && setUnauthenticated();
        } catch {}
        NavigationService.navigate("Auth");
        return Promise.reject(error);
      }

      if (originalRequest._retry) {
        // Already retried once; avoid loops
        await AsyncStorage.removeItem("access_token");
        await AsyncStorage.removeItem("refresh_token");
        NavigationService.navigate("Auth");
        return Promise.reject(error);
      }
      originalRequest._retry = true;

      // Shared refresh state
      if (!customInstance.__isRefreshing) {
        customInstance.__isRefreshing = true;
        customInstance.__refreshPromise = (async () => {
          try {
            const res = await customInstance.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, { refreshToken });
            const newAccess = res?.data?.accessToken || res?.data?.access || res?.accessToken;
            const newRefresh = res?.data?.refreshToken || res?.data?.refresh || res?.refreshToken;
            if (newAccess) {
              await AsyncStorage.setItem("access_token", newAccess);
              axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`;
            }
            if (newRefresh) {
              await AsyncStorage.setItem("refresh_token", newRefresh);
            }
            return newAccess;
          } catch (rfErr) {
            // Hard logout on refresh failure
            await AsyncStorage.removeItem("access_token");
            await AsyncStorage.removeItem("refresh_token");
            try {
              const setUnauthenticated = useAuthStore.getState()?.setUnauthenticated;
              setUnauthenticated && setUnauthenticated();
            } catch {}
            NavigationService.navigate("Auth");
            throw rfErr;
          } finally {
            customInstance.__isRefreshing = false;
          }
        })();
      }

      try {
        const token = await customInstance.__refreshPromise;
        if (token) {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        return axiosInstance(originalRequest);
      } catch (e2) {
        return Promise.reject(e2);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
