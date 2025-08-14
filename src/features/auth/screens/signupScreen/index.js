import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  I18nManager
} from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAuth from '../../hooks/useAuth';
import { styles } from './styles';
import DeliveryZonePicker from '../../../../components/DeliveryZonePicker';
import useAuthStore from '../../../../stores/authStore';

const SignupScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { signup, skipAuth, loading: authLoading } = useAuth();
  const { isAuthenticated } = useAuthStore(); // استدعاء حالة المصادقة
  
  // حالة النموذج
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [selectedArea, setSelectedArea] = useState(null);
  
  // حالة أخطاء التحقق
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [areaError, setAreaError] = useState('');
  
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState(true);

  // التحقق من حالة المستخدم عند تحميل الشاشة
  useEffect(() => {
    if (isAuthenticated) {
      // إذا كان المستخدم مسجل دخوله بالفعل، يتم توجيهه إلى الشاشة الرئيسية
      navigation.replace('MainTabs');
    }
  }, [isAuthenticated, navigation]);

  // التحقق من صحة النموذج
  const validateForm = () => {
    let isValid = true;
    
    // التحقق من الاسم
    if (!name) {
      setNameError(t('signupScreen.requiredField'));
      isValid = false;
    } else {
      setNameError('');
    }
    
    // التحقق من رقم الهاتف
    if (!phoneNumber) {
      setPhoneError(t('signupScreen.requiredField'));
      isValid = false;
    } else {
      setPhoneError('');
    }
    
    // التحقق من كلمة المرور
    if (!password) {
      setPasswordError(t('signupScreen.requiredField'));
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError(t('signupScreen.passwordPlaceholder'));
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    // التحقق من تأكيد كلمة المرور
    if (!confirmPassword) {
      setConfirmPasswordError(t('signupScreen.requiredField'));
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError(t('signupScreen.passwordMismatch'));
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }
    
    // التحقق من العنوان
    if (!address) {
      setAddressError(t('signupScreen.requiredField'));
      isValid = false;
    } else {
      setAddressError('');
    }
    
    // التحقق من اختيار المنطقة
    if (!selectedArea) {
      setAreaError(t('signupScreen.requiredField'));
      isValid = false;
    } else {
      setAreaError('');
    }
    
    return isValid;
  };
  
  // معالجة إنشاء الحساب
  const handleSignup = async () => {
    if (!validateForm()) return;
    
    const userData = {
      name,
      phoneNumber,
      password,
      address,
      areaId: selectedArea?._id
    };
    
    const { success } = await signup(userData);
    
    if (success) {
      // الانتقال للشاشة الرئيسية بعد التسجيل الناجح
      navigation.navigate('MainTabs');
    }
  };
  
  // تخطي التسجيل
  const handleSkip = () => {
    skipAuth();
    navigation.navigate('MainTabs');
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
            <Text style={styles.title}>{t('signupScreen.title')}</Text>
          </View>
          
          <View style={styles.form}>
            {/* الاسم الكامل */}
            <TextInput
              {...textInputProps}
              label={t('signupScreen.name')}
              value={name}
              onChangeText={(text) => {
                setName(text);
                setNameError('');
              }}
              placeholder={t('signupScreen.namePlaceholder')}
              error={!!nameError}
            />
            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
            
            {/* رقم الهاتف */}
            <TextInput
              {...textInputProps}
              label={t('signupScreen.phoneNumber')}
              value={phoneNumber}
              onChangeText={(text) => {
                setPhoneNumber(text);
                setPhoneError('');
              }}
              keyboardType="phone-pad"
              placeholder={t('signupScreen.phoneNumberPlaceholder')}
              error={!!phoneError}
            />
            {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
            
            {/* كلمة المرور */}
            <TextInput
              {...textInputProps}
              label={t('signupScreen.password')}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError('');
              }}
              secureTextEntry={secureTextEntry}
              placeholder={t('signupScreen.passwordPlaceholder')}
              error={!!passwordError}
              right={
                <TextInput.Icon
                  icon={secureTextEntry ? 'eye-off' : 'eye'}
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                />
              }
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            
            {/* تأكيد كلمة المرور */}
            <TextInput
              {...textInputProps}
              label={t('signupScreen.confirmPassword')}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setConfirmPasswordError('');
              }}
              secureTextEntry={secureConfirmTextEntry}
              placeholder={t('signupScreen.confirmPasswordPlaceholder')}
              error={!!confirmPasswordError}
              right={
                <TextInput.Icon
                  icon={secureConfirmTextEntry ? 'eye-off' : 'eye'}
                  onPress={() => setSecureConfirmTextEntry(!secureConfirmTextEntry)}
                />
              }
            />
            {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
            
            {/* العنوان */}
            <TextInput
              {...textInputProps}
              label={t('signupScreen.address')}
              value={address}
              onChangeText={(text) => {
                setAddress(text);
                setAddressError('');
              }}
              placeholder={t('signupScreen.addressPlaceholder')}
              error={!!addressError}
              multiline
            />
            {addressError ? <Text style={styles.errorText}>{addressError}</Text> : null}
            
            {/* منطقة التوصيل باستخدام المكون الجديد */}
            <DeliveryZonePicker
              selectedZone={selectedArea}
              onSelectZone={zone => {
                setSelectedArea(zone);
                setAreaError('');
              }}
              placeholder={t('signupScreen.areaPlaceholder')}
              label={t('signupScreen.area')}
              error={!!areaError}
              errorText={areaError}
            />
            
            {/* زر التسجيل */}
            <Button
              mode="contained"
              onPress={handleSignup}
              style={styles.button}
              loading={authLoading}
              disabled={authLoading}
            >
              {t('signupScreen.signupButton')}
            </Button>
            
            {/* تسجيل الدخول */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>{t('signupScreen.hasAccount')}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>{t('signupScreen.signIn')}</Text>
              </TouchableOpacity>
            </View>
            
            {/* تخطي التسجيل */}
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}
              disabled={authLoading}
            >
              <Text style={styles.skipButtonText}>{t('signupScreen.skipSignup')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen; 