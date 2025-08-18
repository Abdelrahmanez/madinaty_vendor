import axiosInstance from '../../../services/axios';
import { API_ENDPOINTS } from '../../../config/api';

// Returns an ARRAY of categories, normalized to match backend sample:
// { data: { status: 'success', results: N, data: [ ... ] } }
export const fetchCategories = async (type) => {
    try {
        console.log('🔍 Fetching categories with type:', type);
        const response = await axiosInstance.get(API_ENDPOINTS.CATEGORIES.LIST(type));
        const payload = response?.data;
        // Normalize to array regardless of nesting
        const categories = Array.isArray(payload?.data?.data)
            ? payload.data.data
            : Array.isArray(payload?.data)
            ? payload.data
            : Array.isArray(payload)
            ? payload
            : [];
        console.log('✅ Categories parsed length:', categories.length);
        return categories;
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