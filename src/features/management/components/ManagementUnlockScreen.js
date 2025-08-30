import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TopBar from '../../../components/TopBar';
import { verifyFinancialPinRequest } from '../../auth/api/auth';
import useManagementStore from '../../../stores/financeStore';

const ManagementUnlockScreen = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const { unlockManagement, isManagementUnlocked } = useManagementStore();

  const clearPin = () => {
    setPin('');
  };

  // Clear PIN when management is locked/unlocked
  useEffect(() => {
    if (!isManagementUnlocked) {
      clearPin();
    }
  }, [isManagementUnlocked]);

  // Clear PIN on initial load
  useEffect(() => {
    clearPin();
  }, []);

  const handleVerify = async () => {
    if (!pin || pin.length !== 4) {
      Alert.alert('تنبيه', 'أدخل رمز PIN مكون من 4 أرقام فقط');
      return;
    }
    
    const currentPin = pin;
    clearPin();
    
    try {
      setLoading(true);
      const res = await verifyFinancialPinRequest(currentPin);
      const ok = res?.status === 'success' || res?.valid === true;
      
      if (ok) {
        unlockManagement();
      } else {
        Alert.alert('خطأ', 'رمز PIN غير صحيح');
      }
    } catch (e) {
      Alert.alert('خطأ', 'تعذر التحقق من رمز PIN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopBar 
        title="التحقق من الإدارة"
        showBackButton={false}
        backgroundColor={theme.colors.primary}
        titleColor={theme.colors.onPrimary}
      />
      
      <View style={styles.contentContainer}>
        <View style={styles.lockIconContainer}>
          <MaterialCommunityIcons 
            name="shield-lock" 
            size={80} 
            color={theme.colors.primary} 
          />
        </View>
        
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>
          التحقق من الإدارة
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          أدخل رمز PIN للوصول إلى إعدادات النظام
        </Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            value={pin}
            onChangeText={setPin}
            keyboardType="number-pad"
            secureTextEntry
            placeholder="••••"
            style={[styles.input, { 
              borderColor: theme.colors.outlineVariant,
              backgroundColor: theme.colors.surface,
              color: theme.colors.onSurface
            }]}
            maxLength={6}
            placeholderTextColor={theme.colors.onSurfaceVariant}
          />
        </View>
        
        <TouchableOpacity 
          onPress={handleVerify} 
          style={[styles.button, { backgroundColor: theme.colors.primary }]} 
          disabled={loading}
        >
          <Text style={[styles.buttonText, { color: theme.colors.onPrimary }]}>
            {loading ? 'جاري التحقق...' : 'دخول'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockIconContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 22,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  input: {
    width: 200,
    height: 56,
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 20,
    letterSpacing: 6,
    textAlign: 'center',
    fontWeight: '600',
  },
  button: {
    width: 200,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ManagementUnlockScreen;
