import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

/**
 * Custom error handler for the app
 */
export class AppError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR', details = null) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
  }
}

/**
 * Handle API errors
 * @param {Error} error - The error object
 * @param {string} context - Context where the error occurred
 * @returns {string} - User-friendly error message
 */
export const handleApiError = (error, context = '') => {
  if (__DEV__) {
    console.error(`API Error in ${context}:`, error);
  }

  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data?.message || 'بيانات غير صحيحة';
      case 401:
        return 'غير مصرح لك بالوصول';
      case 403:
        return 'غير مسموح لك بهذا الإجراء';
      case 404:
        return 'المورد المطلوب غير موجود';
      case 422:
        return data?.message || 'بيانات غير صحيحة';
      case 500:
        return 'خطأ في الخادم';
      default:
        return data?.message || 'حدث خطأ غير متوقع';
    }
  } else if (error.request) {
    // Network error
    return 'خطأ في الاتصال بالشبكة';
  } else {
    // Other errors
    return error.message || 'حدث خطأ غير متوقع';
  }
};

/**
 * Show error alert to user
 * @param {string} title - Alert title
 * @param {string} message - Alert message
 * @param {Function} onPress - Callback when user presses OK
 */
export const showErrorAlert = (title, message, onPress = null) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: 'حسناً',
        onPress: onPress
      }
    ]
  );
};

/**
 * Show success alert to user
 * @param {string} title - Alert title
 * @param {string} message - Alert message
 * @param {Function} onPress - Callback when user presses OK
 */
export const showSuccessAlert = (title, message, onPress = null) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: 'حسناً',
        onPress: onPress
      }
    ]
  );
};

/**
 * Show confirmation dialog
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 * @param {Function} onConfirm - Callback when user confirms
 * @param {Function} onCancel - Callback when user cancels
 */
export const showConfirmationDialog = (title, message, onConfirm, onCancel = null) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: 'إلغاء',
        style: 'cancel',
        onPress: onCancel
      },
      {
        text: 'تأكيد',
        onPress: onConfirm
      }
    ]
  );
};

/**
 * Hook for error handling with translations
 */
export const useErrorHandler = () => {
  const { t } = useTranslation();

  const handleError = (error, context = '') => {
    const message = handleApiError(error, context);
    showErrorAlert(t('common.error'), message);
  };

  const showNetworkError = () => {
    showErrorAlert(t('common.error'), t('common.networkError'));
  };

  const showServerError = () => {
    showErrorAlert(t('common.error'), t('common.serverError'));
  };

  const showUnknownError = () => {
    showErrorAlert(t('common.error'), t('common.unknownError'));
  };

  return {
    handleError,
    showNetworkError,
    showServerError,
    showUnknownError,
    showErrorAlert,
    showSuccessAlert,
    showConfirmationDialog
  };
}; 