import axiosInstance from '../../../services/axios';
import { API_ENDPOINTS } from '../../../config/api';

export const createOrder = (orderData) => {
    return axiosInstance.post(API_ENDPOINTS.ORDERS.CREATE, orderData);
};

export const getOrders = async (filters = {}) => {
    const response = await axiosInstance.get(API_ENDPOINTS.ORDERS.LIST, { params: filters });
    return response.data.data;
};

export const getOrder = (orderId) => {
    return axiosInstance.get(API_ENDPOINTS.ORDERS.DETAIL(orderId));
};

export const cancelOrder = (orderId) => {
    return axiosInstance.post(API_ENDPOINTS.ORDERS.CANCEL(orderId));
};

// New API functions for order assignment
export const assignDriverToOrder = (orderId, driverId) => {
    return axiosInstance.patch(API_ENDPOINTS.ORDERS.ASSIGN_DRIVER(orderId), {
        driverId
    });
};

export const updateOrderStatusByRestaurant = (orderId, status) => {
    return axiosInstance.patch(API_ENDPOINTS.ORDERS.UPDATE_STATUS_BY_RESTAURANT(orderId), {
        status
    });
};