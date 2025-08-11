import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { PAYMENT_METHODS, PAYMENT_METHOD_LABELS } from '../../utils/enums';

export default function PaymentMethodDisplay({ paymentMethod = PAYMENT_METHODS.CASH }) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const getPaymentIcon = () => {
    switch (paymentMethod) {
      case PAYMENT_METHODS.CASH:
        return 'money';
      case PAYMENT_METHODS.CARD:
        return 'credit-card';
      case PAYMENT_METHODS.WALLET:
        return 'account-balance-wallet';
      default:
        return 'money';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>طريقة الدفع</Text>
      <View style={styles.methodContainer}>
        <MaterialIcons 
          name={getPaymentIcon()} 
          size={24} 
          color={theme.colors.primary} 
        />
        <Text style={styles.methodText}>
          {PAYMENT_METHOD_LABELS[paymentMethod]}
        </Text>
      </View>
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 8,
  },
  methodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  methodText: {
    fontSize: 16,
    color: theme.colors.onSurface,
    marginLeft: 12,
  },
}); 