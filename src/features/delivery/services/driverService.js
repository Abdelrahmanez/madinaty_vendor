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
      
      const response = await axiosInstance.post(
        API_ENDPOINTS.DRIVERS.ADD_DRIVER,
        { phoneNumber }
      );
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * حذف سائق من المطعم بواسطة رقم الهاتف
   */
  async removeDriverByPhone(phoneNumber) {
    try {
      
      const response = await axiosInstance.post(
        API_ENDPOINTS.DRIVERS.REMOVE_DRIVER,
        { phoneNumber }
      );
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * الحصول على جميع سائقين المطعم
   */
  async getAllDrivers() {
    try {
      
      const response = await axiosInstance.get(
        API_ENDPOINTS.DRIVERS.GET_ALL_DRIVERS
      );
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * الحصول على السائقين المتاحين
   */
  async getAvailableDrivers() {
    try {
      
      const response = await axiosInstance.get(
        API_ENDPOINTS.DRIVERS.GET_AVAILABLE_DRIVERS
      );
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new DriverService();
