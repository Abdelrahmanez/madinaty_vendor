import { useState, useEffect } from 'react';
import { getRestaurant, updateRestaurant } from '../api/restaurant';

/**
 * Hook for managing restaurant data
 */
const useRestaurant = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Fetch restaurant data
  const fetchRestaurant = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getRestaurant();
      if (response.data.status === 'success') {
        setRestaurant(response.data.data);
      } else {
        setError('Failed to fetch restaurant data');
      }
    } catch (err) {
      console.error('Error fetching restaurant:', err);
      setError(err.response?.data?.message || 'Failed to fetch restaurant data');
    } finally {
      setLoading(false);
    }
  };

  // Update restaurant data
  const updateRestaurantData = async (restaurantId, updateData) => {
    try {
      setUpdating(true);
      setError(null);
      
      const response = await updateRestaurant(restaurantId, updateData);
      if (response.data.status === 'success') {
        setRestaurant(response.data.data);
        return { success: true, data: response.data.data };
      } else {
        setError('Failed to update restaurant');
        return { success: false, error: 'Failed to update restaurant' };
      }
    } catch (err) {
      console.error('Error updating restaurant:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update restaurant';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setUpdating(false);
    }
  };

  // Refresh restaurant data
  const refreshRestaurant = () => {
    fetchRestaurant();
  };

  useEffect(() => {
    fetchRestaurant();
  }, []);

  return {
    restaurant,
    loading,
    error,
    updating,
    fetchRestaurant,
    updateRestaurantData,
    refreshRestaurant,
  };
};

export default useRestaurant;
