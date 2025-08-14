import axiosInstance from './axios';
import { API_ENDPOINTS } from '../config/api';

export const getDefaultAddress = () => {
    return axiosInstance.get(API_ENDPOINTS.USER.DEFAULT_ADDRESS);
};