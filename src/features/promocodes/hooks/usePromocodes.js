/**
 * usePromocodes Hook
 * --------------------------------------------
 * Hook لإدارة حالة أكواد الخصم وعملياتها
 */

import { useState, useEffect, useCallback } from 'react';
import promocodesService from '../services/promocodesService';

const usePromocodes = () => {
  const [promocodes, setPromocodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    limit: 10
  });

  /**
   * جلب قائمة أكواد الخصم
   */
  const fetchPromocodes = useCallback(async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await promocodesService.getPromocodes(page, limit);
      
      setPromocodes(response.data);
      setPagination({
        currentPage: response.paginationResult.currentPage,
        totalPages: response.paginationResult.numberOfPages,
        totalResults: response.results,
        limit: response.paginationResult.limit
      });
    } catch (err) {
      setError(err.message || 'حدث خطأ في جلب أكواد الخصم');
      console.error('❌ خطأ في جلب أكواد الخصم:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * إنشاء كود خصم جديد
   */
  const createPromocode = useCallback(async (promocodeData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await promocodesService.createPromocode(promocodeData);
      
      // إضافة الكود الجديد للقائمة
      setPromocodes(prev => [response.data, ...prev]);
      
      return response.data;
    } catch (err) {
      setError(err.message || 'حدث خطأ في إنشاء كود الخصم');
      console.error('❌ خطأ في إنشاء كود الخصم:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * تحديث كود خصم
   */
  const updatePromocode = useCallback(async (id, updateData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await promocodesService.updatePromocode(id, updateData);
      
      // تحديث الكود في القائمة
      setPromocodes(prev => 
        prev.map(promo => 
          promo.id === id ? { ...promo, ...response.data } : promo
        )
      );
      
      return response.data;
    } catch (err) {
      setError(err.message || 'حدث خطأ في تحديث كود الخصم');
      console.error('❌ خطأ في تحديث كود الخصم:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * حذف كود خصم
   */
  const deletePromocode = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      await promocodesService.deletePromocode(id);
      
      // إزالة الكود من القائمة
      setPromocodes(prev => prev.filter(promo => promo.id !== id));
    } catch (err) {
      setError(err.message || 'حدث خطأ في حذف كود الخصم');
      console.error('❌ خطأ في حذف كود الخصم:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * تفعيل/إلغاء تفعيل كود خصم
   */
  const togglePromocodeStatus = useCallback(async (id, isActive) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await promocodesService.togglePromocodeStatus(id, isActive);
      
      // تحديث حالة الكود في القائمة
      setPromocodes(prev => 
        prev.map(promo => 
          promo.id === id ? { ...promo, isActive: response.data.isActive } : promo
        )
      );
      
      return response.data;
    } catch (err) {
      setError(err.message || 'حدث خطأ في تغيير حالة كود الخصم');
      console.error('❌ خطأ في تغيير حالة كود الخصم:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * تحديث القائمة
   */
  const refreshPromocodes = useCallback(() => {
    fetchPromocodes(pagination.currentPage, pagination.limit);
  }, [fetchPromocodes, pagination.currentPage, pagination.limit]);

  // جلب البيانات عند تحميل المكون
  useEffect(() => {
    fetchPromocodes();
  }, [fetchPromocodes]);

  return {
    promocodes,
    loading,
    error,
    pagination,
    fetchPromocodes,
    createPromocode,
    updatePromocode,
    deletePromocode,
    togglePromocodeStatus,
    refreshPromocodes,
    getRestaurantCategories: promocodesService.getRestaurantCategories,
    getRestaurantMenuItems: promocodesService.getRestaurantMenuItems
  };
};

export default usePromocodes;
