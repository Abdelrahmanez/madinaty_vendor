import { useState } from 'react';
import { createOrder } from '../api/order';
import { useErrorHandler } from '../../../hooks/useErrorHandler';
import { PAYMENT_METHODS } from '../../../utils/enums';

export const useOrder = () => {
  const [loading, setLoading] = useState(false);
  const { handleError, handleSuccess } = useErrorHandler();

  const createNewOrder = async (orderData) => {
    setLoading(true);
    try {
      // بناء الـ body بشكل ديناميكي
      const orderPayload = {
        addressId: orderData.addressId,
        paymentMethod: orderData.paymentMethod || PAYMENT_METHODS.CASH,
        customerNotes: orderData.customerNotes || ''
      };
      // فقط أضف promoCode إذا كان موجود فعلاً
      if (orderData.promoCode) {
        orderPayload.promoCode = orderData.promoCode;
      }

      const response = await createOrder(orderPayload);
      
      handleSuccess('تم إنشاء الطلب بنجاح');
      
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createNewOrder,
    loading
  };
}; 