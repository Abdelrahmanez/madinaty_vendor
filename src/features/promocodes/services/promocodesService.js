/**
 * Promocodes Service
 * --------------------------------------------
 * خدمة إدارة أكواد الخصم
 */

import axiosInstance from '../../../services/axios';
import { API_ENDPOINTS } from '../../../config/api';
import { fetchCategories } from '../../menu/api/categories';
import { getDishes } from '../../menu/api/dish';

// Debug imports

class PromocodesService {
  /**
   * الحصول على قائمة أكواد الخصم للمطعم
   */
  async getPromocodes(page = 1, limit = 10) {
    try {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.PROMOCODE.RESTAURANT_LIST}?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * إنشاء كود خصم جديد
   */
  async createPromocode(promocodeData) {
    try {
      
      const response = await axiosInstance.post(
        API_ENDPOINTS.PROMOCODE.RESTAURANT_CREATE,
        promocodeData
      );
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * تحديث كود خصم موجود
   */
  async updatePromocode(id, updateData) {
    try {
      const response = await axiosInstance.put(
        API_ENDPOINTS.PROMOCODE.RESTAURANT_UPDATE(id),
        updateData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * حذف كود خصم
   */
  async deletePromocode(id) {
    try {
      const response = await axiosInstance.delete(
        API_ENDPOINTS.PROMOCODE.RESTAURANT_DELETE(id)
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * تفعيل/إلغاء تفعيل كود خصم
   */
  async togglePromocodeStatus(id, isActive) {
    try {
      const response = await axiosInstance.patch(
        API_ENDPOINTS.PROMOCODE.RESTAURANT_UPDATE(id),
        { isActive }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * الحصول على فئات المطعم
   */
  async getRestaurantCategories() {
    try {
      const categories = await fetchCategories('meal');
      return categories;
    } catch (error) {
      throw error;
    }
  }

  /**
   * الحصول على عناصر قائمة المطعم
   */
  async getRestaurantMenuItems() {
    try {
      const response = await getDishes({ limit: 1000 }); // Get all menu items
      return response.data.data || [];
    } catch (error) {
      throw error;
    }
  }
}

export default new PromocodesService();
