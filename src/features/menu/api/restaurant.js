import axiosInstance from '../../../services/axios';
import { API_ENDPOINTS } from '../../../config/api';

export const getRestaurants = (params = {}) => {
    return axiosInstance.get(API_ENDPOINTS.RESTAURANTS.LIST, {
        params
    });
};

export const getRestaurant = (id) => {
    return axiosInstance.get(API_ENDPOINTS.RESTAURANTS.DETAIL(id));
};      
