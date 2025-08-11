import { useState, useEffect } from 'react';
import axiosInstance from '../__apis__/axios';
import { API_ENDPOINTS } from '../config/api';

const useCategories = (categoryType) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get(API_ENDPOINTS.CATEGORIES.LIST(categoryType));
                if (response.data && response.data.data && response.data.data.data) {
                    setCategories(response.data.data.data);
                    setError(null);
                } else {
                    setCategories([]);
                    setError('تنسيق البيانات المستلمة غير صحيح');
                }
            } catch (error) {
                setError(error.message);
                setCategories([]);
            }
            finally {
                setLoading(false);
            }
        }
        fetchCategories(categoryType);
    }, []);
    return { categories, loading, error };
}

export default useCategories;

