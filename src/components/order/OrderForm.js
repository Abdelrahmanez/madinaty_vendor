import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useOrder } from '../../hooks/useOrder';
import { useGetCurrentAddress } from '../../hooks/useGetCurrentAddress';
import { PAYMENT_METHODS } from '../../utils/enums';
import CustomerNotes from './CustomerNotes';
import PromoCodeDisplay from './PromoCodeDisplay';
import LoadingButton from '../common/LoadingButton';

export default function OrderForm({ promoCode, onOrderSuccess, onOrderError }) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { createNewOrder, loading } = useOrder();
  const { currentAddress } = useGetCurrentAddress();
  
  const [customerNotes, setCustomerNotes] = useState('');

  // Debug: Log current address
  useEffect(() => {
    console.log('Current address:', currentAddress);
  }, [currentAddress]);

  const handleCreateOrder = async () => {
    try {
      const orderData = {
        addressId: currentAddress?._id, // تغيير من id إلى _id
        paymentMethod: PAYMENT_METHODS.CASH,
        promoCode: promoCode || null,
        customerNotes: customerNotes || ''
      };

      console.log('Creating order with data:', orderData);

      const result = await createNewOrder(orderData);
      
      if (onOrderSuccess) {
        onOrderSuccess(result);
      }
    } catch (error) {
      if (onOrderError) {
        onOrderError(error);
      }
    }
  };

  const handleRemovePromoCode = () => {
    // This would be handled by the parent component
    if (onOrderError) {
      onOrderError(new Error('Promo code removal not implemented'));
    }
  };

  // Form is valid if we have a current address
  const isFormValid = !!currentAddress?._id;

  return (
    <View style={styles.container}>
      {!currentAddress?._id && (
        <Text style={[styles.warningText, { color: theme.colors.error }]}>
          ⚠️ يرجى تحديد عنوان التوصيل أولاً
        </Text>
      )}
      
      <PromoCodeDisplay 
        promoCode={promoCode} 
        onRemove={handleRemovePromoCode}
      />
      
      <CustomerNotes 
        notes={customerNotes}
        onNotesChange={setCustomerNotes}
      />
      
      <LoadingButton
        onPress={handleCreateOrder}
        title={!currentAddress?._id ? "حدد العنوان أولاً" : "إنشاء الطلب"}
        loading={loading}
        disabled={!isFormValid}
        style={styles.submitButton}
      />
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  submitButton: {
    marginTop: 16,
  },
  warningText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
}); 