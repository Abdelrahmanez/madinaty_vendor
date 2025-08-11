import { useState, useEffect } from 'react';
import { loginRequest, registerRequest, logoutRequest } from '../__apis__/auth';
import useAuthStore from '../stores/authStore';
import useAlertStore from '../stores/alertStore';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerPushToken, unregisterPushToken } from '../__apis__/notification';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { refreshAuthHeaders } from '../__apis__/axios';

/**
 * Hook للتعامل مع عمليات المصادقة
 */
const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const { 
    login: storeLogin, 
    setUser, 
    isFirstTimeUser, 
    completeFirstTimeFlow,
    initializeAuth,
    logout: storeLogout
  } = useAuthStore();
  const { triggerAlert } = useAlertStore();
  const { t } = useTranslation();

  // Initialize authentication state from AsyncStorage
  useEffect(() => {
    initializeAuth();
  }, []);

  /**
   * تسجيل الـ push token مع الباك إند بعد تسجيل الدخول
   */
  const registerDeviceForNotifications = async () => {
    try {
      let token = await AsyncStorage.getItem('expoPushToken');
      
      if (!token) {
        // محاولة الحصول على token جديد إذا لم يكن موجودًا
        const { status } = await Notifications.getPermissionsAsync();
        if (status === 'granted') {
          try {
            const tokenData = await Notifications.getExpoPushTokenAsync({
              projectId: Constants?.expoConfig?.extra?.eas?.projectId,
            });
            token = tokenData.data;
            await AsyncStorage.setItem('expoPushToken', token);
          } catch (err) {
            console.error('خطأ في الحصول على توكن الإشعارات:', err);
            return;
          }
        } else {
          console.log('لا توجد أذونات للإشعارات');
          return;
        }
      }
      
      if (token) {
        console.log('إرسال توكن الإشعارات بعد تسجيل الدخول:', token);
        
        // تأكد من تحديث ترويسات المصادقة قبل إرسال الطلب
        await refreshAuthHeaders();
        
        // تسجيل الـ token مع الباك إند
        const result = await registerPushToken(token);
        
        if (result.success) {
          console.log('تم تسجيل توكن الإشعارات بنجاح بعد تسجيل الدخول');
        } else {
          console.error('فشل تسجيل توكن الإشعارات بعد تسجيل الدخول:', result.error);
        }
      }
    } catch (error) {
      console.error('فشل تسجيل جهاز للإشعارات:', error);
      // لا نريد أن نؤثر على تجربة المستخدم إذا فشل تسجيل الإشعارات
    }
  };

  /**
   * إلغاء تسجيل الـ push token عند تسجيل الخروج
   */
  const unregisterDeviceForNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem('expoPushToken');
      if (token) {
        // تأكد من تحديث ترويسات المصادقة قبل إرسال الطلب
        await refreshAuthHeaders();
        
        // إلغاء تسجيل الـ token
        const result = await unregisterPushToken(token);
        
        if (result.success) {
          console.log('تم إلغاء تسجيل توكن الإشعارات بنجاح عند تسجيل الخروج');
        } else {
          console.error('فشل إلغاء تسجيل توكن الإشعارات عند تسجيل الخروج:', result.error);
        }
      }
    } catch (error) {
      console.error('فشل إلغاء تسجيل الجهاز للإشعارات:', error);
    }
  };

  /**
   * تسجيل الدخول باستخدام رقم الهاتف وكلمة المرور
   */
  const login = async (phoneNumber, password) => {
    try {
      setLoading(true);
      const response = await loginRequest({ phoneNumber, password });
      
      // تخزين بيانات المستخدم وتوكن الوصول
      if (response && response.accessToken) {
        storeLogin(response.accessToken);
        
        // التحقق من وجود بيانات المستخدم قبل استخدامها
        if (response.data && response.data.user) {
          setUser(response.data.user);
        } else if (response.user) {
          // هيكل بديل قد يستخدمه API
          setUser(response.user);
        }

        // تحديث ترويسات المصادقة بعد تسجيل الدخول
        await refreshAuthHeaders();

        // تسجيل الجهاز للإشعارات
        await registerDeviceForNotifications();
      }
      
      return { success: true, data: response };
    } catch (error) {
      console.error('Login error:', error);
      triggerAlert('error', t('loginScreen.loginError'));
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  /**
   * تسجيل مستخدم جديد
   */
  const signup = async (userData) => {
    try {
      setLoading(true);
      const response = await registerRequest(userData);
      console.log('API Response from signup:', response);
      
      // تسجيل الدخول تلقائياً بعد التسجيل الناجح
      if (response && response.accessToken) {
        storeLogin(response.accessToken);
        
        // التعامل مع هياكل استجابة API المختلفة
        if (response.data && response.data.user) {
          setUser(response.data.user);
        } else if (response.user) {
          setUser(response.user);
        } else {
          // إذا لم يتم توفير بيانات المستخدم، قم فقط بتسجيل الدخول دون تعيين بيانات المستخدم
          console.log('تم إنشاء المستخدم بنجاح ولكن لم يتم استرداد بيانات المستخدم من API');
        }

        // تحديث ترويسات المصادقة بعد تسجيل الدخول
        await refreshAuthHeaders();
        
        // تسجيل الجهاز للإشعارات
        await registerDeviceForNotifications();
      }

      triggerAlert('success', t('signupScreen.signupSuccess'));
      
      return { success: true, data: response };
    } catch (error) {
      console.error('Signup error:', error);
      triggerAlert('error', t('signupScreen.signupError'));
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * تخطي عملية تسجيل الدخول (للمتابعة كضيف)
   */
  const skipAuth = () => {
    // مستخدم قام بتخطي التسجيل، لم يعد مستخدم جديد
    completeFirstTimeFlow();
    return { success: true };
  };

  /**
   * تسجيل الخروج وإزالة بيانات المستخدم
   */
  const logout = async () => {
    try {
      setLoading(true);
      // إلغاء تسجيل الجهاز من الإشعارات قبل تسجيل الخروج
      await unregisterDeviceForNotifications();
      
      // استدعاء API لتسجيل الخروج
      await logoutRequest();
      
      // تحديث المخزن
      storeLogout();
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // حتى في حالة الفشل، نقوم بتسجيل الخروج محلياً
      storeLogout();
      return { success: true, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    signup,
    skipAuth,
    logout,
    loading,
    isFirstTimeUser
  };
};

export default useAuth; 