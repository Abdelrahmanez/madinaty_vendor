import axiosInstance from '../../../services/axios';
import { API_ENDPOINTS } from '../../../config/api';


export const getRestaurant = () => {
    return axiosInstance.get(API_ENDPOINTS.RESTAURANTS.MY_RESTAURANT);
};

export const updateRestaurant = (id, data) => {
    return axiosInstance.put(API_ENDPOINTS.RESTAURANTS.DETAIL(id), data);
};

