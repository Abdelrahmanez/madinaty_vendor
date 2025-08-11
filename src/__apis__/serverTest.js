import axios from "axios";
import { API_BASE_URL } from "../config/api";

/**
 * أداة للتحقق من الاتصال بالخادم الخلفي
 * يمكن استخدامها للتحقق من أن الخادم يعمل ويستجيب للطلبات
 */
export const checkServerConnection = async () => {
  console.log('🔄 جاري فحص الاتصال بالخادم:', API_BASE_URL);

  try {
    // محاولة إجراء طلب بسيط للتحقق من الاتصال (باستخدام Ping أو healthcheck)
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/health`,
      timeout: 5000, // مهلة قصيرة لهذا الفحص
    });

    console.log('✅ تم الاتصال بالخادم بنجاح!', response.status);
    return {
      success: true,
      status: response.status,
      message: 'تم الاتصال بالخادم بنجاح!'
    };
  } catch (error) {
    console.error('❌ فشل الاتصال بالخادم');
    
    if (error.code === 'ECONNABORTED') {
      console.error('⏱️ انتهت مهلة الاتصال');
      return {
        success: false,
        errorType: 'timeout',
        message: 'انتهت مهلة الاتصال - تأكد من أن عنوان الخادم صحيح وأنه قيد التشغيل'
      };
    }
    
    if (error.code === 'ERR_NETWORK') {
      console.error('🌐 لا يمكن الوصول للخادم:', error.message);
      return {
        success: false,
        errorType: 'network',
        message: `لا يمكن الوصول للخادم: ${error.message}. تحقق من تشغيل الخادم ومن إمكانية وصول التطبيق إليه.`
      };
    }

    // إذا كان الخادم يستجيب ولكن برمز حالة خطأ (مثل 404)
    if (error.response) {
      console.error(`🟡 الخادم استجاب برمز حالة: ${error.response.status}`);
      return {
        success: false,
        errorType: 'server_error',
        status: error.response.status,
        message: `الخادم استجاب برمز حالة: ${error.response.status}. قد يكون المسار /health غير متوفر، لكن الخادم متصل.`
      };
    }

    return {
      success: false,
      errorType: 'unknown',
      message: `خطأ غير معروف: ${error.message}`
    };
  }
};

/**
 * فحص متكامل لتشخيص مشاكل الشبكة
 * @returns {Object} نتائج فحص الاتصال
 */
export const runNetworkDiagnostics = async () => {
  console.log('📊 بدء تشخيص مشاكل الشبكة...');
  
  const results = {
    serverCheck: null,
    corsPolicies: null,
    authentication: null,
    endpoints: {}
  };
  
  // 1. فحص الاتصال بالخادم
  try {
    results.serverCheck = await checkServerConnection();
  } catch (err) {
    results.serverCheck = {
      success: false,
      errorType: 'exception',
      message: `حدث استثناء غير متوقع: ${err.message}`
    };
  }

  // 2. التحقق من سياسات CORS
  if (results.serverCheck.success || results.serverCheck.errorType === 'server_error') {
    try {
      console.log('🔍 التحقق من سياسات CORS...');
      const corsResponse = await axios({
        method: 'options',
        url: API_BASE_URL,
        timeout: 5000,
      });
      
      const headers = corsResponse.headers || {};
      results.corsPolicies = {
        success: true,
        allowOrigin: headers['access-control-allow-origin'],
        allowMethods: headers['access-control-allow-methods'],
        allowHeaders: headers['access-control-allow-headers'],
      };
      
      console.log('✅ تم التحقق من سياسات CORS');
    } catch (err) {
      results.corsPolicies = {
        success: false,
        message: `فشل التحقق من CORS: ${err.message}`
      };
      console.error('❌ فشل التحقق من سياسات CORS:', err.message);
    }
  } else {
    results.corsPolicies = {
      success: false,
      message: 'تم تخطي فحص CORS بسبب مشاكل الاتصال بالخادم'
    };
  }

  return results;
};

export default {
  checkServerConnection,
  runNetworkDiagnostics
}; 