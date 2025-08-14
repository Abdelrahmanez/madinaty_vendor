import axiosInstance from './axios';
import { API_ENDPOINTS } from '../config/api';

export const fetchCategories = async (type) => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.CATEGORIES.LIST(type));
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}

export const fetchCategory = async (categoryId) => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.CATEGORIES.DETAIL(categoryId));
        return response.data.data;
    } catch (error) {
        console.error('Error fetching category:', error);
        throw error;
    }
}