import { useCallback } from 'react';
import useAlertStore from '../stores/alertStore';
import { triggerHapticFeedback } from '../utils/hapticFeedback';
import { extractErrorMessage, getErrorType } from '../utils/errorHandler';

export const useErrorHandler = () => {
  const { triggerAlert } = useAlertStore();

  const handleError = useCallback((error, customMessage = null) => {
    // Extract error message
    const errorMessage = customMessage || extractErrorMessage(error);
    const errorType = getErrorType(error);
    
    // Trigger appropriate haptic feedback
    if (errorType === 'warning') {
      triggerHapticFeedback('warning');
    } else {
      triggerHapticFeedback('error');
    }
    
    // Show alert
    triggerAlert(errorType, errorMessage);
    
    // Log error for debugging
    console.error('API Error:', {
      message: errorMessage,
      type: errorType,
      originalError: error
    });
    
    return { errorMessage, errorType };
  }, [triggerAlert]);

  const handleSuccess = useCallback((message = 'تمت العملية بنجاح') => {
    triggerHapticFeedback('success');
    triggerAlert('success', message);
  }, [triggerAlert]);

  return {
    handleError,
    handleSuccess
  };
}; 