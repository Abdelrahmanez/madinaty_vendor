/**
 * useDrivers Hook
 * --------------------------------------------
 * Hook لإدارة السائقين
 */

import { useState, useEffect } from 'react';
import driverService from '../services/driverService';

const useDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * جلب جميع السائقين
   */
  const fetchAllDrivers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await driverService.getAllDrivers();
      setDrivers(response.data || []);
      
      return response.data || [];
    } catch (error) {
      setError(error.message || 'حدث خطأ في جلب السائقين');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * جلب السائقين المتاحين
   */
  const fetchAvailableDrivers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await driverService.getAvailableDrivers();
      setAvailableDrivers(response.data || []);
      
      return response.data || [];
    } catch (error) {
      setError(error.message || 'حدث خطأ في جلب السائقين المتاحين');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * إضافة سائق جديد
   */
  const addDriver = async (phoneNumber) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await driverService.addDriverByPhone(phoneNumber);
      
      // Refresh drivers list after adding
      await fetchAllDrivers();
      await fetchAvailableDrivers();
      
      return response;
    } catch (error) {
      setError(error.message || 'حدث خطأ في إضافة السائق');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * حذف سائق
   */
  const removeDriver = async (phoneNumber) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await driverService.removeDriverByPhone(phoneNumber);
      
      // Refresh drivers list after removing
      await fetchAllDrivers();
      await fetchAvailableDrivers();
      
      return response;
    } catch (error) {
      setError(error.message || 'حدث خطأ في حذف السائق');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * تحديث قائمة السائقين
   */
  const refreshDrivers = async () => {
    try {
      await Promise.all([
        fetchAllDrivers(),
        fetchAvailableDrivers()
      ]);
    } catch (error) {
      console.error('Error refreshing drivers:', error);
    }
  };

  // Load drivers on mount
  useEffect(() => {
    refreshDrivers();
  }, []);

  return {
    drivers,
    availableDrivers,
    loading,
    error,
    addDriver,
    removeDriver,
    fetchAllDrivers,
    fetchAvailableDrivers,
    refreshDrivers
  };
};

export default useDrivers;
