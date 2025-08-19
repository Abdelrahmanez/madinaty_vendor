import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import {
  getRestaurantDeliveryZones,
  setZonePrice,
  updateZonePrice,
  deactivateZone,
  validateRestaurantZones
} from '../api/deliveryZonesApi';

/**
 * Hook لإدارة مناطق التوصيل للمطعم
 */
export const useDeliveryZonesManagement = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [validationStatus, setValidationStatus] = useState(null);

  // جلب مناطق التوصيل للمطعم
  const fetchZones = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getRestaurantDeliveryZones();
      console.log('response', response);
      
      if (response && response.data && Array.isArray(response.data)) {
        // تحويل البيانات من هيكل restaurantDeliveryZones إلى هيكل deliveryZone
        const transformedZones = response.data.map(item => ({
          _id: item._id,
          name: item.deliveryZone?.name || 'منطقة بدون اسم',
          description: item.deliveryZone?.description || '',
          isActive: item.deliveryZone?.isActive || false,
          deliveryTime: 30, // قيمة افتراضية
          coordinates: null, // قيمة افتراضية
          radius: 5, // قيمة افتراضية
          price: item.deliveryPrice || null,
          restaurantId: item.restaurant || '',
          createdAt: item.createdAt || '',
          updatedAt: item.updatedAt || '',
          // بيانات إضافية من الهيكل الجديد
          deliveryZoneId: item.deliveryZone?._id || '',
          restaurantDeliveryZoneId: item._id || '',
          isRestaurantZoneActive: item.isActive || false
        }));
        
        setZones(transformedZones);
      } else {
        setZones([]);
      }
    } catch (err) {
      console.error('خطأ في جلب مناطق التوصيل:', err);
      setError(err.message || 'حدث خطأ في جلب مناطق التوصيل');
      setZones([]);
    } finally {
      setLoading(false);
    }
  };

  // تعيين سعر لمنطقة توصيل
  const addZonePrice = async (zoneId, price) => {
    if (!zoneId) {
      Alert.alert('خطأ', 'معرف المنطقة مطلوب');
      return;
    }
    
    try {
      setLoading(true);
      const response = await setZonePrice(zoneId, price);
      if (response && response.data) {
        // تحديث المنطقة في القائمة
        setZones(prevZones => 
          (prevZones || []).map(zone => 
            zone && zone._id === zoneId ? { ...zone, price: price } : zone
          )
        );
        Alert.alert('نجح', 'تم تعيين سعر المنطقة بنجاح');
        return response.data;
      }
    } catch (err) {
      console.error('خطأ في تعيين سعر المنطقة:', err);
      Alert.alert('خطأ', err.message || 'حدث خطأ في تعيين سعر المنطقة');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // تحديث سعر منطقة توصيل
  const updateZonePriceAction = async (zoneId, price) => {
    if (!zoneId) {
      Alert.alert('خطأ', 'معرف المنطقة مطلوب');
      return;
    }
    
    try {
      setLoading(true);
      const response = await updateZonePrice(zoneId, price);
      if (response && response.data) {
        // تحديث المنطقة في القائمة
        setZones(prevZones => 
          (prevZones || []).map(zone => 
            zone && zone._id === zoneId ? { ...zone, price: price } : zone
          )
        );
        Alert.alert('نجح', 'تم تحديث سعر المنطقة بنجاح');
        return response.data;
      }
    } catch (err) {
      console.error('خطأ في تحديث سعر المنطقة:', err);
      Alert.alert('خطأ', err.message || 'حدث خطأ في تحديث سعر المنطقة');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // إلغاء تفعيل منطقة توصيل
  const deactivateZoneAction = async (zoneId) => {
    if (!zoneId) {
      Alert.alert('خطأ', 'معرف المنطقة مطلوب');
      return;
    }
    
    try {
      setLoading(true);
      const response = await deactivateZone(zoneId);
      if (response && response.data) {
        // تحديث حالة المنطقة في القائمة
        setZones(prevZones => 
          (prevZones || []).map(zone => 
            zone && zone._id === zoneId ? { ...zone, isRestaurantZoneActive: false } : zone
          )
        );
        Alert.alert('نجح', 'تم إلغاء تفعيل المنطقة بنجاح');
        return response.data;
      }
    } catch (err) {
      console.error('خطأ في إلغاء تفعيل المنطقة:', err);
      Alert.alert('خطأ', err.message || 'حدث خطأ في إلغاء تفعيل المنطقة');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // التحقق من صحة مناطق التوصيل
  const validateZones = async () => {
    try {
      setLoading(true);
      const response = await validateRestaurantZones();
      setValidationStatus(response);
      return response;
    } catch (err) {
      console.error('خطأ في التحقق من صحة المناطق:', err);
      setValidationStatus({ isValid: false, message: err.message });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // تحديث البيانات
  const refreshData = async () => {
    setRefreshing(true);
    await fetchZones();
    setRefreshing(false);
  };

  // جلب البيانات عند تحميل المكون
  useEffect(() => {
    fetchZones();
  }, []);

  return {
    zones,
    loading,
    error,
    refreshing,
    validationStatus,
    addZonePrice,
    updateZonePriceAction,
    deactivateZoneAction,
    validateZones,
    refreshData,
    fetchZones
  };
};
