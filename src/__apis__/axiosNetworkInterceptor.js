import axios from 'axios';

/**
 * إضافة معترضات للتعامل مع أخطاء الشبكة في Axios
 * @param {Object} axiosInstance - نسخة axios المراد إضافة المعترضات لها
 * @param {Function} checkNetworkStatus - دالة للتحقق من حالة الاتصال بالشبكة
 * @returns {Function} دالة لإزالة المعترضات
 */
export const setupNetworkInterceptors = (axiosInstance, checkNetworkStatus) => {
  // معرّفات المعترضات للاستخدام في الإزالة لاحقًا
  const requestInterceptor = axiosInstance.interceptors.request.use(
    async (config) => {
      // التحقق من حالة الاتصال قبل إرسال الطلب
      const { isConnected, isServerReachable } = await checkNetworkStatus();
      
      if (!isConnected) {
        // إلغاء الطلب إذا لم يكن هناك اتصال بالإنترنت
        return Promise.reject({
          networkError: true,
          message: 'لا يوجد اتصال بالإنترنت',
          requestUrl: config.url,
        });
      }
      
      if (!isServerReachable) {
        // إلغاء الطلب إذا كان الخادم غير متاح
        return Promise.reject({
          networkError: true,
          message: 'الخادم غير متاح، يرجى المحاولة لاحقًا',
          requestUrl: config.url,
        });
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  const responseInterceptor = axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.networkError) {
        // إعادة توجيه أخطاء الشبكة من معترض الطلبات
        return Promise.reject(error);
      }
      
      // التعامل مع أخطاء الشبكة
      if (axios.isCancel(error)) {
        console.log('الطلب تم إلغاؤه:', error.message);
      } else if (error.code === 'ECONNABORTED') {
        console.error('⏱️ انتهت مهلة الطلب:', error.config.url);
      } else if (error.code === 'ERR_NETWORK') {
        console.error('🌐 خطأ في الشبكة:', error.message);
      }
      
      return Promise.reject(error);
    }
  );
  
  // إرجاع دالة لإزالة المعترضات
  return () => {
    axiosInstance.interceptors.request.eject(requestInterceptor);
    axiosInstance.interceptors.response.eject(responseInterceptor);
  };
};

export default setupNetworkInterceptors; 