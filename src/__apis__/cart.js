import axiosInstance from './axios';
import { API_ENDPOINTS } from '../config/api';

export const getCart = () => {
    return axiosInstance.get(API_ENDPOINTS.CART.GET);
};

export const addToCart = (cartData) => {
    return axiosInstance.post(API_ENDPOINTS.CART.ADD, cartData);
};

export const removeFromCart = (itemId) => {
    return axiosInstance.delete(API_ENDPOINTS.CART.REMOVE(itemId));
};

export const updateCart = (itemId, quantity) => {
    return axiosInstance.put(API_ENDPOINTS.CART.UPDATE(itemId), { quantity });
};

export const emptyCart = () => {
    return axiosInstance.delete(API_ENDPOINTS.CART.EMPTY);
};