// Test file for error handler (for reference)
import { extractErrorMessage, getErrorType } from './errorHandler';

// Test cases for different error formats

// Test 1: Your specific error format
const stockError = {
  response: {
    data: {
      status: "fail",
      error: {
        statusCode: 400,
        status: "fail",
        isOperational: true
      },
      message: "لا يوجد مخزون كافٍ من Margherita (Large). المتاح حالياً: 0",
      stack: "Error: لا يوجد مخزون كافٍ من Margherita (Large). المتاح حالياً: 0\n..."
    }
  }
};

// Test 2: Validation errors
const validationError = {
  response: {
    data: {
      errors: [
        { msg: 'معرف المنتج مطلوب', param: 'dishId' },
        { msg: 'معرف الحجم غير صالح', param: 'selectedSize' }
      ]
    }
  }
};

// Test 3: Network error
const networkError = {
  code: 'NETWORK_ERROR',
  message: 'Network Error'
};

// Test 4: Simple error
const simpleError = {
  response: {
    data: {
      error: 'حدث خطأ في الخادم'
    }
  }
};

// Expected results:
// extractErrorMessage(stockError) should return: "لا يوجد مخزون كافٍ من Margherita (Large). المتاح حالياً: 0"
// getErrorType(stockError) should return: "warning" (because it contains "مخزون")
// extractErrorMessage(validationError) should return: "معرف المنتج مطلوب, معرف الحجم غير صالح"
// getErrorType(validationError) should return: "error"
// extractErrorMessage(networkError) should return: "فشل في الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت"
// getErrorType(networkError) should return: "warning" 