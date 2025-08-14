import React, { createContext, useState, useEffect, useContext } from 'react';
import { AppState, Platform } from 'react-native';
import * as Network from 'expo-network';
import { checkServerConnection } from '../services/serverTest';

/**
 * سياق (Context) لإدارة حالة اتصال الشبكة في التطبيق
 */
export const NetworkContext = createContext({
  isConnected: true,              // حالة الاتصال بالإنترنت
  isServerReachable: true,        // حالة الاتصال بالخادم
  connectionType: null,           // نوع الاتصال (wifi, cellular)
  lastChecked: null,              // آخر وقت تم فيه التحقق من الاتصال
  checkConnection: () => {},      // وظيفة لفحص الاتصال يدويًا
});

/**
 * مزود سياق الشبكة للتطبيق
 * @param {Object} props - خصائص المكون
 */
export const NetworkProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [isServerReachable, setIsServerReachable] = useState(true);
  const [connectionType, setConnectionType] = useState(null);
  const [lastChecked, setLastChecked] = useState(new Date());
  const [checkingConnection, setCheckingConnection] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);

  // التحقق من الاتصال بالإنترنت
  const checkInternetConnection = async () => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      setIsConnected(networkState.isConnected && networkState.isInternetReachable);
      setConnectionType(networkState.type);
      return networkState.isConnected && networkState.isInternetReachable;
    } catch (error) {
      console.error('خطأ في التحقق من اتصال الإنترنت:', error);
      setIsConnected(false);
      return false;
    }
  };

  // التحقق من إمكانية الوصول إلى الخادم
  const checkServerReachability = async () => {
    try {
      const response = await checkServerConnection();
      setIsServerReachable(response.success);
      return response.success;
    } catch (error) {
      console.error('خطأ في التحقق من الوصول للخادم:', error);
      setIsServerReachable(false);
      return false;
    }
  };

  // فحص الاتصال بشكل كامل (الإنترنت والخادم)
  const checkConnection = async () => {
    if (checkingConnection) return { isConnected, isServerReachable };
    
    try {
      setCheckingConnection(true);
      const internetConnected = await checkInternetConnection();
      let serverReachable = false;
      
      if (internetConnected) {
        serverReachable = await checkServerReachability();
      }
      
      setLastChecked(new Date());
      return { isConnected: internetConnected, isServerReachable: serverReachable };
    } catch (error) {
      console.error('خطأ في فحص الاتصال:', error);
      return { isConnected: false, isServerReachable: false };
    } finally {
      setCheckingConnection(false);
    }
  };

  // مراقبة تغييرات حالة التطبيق (مقدمة/خلفية)
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        // عند العودة للتطبيق من الخلفية
        checkConnection();
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription.remove();
    };
  }, [appState]);

  // التحقق الأولي من الاتصال عند تحميل التطبيق
  useEffect(() => {
    checkConnection();
    
    // جدولة فحص دوري للاتصال كل 30 ثانية
    const intervalId = setInterval(() => {
      checkConnection();
    }, 30000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const value = {
    isConnected,
    isServerReachable,
    connectionType,
    lastChecked,
    checkConnection,
  };

  return (
    <NetworkContext.Provider value={value}>
      {children}
    </NetworkContext.Provider>
  );
};

/**
 * Hook للوصول إلى حالة اتصال الشبكة
 * @returns {Object} حالة الشبكة والوظائف المرتبطة بها
 */
export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('يجب استخدام useNetwork داخل NetworkProvider');
  }
  return context;
};

export default NetworkProvider; 