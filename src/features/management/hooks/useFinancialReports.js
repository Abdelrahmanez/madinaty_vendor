import { useState, useEffect } from 'react';
import { getVendorFinancialData, getRestaurantBalance } from '../api/financialReports';
import useRestaurantStore from '../../../stores/restaurantStore';

export const useFinancialReports = () => {
  const [financialData, setFinancialData] = useState(null);
  const [balanceData, setBalanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { restaurant, getRestaurantId, fetchMyRestaurant } = useRestaurantStore();

  const restaurantId = getRestaurantId();
  
  console.log('🏪 useFinancialReports - Restaurant ID:', restaurantId);
  console.log('🏪 useFinancialReports - Restaurant data:', restaurant);

  const fetchFinancialData = async () => {
    let currentRestaurantId = restaurantId;
    
    // If no restaurant ID, try to fetch restaurant data first
    if (!currentRestaurantId) {
      try {
        console.log('🏪 No restaurant ID found, fetching restaurant data...');
        const restaurantData = await fetchMyRestaurant();
        currentRestaurantId = restaurantData?._id;
      } catch (err) {
        console.error('❌ Error fetching restaurant data:', err);
        setError('معرف المطعم غير متوفر');
        setLoading(false);
        return;
      }
    }
    
    if (!currentRestaurantId) {
      setError('معرف المطعم غير متوفر');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('🏪 Fetching financial data for restaurant:', currentRestaurantId);
      
      // Fetch both vendor and balance data
      const [vendorResponse, balanceResponse] = await Promise.all([
        getVendorFinancialData(currentRestaurantId),
        getRestaurantBalance(currentRestaurantId)
      ]);

      console.log('✅ Vendor response:', vendorResponse.data);
      console.log('✅ Balance response:', balanceResponse.data);

      setFinancialData(vendorResponse.data?.data || null);
      setBalanceData(balanceResponse.data?.data || null);
    } catch (err) {
      console.error('❌ Error fetching financial data:', err);
      const errorMessage = err.response?.data?.message || err.message || 'حدث خطأ في تحميل البيانات المالية';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchFinancialData();
  };

  useEffect(() => {
    fetchFinancialData();
  }, [restaurantId, restaurant]);

  return {
    financialData,
    balanceData,
    loading,
    error,
    refreshData
  };
};
