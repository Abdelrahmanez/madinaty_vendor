import axiosInstance from '../../../services/axios';
import { API_ENDPOINTS } from '../../../config/api';

// Get all addons for a specific restaurant
export const getRestaurantAddons = (restaurantId) => {
  return axiosInstance.get(API_ENDPOINTS.ADDONS.RESTAURANT_ADDONS(restaurantId));
};

// Create a new addon for a restaurant
export const createRestaurantAddon = (restaurantId, addonData) => {
  return axiosInstance.post(API_ENDPOINTS.ADDONS.CREATE(restaurantId), addonData);
};

// Update an existing addon
export const updateRestaurantAddon = (restaurantId, addonId, addonData) => {
  return axiosInstance.put(API_ENDPOINTS.ADDONS.UPDATE(restaurantId, addonId), addonData);
};

// Delete an addon
export const deleteRestaurantAddon = (restaurantId, addonId) => {
  return axiosInstance.delete(API_ENDPOINTS.ADDONS.DELETE(restaurantId, addonId));
};

// Get a specific addon by ID
export const getAddonById = (restaurantId, addonId) => {
  return axiosInstance.get(API_ENDPOINTS.ADDONS.UPDATE(restaurantId, addonId));
};
