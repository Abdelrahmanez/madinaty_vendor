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
    return axiosInstance.post(API_ENDPOINTS.DISHES.CREATE, data);
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
