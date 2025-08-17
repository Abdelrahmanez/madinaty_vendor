import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from 'react-native-paper';
import useFinanceStore from '../../stores/financeStore';
import { verifyFinancialPinRequest } from '../../features/auth/api/auth';

const Stack = createNativeStackNavigator();

const FinanceUnlockScreen = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const { unlockFinance } = useFinanceStore();

  const handleVerify = async () => {
    if (!pin || pin.length !== 4) {
      Alert.alert('تنبيه', 'أدخل رمز PIN مكون من 4 أرقام فقط');
      return;
    }
    try {
      setLoading(true);
      const res = await verifyFinancialPinRequest(pin);
      const ok = res?.status === 'success' || res?.valid === true;
      if (ok) {
        unlockFinance();
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
    <View style={styles.container}>
      <Text style={styles.title}>التحقق من الماليات</Text>
      <Text style={styles.subtitle}>أدخل رمز PIN المالي للوصول</Text>
      <TextInput
        value={pin}
        onChangeText={setPin}
        keyboardType="number-pad"
        secureTextEntry
        placeholder="••••"
        style={styles.input}
        maxLength={6}
      />
      <TouchableOpacity onPress={handleVerify} style={styles.button} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'جاري التحقق...' : 'دخول'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const FinanceHomePlaceholder = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>لوحة الماليات</Text>
  </View>
);

const FinanceNavigator = () => {
  const { isFinanceUnlocked } = useFinanceStore();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isFinanceUnlocked ? (
        <Stack.Screen name="FinanceUnlock" component={FinanceUnlockScreen} />
      ) : (
        <Stack.Screen name="FinanceHome" component={FinanceHomePlaceholder} />
      )}
    </Stack.Navigator>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 16,
  },
  input: {
    width: '60%',
    height: 52,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    letterSpacing: 4,
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    width: '60%',
    height: 52,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: theme.colors.onPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FinanceNavigator;


