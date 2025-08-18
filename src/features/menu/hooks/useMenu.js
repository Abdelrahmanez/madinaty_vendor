import { useState, useEffect, useCallback, useRef } from 'react';
import { getDishes, toggleDishAvailability } from '../api/dish';
import { fetchCategories } from '../api/categories';
import useAuthStore from '../../../stores/authStore';
import useRestaurantStore from '../../../stores/restaurantStore';

export const useMenu = () => {
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all'); // all, available, unavailable
  const [sortBy, setSortBy] = useState('name'); // name, price, popularity, date
  
  const { isAuthenticated } = useAuthStore();
  const hasSetCategoriesRef = useRef(false);

  // Fetch dishes
  const fetchDishes = useCallback(async (params = {}) => {
    if (!isAuthenticated) {
      console.log('🔒 User not authenticated, skipping dishes fetch');
      return;
    }

    // Get restaurant ID from store
    const restaurantId = useRestaurantStore.getState().getRestaurantId();
    
    if (!restaurantId) {
      console.log('🏪 No restaurant ID found, fetching restaurant data first...');
      try {
        await useRestaurantStore.getState().fetchMyRestaurant();
      } catch (error) {
        console.error('❌ Failed to fetch restaurant data:', error);
        setError('Failed to fetch restaurant data');
        return;
      }
    }

    const currentRestaurantId = useRestaurantStore.getState().getRestaurantId();
    if (!currentRestaurantId) {
      console.error('❌ Still no restaurant ID available');
      setError('Restaurant ID not available');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('🍽️ Fetching dishes for restaurant:', currentRestaurantId);
      
      // Include restaurant ID in the API call
      const response = await getDishes({
        restaurant: currentRestaurantId,
        page: 1,
        limit: 20,
        sort: '-ratingsAverage',
        ...params
      });
      
      console.log('🔍 Dishes API Response:', JSON.stringify(response.data, null, 2));
      
      // Handle different response formats
      const dishesData = response.data?.data || response.data || [];
      setDishes(dishesData);
      
      // Extract unique categories from dishes as fallback (only once)
      if (!hasSetCategoriesRef.current) {
        const uniqueCategories = [];
        const categoryMap = new Map();
        
        dishesData.forEach(dish => {
          if (dish.category && dish.category._id && dish.category.name) {
            if (!categoryMap.has(dish.category._id)) {
              categoryMap.set(dish.category._id, dish.category);
              uniqueCategories.push(dish.category);
            }
          }
        });
        
        if (uniqueCategories.length > 0) {
          console.log('📋 Using categories extracted from dishes (first time only):', uniqueCategories);
          setCategories(uniqueCategories);
          hasSetCategoriesRef.current = true;
        }
      }
    } catch (err) {
      console.error('❌ Error fetching dishes:', err);
      setError(err.message || 'Failed to fetch dishes');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch categories
  const fetchCategoriesData = useCallback(async () => {
    try {
      const categoriesData = await fetchCategories('dish');
      console.log('🔍 Categories API Response:', JSON.stringify(categoriesData, null, 2));
      
      // Handle different response formats
      const categoriesList = categoriesData?.data || categoriesData || [];
      setCategories(categoriesList);
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Set empty array to prevent undefined errors
      setCategories([]);
    }
  }, []);

  // Filter dishes based on search, category, and availability
  const filteredDishes = dishes.filter(dish => {
    // Search filter - search in name, description, tags, and ingredients
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      dish.name?.toLowerCase().includes(searchLower) ||
      dish.description?.toLowerCase().includes(searchLower) ||
      dish.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
      dish.ingredients?.some(ingredient => ingredient.toLowerCase().includes(searchLower)) ||
      dish.slug?.toLowerCase().includes(searchLower);

    // Category filter - handle both category (object) and categories (array)
    const matchesCategory = selectedCategory === 'all' || 
      dish.category?._id === selectedCategory ||
      (dish.categories && dish.categories.includes(selectedCategory));

    // Availability filter
    const matchesAvailability = availabilityFilter === 'all' ||
      (availabilityFilter === 'available' && dish.isAvailable) ||
      (availabilityFilter === 'unavailable' && !dish.isAvailable);

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  // Sort dishes
  const sortedDishes = [...filteredDishes].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a.name || '').localeCompare(b.name || '');
      case 'price':
        const aPrice = a.sizes && a.sizes.length > 0 
          ? Math.min(...a.sizes.map(size => size.price))
          : (a.price || 0);
        const bPrice = b.sizes && b.sizes.length > 0 
          ? Math.min(...b.sizes.map(size => size.price))
          : (b.price || 0);
        return aPrice - bPrice;
      case 'popularity':
        return (b.ratingsQuantity || 0) - (a.ratingsQuantity || 0);
      case 'date':
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  });

  // Toggle dish availability
  const toggleDishAvailabilityHandler = useCallback(async (dishId) => {
    try {
      console.log('🔄 Toggling availability for dish:', dishId);
      
      // Call the API to toggle availability
      const response = await toggleDishAvailability(dishId);
      console.log('✅ Toggle availability response:', response.data);
      
      // Update the local state with the response data
      setDishes(prevDishes => 
        prevDishes.map(dish => 
          dish._id === dishId 
            ? { ...dish, isAvailable: !dish.isAvailable }
            : dish
        )
      );
      
      return response.data;
    } catch (err) {
      console.error('❌ Error toggling dish availability:', err);
      setError(err.message || 'Failed to update dish availability');
      throw err;
    }
  }, []);

  // Refresh data
  const refreshData = useCallback(async () => {
    try {
      // Ensure restaurant data is fresh
      await useRestaurantStore.getState().refreshRestaurant();
      
      // Fetch fresh dishes and categories
      await fetchDishes();
      fetchCategoriesData().catch(err => {
        console.log('⚠️ Categories refresh failed:', err.message);
      });
    } catch (error) {
      console.error('❌ Error refreshing data:', error);
      setError('Failed to refresh data');
    }
  }, [fetchDishes, fetchCategoriesData]);

  // Initialize data
  useEffect(() => {
    if (isAuthenticated) {
      console.log('🔐 User authenticated, fetching menu data...');
      
      // First ensure we have restaurant data, then fetch dishes
      const initializeData = async () => {
        try {
          // Check if we have restaurant data
          if (!useRestaurantStore.getState().hasRestaurant()) {
            console.log('🏪 Fetching restaurant data first...');
            await useRestaurantStore.getState().fetchMyRestaurant();
          }
          
          // Now fetch dishes (which will include restaurant ID)
          await fetchDishes();
          
          // Try to fetch categories, but don't fail if it doesn't work
          fetchCategoriesData().catch(err => {
            console.log('⚠️ Categories API failed, continuing without categories:', err.message);
          });
        } catch (error) {
          console.error('❌ Error initializing menu data:', error);
          setError('Failed to initialize menu data');
        }
      };
      
      initializeData();
    } else {
      console.log('⚠️ User not authenticated, skipping menu data fetch');
    }
  }, [isAuthenticated, fetchDishes, fetchCategoriesData]);

  return {
    // Data
    dishes: sortedDishes,
    categories,
    allDishes: dishes,
    
    // Loading states
    loading,
    error,
    
    // Filters
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    availabilityFilter,
    setAvailabilityFilter,
    sortBy,
    setSortBy,
    
    // Actions
    fetchDishes,
    toggleDishAvailability: toggleDishAvailabilityHandler,
    refreshData,
  };
};

