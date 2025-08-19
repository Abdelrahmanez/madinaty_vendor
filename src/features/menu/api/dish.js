import axiosInstance from '../../../services/axios';
import { API_ENDPOINTS } from '../../../config/api';

export const getDishes = (params = {}) => {
    // Ensure restaurant ID is always included
    const queryParams = {
        ...params,
        // Add default sorting if not provided
        sort: params.sort || '-ratingsAverage',
        // Add default pagination if not provided
        page: params.page || 1,
        limit: params.limit || 20,
    };
    
    console.log('🍽️ Fetching dishes with params:', queryParams);
    
    return axiosInstance.get(API_ENDPOINTS.DISHES.LIST, {
        params: queryParams
    });
};

export const getDish = (id) => {
    return axiosInstance.get(API_ENDPOINTS.DISHES.DETAIL(id));
};

export const createDish = (data) => {
    const isFormData = data instanceof FormData;
    console.log('🍽️ Creating dish with data type:', isFormData ? 'FormData' : 'JSON');
    
    const config = {};
    if (isFormData) {
        // For FormData, let the browser set the Content-Type with boundary
        config.headers = {
            'Content-Type': 'multipart/form-data',
        };
    }
    
    return axiosInstance.post(API_ENDPOINTS.DISHES.CREATE, data, config);
};

export const updateDish = (id, data) => {
    return axiosInstance.put(API_ENDPOINTS.DISHES.UPDATE(id), data);
};

export const deleteDish = (id) => {
    return axiosInstance.delete(API_ENDPOINTS.DISHES.DELETE(id));
};

export const toggleDishAvailability = (id) => {
    return axiosInstance.patch(API_ENDPOINTS.DISHES.TOGGLE_AVAILABILITY(id));
};

// Size management
export const updateDishSize = (dishId, sizeId, data) => {
    return axiosInstance.put(API_ENDPOINTS.DISHES.UPDATE_SIZE(dishId, sizeId), data);
};

export const updateDishSizeStock = (dishId, sizeId, data) => {
    return axiosInstance.patch(API_ENDPOINTS.DISHES.UPDATE_SIZE_STOCK(dishId, sizeId), data);
};

export const addDishSize = (dishId, data) => {
    return axiosInstance.post(API_ENDPOINTS.DISHES.ADD_SIZE(dishId), data);
};

// Addon management
export const addDishAddons = (dishId, data) => {
    return axiosInstance.post(API_ENDPOINTS.DISHES.ADD_ADDONS(dishId), data);
};

export const removeDishAddons = (dishId, data) => {
    return axiosInstance.delete(API_ENDPOINTS.DISHES.REMOVE_ADDONS(dishId), { data });
};

// Offer management
export const updateDishOffer = (dishId, data) => {
    return axiosInstance.patch(API_ENDPOINTS.DISHES.UPDATE_OFFER(dishId), data);
};

export const deleteDishOffer = (dishId) => {
    return axiosInstance.delete(API_ENDPOINTS.DISHES.DELETE_OFFER(dishId));
};
