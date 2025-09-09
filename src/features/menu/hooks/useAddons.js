import { useState, useEffect, useCallback } from 'react';
import { getRestaurantAddons } from '../api/addons';
import useRestaurantStore from '../../../stores/restaurantStore';

export const useAddons = () => {
  const [availableAddons, setAvailableAddons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Select a stable primitive value to avoid re-creating callbacks unnecessarily
  const restaurantId = useRestaurantStore((state) => state.restaurant?._id);

  // Fetch all available addons for the restaurant
  const fetchAvailableAddons = useCallback(async () => {
    if (!restaurantId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      
      // Use the new addon API function
      const response = await getRestaurantAddons(restaurantId);
      
      
      // Handle different response formats
      const addonsData = response.data?.data || response.data || [];
      setAvailableAddons(addonsData);
      
      
    } catch (err) {
      setError(err.message || 'Failed to fetch addons');
      setAvailableAddons([]);
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  // Initialize addons data
  useEffect(() => {
    fetchAvailableAddons();
  }, [fetchAvailableAddons]);

  // Refresh addons data
  const refreshAddons = useCallback(() => {
    fetchAvailableAddons();
  }, [fetchAvailableAddons]);

  return {
    availableAddons,
    loading,
    error,
    refreshAddons,
  };
};
