import { useState, useEffect } from 'react';
import axiosInstance from '../../../services/axios';
import { API_ENDPOINTS } from '../../../config/api';

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
        console.log('🔍 بدء طلب جلب مناطق التوصيل...');
        setLoading(true);
        
        // استخدام مسار API من التكوين
        const endpoint = API_ENDPOINTS.DELIVERY_ZONES.ACTIVE;
        console.log('🔗 الرابط المستخدم:', endpoint);
        
        const response = await axiosInstance.get(endpoint);
        console.log('📦 استجابة مناطق التوصيل:', response);
        
        // التحقق من وجود البيانات في الاستجابة قبل استخدامها
        if (response && response.data && response.data.data) {
          console.log('✅ تم استلام بيانات مناطق التوصيل:', response.data.data.length);
          setZones(response.data.data);
          setError(null);
        } else {
          console.log('⚠️ تنسيق استجابة API غير صالح أو بيانات مفقودة:', response?.data);
          setZones([]);
          setError('تنسيق البيانات المستلمة غير صحيح');
        }
      } catch (err) {
        console.error('❌ خطأ في جلب مناطق التوصيل:', err);
        
        // تفاصيل أكثر عن الخطأ للمساعدة في تشخيص المشكلة
        if (err.response) {
          // الخادم رد برمز حالة خارج نطاق 2xx
          console.error('🔴 خطأ استجابة:', err.response.status, err.response.data);
          setError(`خطأ في الخادم: ${err.response.status}`);
        } else if (err.request) {
          // تم إجراء الطلب لكن لم يتم تلقي أي استجابة
          console.error('🌐 لا توجد استجابة من الخادم:', err.request);
          setError('لم يستجب الخادم للطلب. تأكد من تشغيل الخادم الخلفي وإمكانية الوصول إليه.');
        } else {
          // حدث شيء ما أثناء إعداد الطلب
          console.error('⚙️ خطأ في إعداد الطلب:', err.message);
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