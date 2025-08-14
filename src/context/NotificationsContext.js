import React, { createContext, useContext } from 'react';
import useNotifications from '../features/notifications/hooks/useNotifications';

// إنشاء سياق الإشعارات
const NotificationsContext = createContext({
  expoPushToken: '',
  notification: null,
  loading: false,
  error: null,
  sendLocalNotification: () => {},
  registerForPushNotificationsAsync: () => {},
  registerTokenWithBackend: () => {},
  unregisterToken: () => {},
});

/**
 * مزود سياق الإشعارات
 * يمكّن الوصول إلى وظائف الإشعارات في أي مكان في التطبيق
 */
export function NotificationsProvider({ children }) {
  const notificationsData = useNotifications();
  
  return (
    <NotificationsContext.Provider value={notificationsData}>
      {children}
    </NotificationsContext.Provider>
  );
}

/**
 * Hook لاستخدام سياق الإشعارات
 * @returns {Object} كائن يحتوي على وظائف ومعلومات الإشعارات
 */
export function useNotificationsContext() {
  return useContext(NotificationsContext);
}

export default NotificationsProvider; 