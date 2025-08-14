import { useState, useEffect } from 'react';
import { getDish } from '../__apis__/dish';

export const useGetDish = (dishId) => {
    const [dish, setDish] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDish = async () => {
            if (!dishId) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const response = await getDish(dishId);
                setDish(response?.data?.data || null);
                setError(null);
            } catch (error) {
                setError(error?.message || 'Unknown error');
                setDish(null);
            } finally {
                setLoading(false);
            }
        };

        fetchDish();
    }, [dishId]);

    return { dish, loading, error };
}; 