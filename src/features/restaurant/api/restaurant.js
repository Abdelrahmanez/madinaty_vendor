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
    console.log('🏪 Updating restaurant with ID:', id);
    console.log('📦 FormData type:', data instanceof FormData ? 'FormData' : typeof data);
    
    // Debug: Check FormData contents
    if (data instanceof FormData) {
        const entries = Array.from(data._parts || []);
        console.log('📋 FormData entries:', entries.map(entry => [entry[0], typeof entry[1], entry[1]]));
    }
    
    return axiosInstance.put(API_ENDPOINTS.RESTAURANTS.DETAIL(id), data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

