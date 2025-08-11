import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Dimensions,
  I18nManager,
  Modal
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNetwork } from '../context/NetworkContext';
import { useTranslation } from 'react-i18next';
import OfflineScreen from './OfflineScreen';

const { width } = Dimensions.get('window');
const isRTL = I18nManager.isRTL;

/**
 * مكون لعرض تنبيه عند انقطاع الاتصال بالإنترنت أو الخادم
 */
const ConnectionAlert = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { isConnected, isServerReachable, checkConnection } = useNetwork();
  const [visible, setVisible] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const translateY = useState(new Animated.Value(-100))[0];
  const offlineTimerRef = useRef(null);
  
  // عرض أو إخفاء التنبيه بناءً على حالة الاتصال
  useEffect(() => {
    // إلغاء أي مؤقت سابق
    if (offlineTimerRef.current) {
      clearTimeout(offlineTimerRef.current);
      offlineTimerRef.current = null;
    }
    
    if (!isConnected || !isServerReachable) {
      setVisible(true);
      Animated.spring(translateY, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
      
      // إذا استمر انقطاع الاتصال لأكثر من 10 ثوانٍ، نعرض الشاشة الكاملة
      offlineTimerRef.current = setTimeout(() => {
        setShowFullScreen(true);
      }, 10000);
    } else {
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setVisible(false);
        setShowFullScreen(false);
      });
    }
    
    // تنظيف المؤقت عند إلغاء تحميل المكون
    return () => {
      if (offlineTimerRef.current) {
        clearTimeout(offlineTimerRef.current);
      }
    };
  }, [isConnected, isServerReachable]);
  
  // التعامل مع إعادة الاتصال
  const handleRetry = async () => {
    setRetrying(true);
    await checkConnection();
    setRetrying(false);
  };
  
  if (!visible && !showFullScreen) return null;
  
  // تحديد نوع الخطأ ورسالته
  let iconName = 'wifi-off';
  let message = t('connectionAlert.noInternet');
  let color = theme.colors.error;
  const isServerProblem = isConnected && !isServerReachable;
  
  if (isServerProblem) {
    iconName = 'server-network-off';
    message = t('connectionAlert.serverUnreachable');
    color = theme.colors.warning;
  }
  
  return (
    <>
      {/* شاشة عدم الاتصال بالكامل */}
      <Modal
        visible={showFullScreen}
        animationType="fade"
        transparent={false}
        onRequestClose={handleRetry}
      >
        <OfflineScreen 
          onRetry={handleRetry} 
          isServerProblem={isServerProblem} 
        />
      </Modal>
      
      {/* تنبيه صغير */}
      {visible && !showFullScreen && (
        <Animated.View 
          style={[
            styles.container,
            { 
              backgroundColor: color,
              transform: [{ translateY }] 
            }
          ]}
        >
          <View style={styles.content}>
            <MaterialCommunityIcons name={iconName} size={24} color="white" />
            <Text style={styles.message}>{message}</Text>
          </View>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={handleRetry}
            disabled={retrying}
          >
            {retrying ? (
              <MaterialCommunityIcons name="loading" size={20} color="white" />
            ) : (
              <MaterialCommunityIcons name="refresh" size={20} color="white" />
            )}
          </TouchableOpacity>
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 12,
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 9999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  content: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
  },
  message: {
    color: 'white',
    marginHorizontal: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  retryButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});

export default ConnectionAlert; 