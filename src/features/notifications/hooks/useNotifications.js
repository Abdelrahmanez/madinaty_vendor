import { useState, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { registerPushToken, unregisterPushToken } from '../api/notification';
import useAuthStore from '../../../stores/authStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshAuthHeaders } from '../../../services/axios';

// تكوين الإشعارات
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * دالة لطلب صلاحيات الإشعارات والحصول على Expo Push Token
 * @returns {Promise<string|null>} الـ token أو null إذا فشلت العملية
 */
export const getNotificationPermissionsAndToken = async () => {
  try {
    // 1. التحقق من إذا كان الجهاز حقيقي (وليس محاكي)
    if (!Device.isDevice) {
      console.warn('⚠️ الإشعارات غير مدعومة على المحاكيات. يرجى استخدام جهاز حقيقي للاختبار.');
      return null;
    }

    console.log('🔍 التحقق من صلاحيات الإشعارات...');
    
    // 2. التحقق من الأذونات الحالية
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    // 3. طلب الأذونات إذا لم تكن ممنوحة بالفعل
    if (existingStatus !== 'granted') {
      console.log('🙋‍♂️ طلب صلاحيات الإشعارات من المستخدم...');
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    // 4. التحقق من موافقة المستخدم
    if (finalStatus !== 'granted') {
      console.warn('❌ رفض المستخدم منح صلاحيات الإشعارات');
      return null;
    }
    
    console.log('✅ تم الحصول على صلاحيات الإشعارات بنجاح');
    
    // 5. الحصول على Expo Push Token
    try {
      console.log('🔑 جاري الحصول على توكن الإشعارات...');
      const projectId = Constants?.expoConfig?.extra?.eas?.projectId;
      
      // Skip push notifications in development if no proper EAS project is configured
      if (!projectId || projectId === 'your-project-id-here') {
        console.log('تخطي الحصول على توكن الإشعارات - لم يتم تكوين معرف المشروع');
        return null;
      }
      
      console.log('استخدام projectId للإشعارات:', projectId);
      
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: projectId,
      });
      
      const token = tokenData.data;
      console.log('🎉 تم الحصول على توكن الإشعارات بنجاح:', token);
      
      return token;
    } catch (error) {
      console.error('❌ خطأ في الحصول على توكن الإشعارات:', error);
      return null;
    }
  } catch (error) {
    console.error('❌ خطأ غير متوقع أثناء التعامل مع الإشعارات:', error);
    return null;
  }
};

/**
 * Hook للتعامل فقط مع صلاحيات الإشعارات والحصول على token
 * هذا الـ hook منفصل عن hook الإشعارات الرئيسي
 */
export function useNotificationPermissions() {
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [registered, setRegistered] = useState(false);
  const { isAuthenticated } = useAuthStore();
  
  /**
   * إرسال توكن الإشعارات إلى الباك إند
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  const sendTokenToBackend = async (tokenToSend = null) => {
    setLoading(true);
    setError(null);
    
    try {
      // استخدام التوكن المقدم أو التوكن المخزن في الحالة
      const currentToken = tokenToSend || token;
      
      if (!currentToken) {
        setError('لا يوجد توكن للإرسال');
        return { success: false, error: 'لا يوجد توكن للإرسال' };
      }
      
      if (!isAuthenticated) {
        setError('يجب تسجيل الدخول أولاً');
        return { success: false, error: 'يجب تسجيل الدخول أولاً' };
      }
      
      console.log('🚀 جاري إرسال توكن الإشعارات إلى الباك إند...');
      
      // تحديث ترويسات المصادقة قبل إرسال الطلب
      await refreshAuthHeaders();
      
      // إرسال التوكن إلى الباك إند
      const result = await registerPushToken(currentToken);
      
      if (result.success) {
        console.log('✅ تم تسجيل توكن الإشعارات بنجاح في الباك إند');
        setRegistered(true);
        return { success: true, data: result.data };
      } else {
        console.error('❌ فشل تسجيل توكن الإشعارات:', result.error);
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error('❌ خطأ أثناء إرسال توكن الإشعارات للباك إند:', err);
      const errorMessage = err.message || 'حدث خطأ أثناء إرسال التوكن';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  
  // التحقق من الصلاحيات والحصول على token عند تحميل الـ hook
  useEffect(() => {
    const checkPermissionsAndGetToken = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 1. التحقق من الجهاز
        if (!Device.isDevice) {
          console.warn('⚠️ الإشعارات غير مدعومة على المحاكيات. يرجى استخدام جهاز حقيقي للاختبار.');
          setPermissionStatus('device-not-supported');
          return;
        }
        
        // 2. التحقق من الصلاحيات
        const { status } = await Notifications.getPermissionsAsync();
        setPermissionStatus(status);
        
        // 3. طلب الصلاحيات إذا لم تكن ممنوحة
        if (status !== 'granted') {
          console.log('🙋‍♂️ طلب صلاحيات الإشعارات من المستخدم...');
          const { status: newStatus } = await Notifications.requestPermissionsAsync();
          setPermissionStatus(newStatus);
          
          // 4. التحقق من الموافقة
          if (newStatus !== 'granted') {
            console.warn('❌ رفض المستخدم منح صلاحيات الإشعارات');
            return;
          }
        }
        
        // 5. الحصول على توكن الإشعارات
        const pushToken = await getNotificationPermissionsAndToken();
        setToken(pushToken);
        
        // 6. إرسال التوكن تلقائيًا للباك إند إذا كان المستخدم مسجل دخول
        if (pushToken && isAuthenticated) {
          console.log('💡 تم اكتشاف توكن إشعارات ومستخدم مسجل. جاري إرسال التوكن تلقائيًا للباك إند...');
          await sendTokenToBackend(pushToken);
        }
      } catch (err) {
        console.error('❌ خطأ أثناء طلب صلاحيات الإشعارات:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    checkPermissionsAndGetToken();
  }, [isAuthenticated]); // إعادة تنفيذ عند تغيير حالة تسجيل الدخول
  
  return {
    permissionStatus,
    token,
    loading,
    error,
    registered,
    // دالة لإعادة طلب الصلاحيات
    requestPermissions: async () => {
      setLoading(true);
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        setPermissionStatus(status);
        if (status === 'granted') {
          const pushToken = await getNotificationPermissionsAndToken();
          setToken(pushToken);
          
          // إرسال التوكن تلقائيًا بعد الحصول عليه إذا كان المستخدم مسجل دخول
          if (pushToken && isAuthenticated) {
            await sendTokenToBackend(pushToken);
          }
        }
        return status;
      } catch (err) {
        setError(err);
        return 'error';
      } finally {
        setLoading(false);
      }
    },
    // دالة لإرسال التوكن إلى الباك إند
    sendTokenToBackend
  };
}

/**
 * Hook للتعامل مع إشعارات Push
 * يقوم بتسجيل Token الإشعارات عند تسجيل الدخول
 * وتلقي الإشعارات وعرضها
 */
export default function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuthStore();
  const notificationListener = useRef();
  const responseListener = useRef();

  /**
   * الحصول على Expo Push Token
   * @returns {Promise<string|null>} الـ token أو null إذا فشلت العملية
   */
  const registerForPushNotificationsAsync = async () => {
    let token = null;
    
    try {
      // التحقق من إذا كان الجهاز حقيقي (وليس محاكي)
      if (!Device.isDevice) {
        console.log('الإشعارات تحتاج إلى جهاز حقيقي');
        setError('الإشعارات غير مدعومة على المحاكيات');
        return null;
      }

      // التحقق من الأذونات
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      // طلب الأذونات إذا لم تكن ممنوحة
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      // لا يمكن الحصول على الـ token إذا لم يتم منح الأذونات
      if (finalStatus !== 'granted') {
        console.log('فشل الحصول على إذن الإشعارات!');
        setError('لم يتم منح إذن الإشعارات');
        return null;
      }
      
      // الحصول على الـ token
      try {
        // تحديد معرّف المشروع - استخدام القيمة من التكوين أو القيمة الافتراضية
        const projectId = Constants?.expoConfig?.extra?.eas?.projectId;
        
        // Skip push notifications in development if no proper EAS project is configured
        if (!projectId || projectId === 'your-project-id-here') {
          console.log('تخطي الحصول على توكن الإشعارات - لم يتم تكوين معرف المشروع');
          return null;
        }
        
        const tokenData = await Notifications.getExpoPushTokenAsync({
          projectId: projectId,
        });
        token = tokenData.data;
        
        console.log('Expo push token:', token);
        
        // تخزين الـ token محلياً للاستخدام لاحقاً
        await AsyncStorage.setItem('expoPushToken', token);
      } catch (err) {
        console.error('خطأ في الحصول على توكن الإشعارات:', err);
        return null;
      }
      
      // تكوين خاص بنظام Android
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    } catch (err) {
      console.error('فشل تسجيل رمز الإشعارات:', err);
      setError(err.message);
      return null;
    }
    
    return token;
  };

  /**
   * تسجيل الـ token في الباك إند
   */
  const registerTokenWithBackend = async (token) => {
    if (!token) {
      token = await AsyncStorage.getItem('expoPushToken');
      if (!token) {
        token = await registerForPushNotificationsAsync();
      }
    }
    
    if (token && isAuthenticated) {
      setLoading(true);
      setError(null);
      
      try {
        console.log('إرسال توكن الإشعارات للباك إند:', token);
        
        // تأكد من تحديث ترويسات المصادقة قبل إرسال الطلب
        await refreshAuthHeaders();
        
        const result = await registerPushToken(token);
        
        if (!result.success) {
          console.error('فشل تسجيل توكن الإشعارات:', result.error);
          setError(result.error);
        } else {
          console.log('تم تسجيل توكن الإشعارات بنجاح');
        }
      } catch (err) {
        console.error('فشل تسجيل الـ token مع الباك إند:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } else if (!isAuthenticated) {
      console.log('لا يمكن تسجيل توكن الإشعارات: المستخدم غير مسجل الدخول');
    } else {
      console.log('لا يمكن تسجيل توكن الإشعارات: التوكن غير متوفر');
    }
  };

  /**
   * إلغاء تسجيل الـ token من الباك إند (عند تسجيل الخروج)
   */
  const unregisterToken = async () => {
    const token = await AsyncStorage.getItem('expoPushToken');
    
    if (token) {
      setLoading(true);
      try {
        // تأكد من تحديث ترويسات المصادقة قبل إرسال الطلب
        await refreshAuthHeaders();
        
        await unregisterPushToken(token);
        console.log('تم إلغاء تسجيل توكن الإشعارات بنجاح');
        
        // لا نقوم بحذف الـ token من التخزين المحلي
        // حتى نتمكن من استخدامه مرة أخرى عند تسجيل الدخول
      } catch (err) {
        console.error('فشل إلغاء تسجيل الـ token:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  /**
   * إرسال إشعار محلي (للاختبار)
   */
  const sendLocalNotification = async (title, body, data = {}) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger: { seconds: 1 },
    });
  };

  // تسجيل الإشعارات عند بدء التطبيق
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token);
        if (isAuthenticated) {
          registerTokenWithBackend(token);
        }
      }
    });

    // المستمع للإشعارات المستلمة أثناء فتح التطبيق
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // المستمع للتفاعل مع الإشعارات (النقر عليها)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('تم النقر على الإشعار:', response);
    });

    return () => {
      // تنظيف المستمعين عند إغلاق التطبيق
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // تسجيل/إلغاء تسجيل الـ token عند تغير حالة المصادقة
  useEffect(() => {
    if (isAuthenticated) {
      // تسجيل الـ token عند تسجيل الدخول
      registerTokenWithBackend();
    } else {
      // إلغاء تسجيل الـ token عند تسجيل الخروج
      unregisterToken();
    }
  }, [isAuthenticated]);

  return {
    expoPushToken,
    notification,
    loading,
    error,
    sendLocalNotification,
    registerForPushNotificationsAsync,
    registerTokenWithBackend,
    unregisterToken,
  };
} 