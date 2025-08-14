import { useState, useEffect } from 'react';
import { getRestaurant } from '../api/restaurant';

export const useRestaurant = (id) => {
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRestaurant = async () => {
            setLoading(true);
            try {
                const response = await getRestaurant(id);
                setRestaurant(response?.data?.data || null);
                setError(null);
            } catch (error) {
                setError(error?.message || 'Unknown error');
                setRestaurant(null);
            } finally {
                setLoading(false);
            }       
        };
        fetchRestaurant();
    }, [id]);

    return { restaurant, loading, error };
};