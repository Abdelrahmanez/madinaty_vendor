import React, { useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import AppButton from '../../../../components/AppButton';
import useAuthStore from '../../../../stores/authStore';
import { useErrorHandler } from '../../../../utils/errorHandler';

const MoreScreen = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { logout } = useAuthStore();
  const { showConfirmationDialog, handleError } = useErrorHandler();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    showConfirmationDialog(
      'تسجيل الخروج',
      'هل أنت متأكد من أنك تريد تسجيل الخروج؟',
      async () => {
        try {
          setIsLoggingOut(true);
          await logout();
          // بعد تسجيل الخروج بنجاح، توجيه المستخدم إلى شاشة تسجيل الدخول
          navigation.reset({
            index: 0,
            routes: [{ name: 'Auth' }],
          });
        } catch (error) {
          handleError(error, 'تسجيل الخروج');
        } finally {
          setIsLoggingOut(false);
        }
      }
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <AppButton
          mode="contained"
          onPress={handleLogout}
          disabled={isLoggingOut}
          loading={isLoggingOut}
          style={[styles.logoutButton, { backgroundColor: theme.colors.error }]}
          labelStyle={styles.logoutButtonLabel}
        >
          {isLoggingOut ? 'جاري تسجيل الخروج...' : 'تسجيل الخروج'}
        </AppButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoutButton: {
    width: '100%',
    maxWidth: 300,
  },
  logoutButtonLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MoreScreen;
