import axiosInstance from '../../../services/axios';
import { API_ENDPOINTS } from '../../../config/api';

export const getDishes = (params = {}) => {
    return axiosInstance.get(API_ENDPOINTS.DISHES.LIST, {
        params
    });
};

export const getDish = (id) => {
    return axiosInstance.get(API_ENDPOINTS.DISHES.DETAIL(id));
};
