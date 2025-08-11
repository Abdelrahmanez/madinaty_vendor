import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  I18nManager
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNetwork } from '../context/NetworkContext';

const { width, height } = Dimensions.get('window');
const isRTL = I18nManager.isRTL;

/**
 * شاشة تظهر عندما يكون التطبيق غير متصل بالإنترنت لفترة طويلة
 */
const OfflineScreen = ({ onRetry, isServerProblem = false }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [isRetrying, setIsRetrying] = React.useState(false);
  const { checkConnection } = useNetwork();
  
  const handleRetry = async () => {
    setIsRetrying(true);
    if (onRetry) {
      await onRetry();
    } else {
      await checkConnection();
    }
    setIsRetrying(false);
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <MaterialCommunityIcons 
          name={isServerProblem ? "server-network-off" : "wifi-off"} 
          size={100} 
          color={theme.colors.primary} 
          style={styles.icon}
        />
        
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>
          {isServerProblem 
            ? t('offlineScreen.serverTitle') 
            : t('offlineScreen.title')
          }
        </Text>
        
        <Text style={[styles.message, { color: theme.colors.onSurfaceVariant }]}>
          {isServerProblem 
            ? t('offlineScreen.serverMessage') 
            : t('offlineScreen.message')
          }
        </Text>
        
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleRetry}
          disabled={isRetrying}
        >
          {isRetrying ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <MaterialCommunityIcons name="refresh" size={20} color="white" />
              <Text style={styles.retryText}>
                {t('offlineScreen.retry')}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default OfflineScreen; 