import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  Alert,
  I18nManager
} from 'react-native';
import { Button, TextInput, IconButton, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAuth from '../../hooks/useAuth';
import useStyles from './styles';
import NetworkDiagnostics from '../../components/NetworkDiagnostics';
import { API_BASE_URL } from '../../config/api';
import useAuthStore from '../../stores/authStore';

const LoginScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const { login, skipAuth, loading } = useAuth();
  const { isAuthenticated } = useAuthStore(); // استدعاء حالة المصادقة
  const styles = useStyles();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  
  // التحقق من حالة المستخدم عند تحميل الشاشة
  useEffect(() => {
    if (isAuthenticated) {
      // إذا كان المستخدم مسجل دخوله بالفعل، يتم توجيهه إلى الشاشة الرئيسية
      navigation.replace('MainTabs');
    }
  }, [isAuthenticated, navigation]);
  
  // Debug translations
  useEffect(() => {
    console.log('Current language in LoginScreen:', i18n.language);
    console.log('Login screen title translation:', t('loginScreen.title'));
    console.log('Phone number translation:', t('loginScreen.phoneNumber'));
    
    // Debug server connection
    console.log('API URL:', API_BASE_URL);
  }, []);
  
  // التحقق من صحة المدخلات
  const validateForm = () => {
    let isValid = true;
    
    if (!phoneNumber) {
      setPhoneError(t('signupScreen.requiredField'));
      isValid = false;
    } else {
      setPhoneError('');
    }
    
    if (!password) {
      setPasswordError(t('signupScreen.requiredField'));
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    return isValid;
  };
  
  // معالجة تسجيل الدخول
  const handleLogin = async () => {
    if (!validateForm()) return;
    
    try {
      const { success } = await login(phoneNumber, password);
      
      if (success) {
        // الانتقال إلى الصفحة الرئيسية مع القائمة السفلية
        navigation.navigate('MainTabs');
      }
    } catch (error) {
      Alert.alert(
        "خطأ في تسجيل الدخول",
        "تعذر الاتصال بالخادم. هل ترغب في عرض أداة تشخيص الشبكة؟",
        [
          { text: "لا", style: "cancel" },
          { text: "نعم", onPress: () => setShowDiagnostics(true) }
        ]
      );
    }
  };
  
  // تخطي تسجيل الدخول
  const handleSkip = () => {
    skipAuth();
    navigation.replace('MainTabs');
  };

  // إذا كان المستخدم مسجل دخوله، لا تعرض شيئًا حتى يعمل useEffect الخاص بالتوجيه
  if (isAuthenticated) {
    return null;
  }

  // إضافة تكوين خاص بـ TextInput لدعم RTL
  const textInputProps = {
    style: styles.input,
    mode: "outlined",
    theme: { roundness: 12 },
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    textAlignVertical: 'center',
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('loginScreen.title')}</Text>
            
            {/* زر التشخيص */}
            <IconButton
              icon="wifi-alert"
              size={24}
              onPress={() => setShowDiagnostics(!showDiagnostics)}
              style={styles.diagnosticsButton}
            />
          </View>
          
          {showDiagnostics && (
            <>
              <NetworkDiagnostics />
              <Divider style={{ marginVertical: 20 }} />
            </>
          )}
          
          <View style={styles.form}>
            <TextInput
              {...textInputProps}
              label={t('loginScreen.phoneNumber')}
              value={phoneNumber}
              onChangeText={(text) => {
                setPhoneNumber(text);
                setPhoneError('');
              }}
              keyboardType="phone-pad"
              placeholder={t('loginScreen.phoneNumberPlaceholder')}
              error={!!phoneError}
            />
            {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
            
            <TextInput
              {...textInputProps}
              label={t('loginScreen.password')}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError('');
              }}
              secureTextEntry={secureTextEntry}
              placeholder={t('loginScreen.passwordPlaceholder')}
              error={!!passwordError}
              right={
                <TextInput.Icon
                  icon={secureTextEntry ? 'eye-off' : 'eye'}
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                />
              }
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>{t('loginScreen.forgotPassword')}</Text>
            </TouchableOpacity>
            
            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.button}
              loading={loading}
              disabled={loading}
            >
              {t('loginScreen.loginButton')}
            </Button>
            
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>{t('loginScreen.noAccount')}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.signupLink}>{t('loginScreen.createAccount')}</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}
              disabled={loading}
            >
              <Text style={styles.skipButtonText}>{t('loginScreen.skipLogin')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
