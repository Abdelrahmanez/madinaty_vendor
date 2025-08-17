import axiosInstance from '../../../services/axios';
import { API_ENDPOINTS } from '../../../config/api';

export const fetchCategories = async (type) => {
    try {
        console.log('🔍 Fetching categories with type:', type);
        const response = await axiosInstance.get(API_ENDPOINTS.CATEGORIES.LIST(type));
        console.log('✅ Categories API Response:', JSON.stringify(response.data, null, 2));
        return response.data;
    } catch (error) {
        console.error('❌ Error fetching categories:', error);
        console.error('❌ Error details:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
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