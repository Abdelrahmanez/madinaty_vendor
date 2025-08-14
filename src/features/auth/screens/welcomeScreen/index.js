import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StatusBar } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from 'react-i18next';
import useAuth from '../../hooks/useAuth';
import useStyles from "./styles";
import useAuthStore from '../../../../stores/authStore';

const WelcomeScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const { skipAuth } = useAuth();
  const { isAuthenticated } = useAuthStore(); // استدعاء حالة المصادقة
  const styles = useStyles();

  // التحقق من حالة المستخدم عند تحميل الشاشة
  useEffect(() => {
    if (isAuthenticated) {
      // إذا كان المستخدم مسجل دخوله بالفعل، يتم توجيهه إلى الشاشة الرئيسية
      navigation.replace('Home');
    }
  }, [isAuthenticated, navigation]);

  // Handle login button press
  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  // Handle signup button press
  const handleSignupPress = () => {
    navigation.navigate('Signup');
  };

  // Handle skip login (continue as guest)
  const handleSkip = () => {
    skipAuth();
    navigation.replace('Home');
  };

  // إذا كان المستخدم مسجل دخوله، لا تعرض شيئًا حتى يعمل useEffect الخاص بالتوجيه
  if (isAuthenticated) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../../assets/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>Madinaty</Text>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.welcomeText}>
          {t('loginScreen.title')}
        </Text>
        <Text style={styles.descriptionText}>
          {t('loginScreen.noAccount')}
        </Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          style={styles.loginButton}
          onPress={handleLoginPress}
        >
          {t('loginScreen.loginButton')}
        </Button>
        
        <Button
          mode="outlined"
          style={styles.signupButton}
          onPress={handleSignupPress}
        >
          {t('loginScreen.createAccount')}
        </Button>
        
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
        >
          <Text style={styles.skipButtonText}>{t('loginScreen.skipLogin')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
