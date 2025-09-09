import { useState, useEffect } from 'react';
import axiosInstance from '../services/axios';
import { API_ENDPOINTS } from '../config/api';

/**
 * Hook لجلب قائمة مناطق التوصيل النشطة
 * @returns {{ zones: Array, loading: boolean, error: string }}
 */
const useDeliveryZones = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeliveryZones = async () => {
      try {
        setLoading(true);
        
        // استخدام مسار API من التكوين
        const endpoint = API_ENDPOINTS.DELIVERY_ZONES.ACTIVE;
        
        const response = await axiosInstance.get(endpoint);
        
        // التحقق من وجود البيانات في الاستجابة قبل استخدامها
        if (response && response.data && response.data.data) {
          setZones(response.data.data);
          setError(null);
        } else {
          setZones([]);
          setError('تنسيق البيانات المستلمة غير صحيح');
        }
      } catch (err) {
        // تفاصيل أكثر عن الخطأ للمساعدة في تشخيص المشكلة
        if (err.response) {
          // الخادم رد برمز حالة خارج نطاق 2xx
          setError(`خطأ في الخادم: ${err.response.status}`);
        } else if (err.request) {
          // تم إجراء الطلب لكن لم يتم تلقي أي استجابة
          setError('لم يستجب الخادم للطلب. تأكد من تشغيل الخادم الخلفي وإمكانية الوصول إليه.');
        } else {
          // حدث شيء ما أثناء إعداد الطلب
          setError(`خطأ في إعداد الطلب: ${err.message}`);
        }
        
        setZones([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryZones();
  }, []);

  return { zones, loading, error };
};

export default useDeliveryZones; 
