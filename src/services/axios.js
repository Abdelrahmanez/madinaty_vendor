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

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

/**
 * التحقق من إمكانية إعادة محاولة الطلب
 */
const canRetryRequest = (request) => {
  // لا نعيد محاولة طلبات تحديث الرمز المميز
  if (request.url === API_ENDPOINTS.AUTH.REFRESH_TOKEN) {
    return false;
  }
  
  // لا نعيد محاولة الطلبات التي تمت محاولتها بالفعل
  if (request._retry) {
    return false;
  }
  
  return true;
};

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

/**
 * تحديث الرمز المميز باستخدام رمز التحديث
 */
const refreshAccessToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem("refresh_token");
    
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    console.log('🔄 محاولة تحديث الرمز المميز...');
    
    const response = await customInstance.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
      refresh: refreshToken,
    });

    const { access, refresh } = response.data;
    
    // حفظ الرموز المميزة الجديدة
    await AsyncStorage.setItem("access_token", access);
    if (refresh) {
      await AsyncStorage.setItem("refresh_token", refresh);
    }

    // تحديث حالة المصادقة في المتجر
    const updateTokens = useAuthStore.getState()?.updateTokens;
    if (updateTokens) {
      await updateTokens(access, refresh);
    }

    // تحديث ترويسات المصادقة
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${access}`;
    customInstance.defaults.headers.common["Authorization"] = `Bearer ${access}`;

    console.log('✅ تم تحديث الرمز المميز بنجاح');
    
    return access;
  } catch (error) {
    console.error('❌ فشل تحديث الرمز المميز:', error);
    throw error;
  }
};

/**
 * مسح جميع بيانات المصادقة وتوجيه المستخدم للصفحة الرئيسية
 */
const clearAuthAndNavigateHome = async () => {
  try {
    console.log('🚪 مسح بيانات المصادقة وتوجيه المستخدم للصفحة الرئيسية...');
    
    // مسح الرموز المميزة
    await AsyncStorage.removeItem("access_token");
    await AsyncStorage.removeItem("refresh_token");
    await AsyncStorage.removeItem("userData");
    
    // تحديث حالة المصادقة في المتجر
    const clearAuthData = useAuthStore.getState()?.clearAuthData;
    if (clearAuthData) {
      await clearAuthData();
    }
    
    // توجيه المستخدم للصفحة الرئيسية
    NavigationService.navigate("Home");
    
  } catch (error) {
    console.error('❌ خطأ أثناء مسح بيانات المصادقة:', error);
    // محاولة التوجيه حتى لو فشل مسح البيانات
    NavigationService.navigate("Home");
  }
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

    // إذا كان الخطأ بسبب عدم وجود مصادقة (401)
    if (error.response.status === 401) {
      console.log('🔐 خطأ 401 - محاولة معالجة المصادقة...');
      
      // التحقق من إمكانية إعادة محاولة الطلب
      if (!canRetryRequest(originalRequest)) {
        console.log('🔄 الطلب لا يمكن إعادة محاولته، مسح المصادقة...');
        await clearAuthAndNavigateHome();
        return Promise.reject(error);
      }

      // التحقق من نوع خطأ 401
      const errorData = error.response.data;
      const isTokenExpired = errorData?.code === "Invalid token. Please log in again" || 
                            errorData?.detail === "Invalid token" ||
                            errorData?.message === "Token is invalid or expired";
      
      if (!isTokenExpired) {
        console.log('🔐 خطأ 401 غير متعلق بانتهاء صلاحية الرمز المميز:', errorData);
        await clearAuthAndNavigateHome();
        return Promise.reject(error);
      }

      console.log('🔄 انتهت صلاحية الرمز المميز، محاولة التحديث...');

      if (isRefreshing) {
        // إذا كان هناك تحديث جاري، أضف الطلب إلى قائمة الانتظار
        console.log('⏳ هناك تحديث جاري، إضافة الطلب لقائمة الانتظار...');
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // محاولة تحديث الرمز المميز
        const newToken = await refreshAccessToken();
        
        // معالجة قائمة الانتظار
        processQueue(null, newToken);
        
        // إعادة محاولة الطلب الأصلي
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        console.log('🔄 إعادة محاولة الطلب الأصلي مع الرمز المميز الجديد');
        return axiosInstance(originalRequest);
        
      } catch (refreshError) {
        console.error('❌ فشل تحديث الرمز المميز:', refreshError);
        
        // معالجة قائمة الانتظار مع الخطأ
        processQueue(refreshError, null);
        
        // مسح المصادقة وتوجيه المستخدم للصفحة الرئيسية
        await clearAuthAndNavigateHome();
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
