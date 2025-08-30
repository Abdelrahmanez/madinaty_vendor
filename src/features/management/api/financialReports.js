import axiosInstance from '../../../services/axios';
import { API_ENDPOINTS } from '../../../config/api';

/**
 * Get vendor financial data
 * @param {string} restaurantId - Restaurant ID
 */
export const getVendorFinancialData = (restaurantId) => {
  const endpoint = API_ENDPOINTS.ACCOUNTS.VENDOR_FINANCIAL_DATA(restaurantId);
  console.log('🏪 Calling vendor financial data endpoint:', endpoint);
  return axiosInstance.get(endpoint);
};

/**
 * Get restaurant balance data
 * @param {string} restaurantId - Restaurant ID
 */
export const getRestaurantBalance = (restaurantId) => {
  const endpoint = API_ENDPOINTS.ACCOUNTING.RESTAURANT_BALANCE(restaurantId);
  console.log('🏪 Calling restaurant balance endpoint:', endpoint);
  return axiosInstance.get(endpoint);
};
