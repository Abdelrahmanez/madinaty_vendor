/**
 * Driver Service
 * --------------------------------------------
 * خدمة إدارة السائقين
 */

import axiosInstance from '../../../services/axios';
import { API_ENDPOINTS } from '../../../config/api';

class DriverService {
  /**
   * إضافة سائق للمطعم بواسطة رقم الهاتف
   */
  async addDriverByPhone(phoneNumber) {
    try {
      console.log('🔍 Adding driver with phone:', phoneNumber);
      
      const response = await axiosInstance.post(
        API_ENDPOINTS.DRIVERS.ADD_DRIVER,
        { phoneNumber }
      );
      
      console.log('✅ Driver added successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ خطأ في إضافة السائق:', error);
      console.error('❌ Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  }

  /**
   * حذف سائق من المطعم بواسطة رقم الهاتف
   */
  async removeDriverByPhone(phoneNumber) {
    try {
      console.log('🔍 Removing driver with phone:', phoneNumber);
      
      const response = await axiosInstance.post(
        API_ENDPOINTS.DRIVERS.REMOVE_DRIVER,
        { phoneNumber }
      );
      
      console.log('✅ Driver removed successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ خطأ في حذف السائق:', error);
      console.error('❌ Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  }

  /**
   * الحصول على جميع سائقين المطعم
   */
  async getAllDrivers() {
    try {
      console.log('🔍 Fetching all drivers...');
      
      const response = await axiosInstance.get(
        API_ENDPOINTS.DRIVERS.GET_ALL_DRIVERS
      );
      
      console.log('✅ All drivers fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ خطأ في جلب السائقين:', error);
      console.error('❌ Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  }

  /**
   * الحصول على السائقين المتاحين
   */
  async getAvailableDrivers() {
    try {
      console.log('🔍 Fetching available drivers...');
      
      const response = await axiosInstance.get(
        API_ENDPOINTS.DRIVERS.GET_AVAILABLE_DRIVERS
      );
      
      console.log('✅ Available drivers fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ خطأ في جلب السائقين المتاحين:', error);
      console.error('❌ Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  }
}

export default new DriverService();
