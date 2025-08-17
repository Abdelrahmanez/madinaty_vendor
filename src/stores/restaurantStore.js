import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../services/axios';
import { API_ENDPOINTS } from '../config/api';

const useRestaurantStore = create(
  persist(
    (set, get) => ({
      // State
      restaurant: null,
      loading: false,
      error: null,

      // Actions
      setRestaurant: (restaurant) => set({ restaurant, error: null }),

      clearRestaurant: () => set({ restaurant: null, error: null }),

      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error }),

      // Fetch restaurant data for the authenticated user
      fetchMyRestaurant: async () => {
        const { setLoading, setError, setRestaurant } = get();
        
        setLoading(true);
        setError(null);
        
        try {
          console.log('🏪 Fetching my restaurant data...');
          const response = await axiosInstance.get(API_ENDPOINTS.RESTAURANTS.MY_RESTAURANT);
          
          console.log('✅ Restaurant API Response:', JSON.stringify(response.data, null, 2));
          
          // Handle different response formats
          const restaurantData = response.data?.data || response.data;
          
          if (restaurantData) {
            setRestaurant(restaurantData);
            console.log('✅ Restaurant data set:', restaurantData._id);
            return restaurantData;
          } else {
            throw new Error('No restaurant data received');
          }
        } catch (error) {
          console.error('❌ Error fetching restaurant:', error);
          const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch restaurant';
          setError(errorMessage);
          throw error;
        } finally {
          setLoading(false);
        }
      },

      // Get restaurant ID (helper function)
      getRestaurantId: () => {
        const { restaurant } = get();
        return restaurant?._id;
      },

      // Check if restaurant data is loaded
      hasRestaurant: () => {
        const { restaurant } = get();
        return !!restaurant;
      },

      // Refresh restaurant data
      refreshRestaurant: async () => {
        const { fetchMyRestaurant } = get();
        return await fetchMyRestaurant();
      },
    }),
    {
      name: 'restaurant-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ restaurant: state.restaurant }), // Only persist restaurant data
    }
  )
);

export default useRestaurantStore;

