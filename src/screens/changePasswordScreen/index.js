import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  I18nManager,
  TouchableOpacity
} from "react-native";
import { 
  useTheme, 
  TextInput,
  Button,
  IconButton
} from 'react-native-paper';
import TopBar from '../../components/TopBar';
import useAuthStore from '../../stores/authStore';
import useAlertStore from '../../stores/alertStore';
import axiosInstance from '../../__apis__/axios';
import { API_ENDPOINTS } from '../../config/api';

const isRTL = I18nManager.isRTL;

const ChangePasswordScreen = ({ navigation }) => {
  const theme = useTheme();
  const { user } = useAuthStore();
  const { triggerAlert } = useAlertStore();
  
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    password: "",
    passwordConfirm: "",
  });

  // حالة عرض/إخفاء كلمات المرور
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    password: false,
    passwordConfirm: false,
  });

  // إظهار أي خطأ في الإدخال
  const [errors, setErrors] = useState({
    currentPassword: "",
    password: "",
    passwordConfirm: "",
  });

  // التعامل مع تغيير قيمة الإدخال
  const handleInputChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    // مسح رسالة الخطأ عند تغيير القيمة
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // تبديل عرض/إخفاء كلمة المرور
  const toggleShowPassword = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // التحقق من صحة البيانات المدخلة
  const validateInputs = () => {
    let isValid = true;
    const newErrors = { 
      currentPassword: "", 
      password: "", 
      passwordConfirm: "" 
    };

    // التحقق من كلمة المرور الحالية
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "يرجى إدخال كلمة المرور الحالية";
      isValid = false;
    }

    // التحقق من كلمة المرور الجديدة
    if (!passwordData.password) {
      newErrors.password = "يرجى إدخال كلمة المرور الجديدة";
      isValid = false;
    } else if (passwordData.password.length < 6) {
      newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
      isValid = false;
    }

    // التحقق من تأكيد كلمة المرور
    if (!passwordData.passwordConfirm) {
      newErrors.passwordConfirm = "يرجى تأكيد كلمة المرور الجديدة";
      isValid = false;
    } else if (passwordData.password !== passwordData.passwordConfirm) {
      newErrors.passwordConfirm = "كلمات المرور غير متطابقة";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // تحديث كلمة المرور
  const handleSave = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.USER.UPDATE_PASSWORD, {
        currentPassword: passwordData.currentPassword,
        password: passwordData.password,
        passwordConfirm: passwordData.passwordConfirm
      });

      triggerAlert("success", "تم تغيير كلمة المرور بنجاح");
      // العودة إلى الشاشة السابقة
      navigation.goBack();
      
    } catch (error) {
      console.error("خطأ في تغيير كلمة المرور:", error);
      
      // التعامل مع أخطاء محددة من API
      if (error.response?.data?.message) {
        if (error.response.data.message.includes("current password")) {
          setErrors(prev => ({ 
            ...prev, 
            currentPassword: "كلمة المرور الحالية غير صحيحة" 
          }));
        } else {
          triggerAlert("error", error.response.data.message);
        }
      } else {
        triggerAlert("error", "فشل تغيير كلمة المرور. يرجى المحاولة مرة أخرى.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopBar 
        title="تغيير كلمة المرور"
        showBack={true}
        onBack={() => navigation.goBack()}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          {/* معلومات المستخدم للعرض فقط */}
          <View style={[styles.userInfoContainer, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
              المستخدم
            </Text>
            <Text style={[styles.value, { color: theme.colors.onSurface }]}>
              {user?.name || "مستخدم مدينتي"}
            </Text>
            
            <Text style={[styles.label, { color: theme.colors.onSurfaceVariant, marginTop: 16 }]}>
              رقم الهاتف
            </Text>
            <Text style={[styles.value, { color: theme.colors.onSurface }]}>
              {user?.phoneNumber || "غير متوفر"}
            </Text>
          </View>

          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>تغيير كلمة المرور</Text>

          {/* حقول إدخال كلمات المرور */}
          <View style={styles.formContainer}>
            {/* كلمة المرور الحالية */}
            <View style={styles.inputContainer}>
              <TextInput
                mode="outlined"
                label="كلمة المرور الحالية"
                value={passwordData.currentPassword}
                onChangeText={(value) => handleInputChange("currentPassword", value)}
                secureTextEntry={!showPasswords.currentPassword}
                style={[
                  styles.textInput, 
                  { borderColor: errors.currentPassword ? theme.colors.error : theme.colors.outline }
                ]}
                textAlign={isRTL ? 'right' : 'left'}
                right={
                  <TextInput.Icon 
                    icon={showPasswords.currentPassword ? "eye-off" : "eye"}
                    onPress={() => toggleShowPassword("currentPassword")}
                  />
                }
                error={!!errors.currentPassword}
              />
              {errors.currentPassword ? (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {errors.currentPassword}
                </Text>
              ) : null}
            </View>

            {/* كلمة المرور الجديدة */}
            <View style={styles.inputContainer}>
              <TextInput
                mode="outlined"
                label="كلمة المرور الجديدة"
                value={passwordData.password}
                onChangeText={(value) => handleInputChange("password", value)}
                secureTextEntry={!showPasswords.password}
                style={[
                  styles.textInput, 
                  { borderColor: errors.password ? theme.colors.error : theme.colors.outline }
                ]}
                textAlign={isRTL ? 'right' : 'left'}
                right={
                  <TextInput.Icon 
                    icon={showPasswords.password ? "eye-off" : "eye"}
                    onPress={() => toggleShowPassword("password")}
                  />
                }
                error={!!errors.password}
              />
              {errors.password ? (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {errors.password}
                </Text>
              ) : null}
              <Text style={styles.helperText}>
                كلمة المرور يجب أن تكون 6 أحرف على الأقل
              </Text>
            </View>

            {/* تأكيد كلمة المرور الجديدة */}
            <View style={styles.inputContainer}>
              <TextInput
                mode="outlined"
                label="تأكيد كلمة المرور الجديدة"
                value={passwordData.passwordConfirm}
                onChangeText={(value) => handleInputChange("passwordConfirm", value)}
                secureTextEntry={!showPasswords.passwordConfirm}
                style={[
                  styles.textInput, 
                  { borderColor: errors.passwordConfirm ? theme.colors.error : theme.colors.outline }
                ]}
                textAlign={isRTL ? 'right' : 'left'}
                right={
                  <TextInput.Icon 
                    icon={showPasswords.passwordConfirm ? "eye-off" : "eye"}
                    onPress={() => toggleShowPassword("passwordConfirm")}
                  />
                }
                error={!!errors.passwordConfirm}
              />
              {errors.passwordConfirm ? (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {errors.passwordConfirm}
                </Text>
              ) : null}
            </View>
            
            {/* زر الحفظ */}
            <Button
              mode="contained"
              onPress={handleSave}
              disabled={loading}
              loading={loading}
              style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
              labelStyle={styles.saveButtonText}
            >
              تغيير كلمة المرور
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  userInfoContainer: {
    padding: 16,
    borderRadius: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    textAlign: isRTL ? 'right' : 'left',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: isRTL ? 'right' : 'left',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: isRTL ? 'right' : 'left',
  },
  formContainer: {
    marginTop: 8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  textInput: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: 'transparent',
    textAlign: isRTL ? 'right' : 'left',
    writingDirection: 'rtl',
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    textAlign: isRTL ? 'right' : 'left',
  },
  helperText: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
    textAlign: isRTL ? 'right' : 'left',
  },
  saveButton: {
    marginTop: 16,
    paddingVertical: 6,
    borderRadius: 10,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default ChangePasswordScreen; 