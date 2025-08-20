import axiosInstance from '../../../services/axios';
import { API_ENDPOINTS } from '../../../config/api';

/**
 * Get restaurant data for the authenticated user
 */
export const getRestaurant = () => {
    return axiosInstance.get(API_ENDPOINTS.RESTAURANTS.MY_RESTAURANT);
};

/**
 * Update restaurant data
 * @param {string} id - Restaurant ID
 * @param {FormData} data - Form data containing restaurant information
 */
export const updateRestaurant = (id, data) => {
    return axiosInstance.put(API_ENDPOINTS.RESTAURANTS.DETAIL(id), data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

