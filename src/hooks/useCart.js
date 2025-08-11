import { useState } from 'react';
import { addToCart } from '../__apis__/cart';
import { useErrorHandler } from './useErrorHandler';

export const useCart = () => {
  const [loading, setLoading] = useState(false);
  const { handleError, handleSuccess } = useErrorHandler();

  const addItemToCart = async (cartData) => {
    setLoading(true);
    try {
      const response = await addToCart(cartData);
      
      // Handle success
      handleSuccess('تم إضافة العنصر إلى السلة بنجاح');
      
      return response.data;
    } catch (error) {
      // Handle error using the error handler
      handleError(error);
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    addItemToCart,
    loading
  };
}; 