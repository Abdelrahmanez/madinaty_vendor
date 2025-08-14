import { useState, useEffect } from 'react';
import { getDishes } from '../api/dish';


export const useDishes = (filters = {}) => {
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDishes = async () => {
            setLoading(true);
            try {
                const response = await getDishes(filters);
                setDishes(response?.data?.data || []);
                setError(null);
            } catch (error) {
                setError(error?.message || 'Unknown error');
                setDishes([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDishes();
    }, [JSON.stringify(filters)]); // عشان يتفاعل مع التغيير في أي فلتر

    return { dishes, loading, error };
};
