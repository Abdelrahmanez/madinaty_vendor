import axiosInstance from './axios';
import { API_ENDPOINTS } from '../config/api';

export const createOrder = (orderData) => {
    return axiosInstance.post(API_ENDPOINTS.ORDERS.CREATE, orderData);
};

export const getOrders = (filters = {}) => {
    return axiosInstance.get(API_ENDPOINTS.ORDERS.LIST, { params: filters });
};

export const getOrder = (orderId) => {
    return axiosInstance.get(API_ENDPOINTS.ORDERS.DETAIL(orderId));
};

export const cancelOrder = (orderId) => {
    return axiosInstance.post(API_ENDPOINTS.ORDERS.CANCEL(orderId));
};