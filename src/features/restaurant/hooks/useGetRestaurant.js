import { useState, useEffect, useCallback } from 'react';
import { getRestaurant } from '../api/restaurant';

export const useGetRestaurant = () => {
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRestaurant = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getRestaurant();
            setRestaurant(response.data.data);
            setError(null);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRestaurant();
    }, [fetchRestaurant]);

    return { 
        restaurant, 
        loading, 
        error, 
        refresh: fetchRestaurant 
    };
}