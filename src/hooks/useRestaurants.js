import { useState, useEffect } from 'react';
import { getRestaurants } from '../__apis__/restaurant';

export const useRestaurants = (filters = {}) => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRestaurants = async () => {
            setLoading(true);
            try {
                const response = await getRestaurants(filters);
                setRestaurants(response?.data?.data || []);
                setError(null);
            } catch (error) {
                setError(error?.message || 'Unknown error');
                setRestaurants([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, [JSON.stringify(filters)]); // عشان يتفاعل مع التغيير في أي فلتر

    return { restaurants, loading, error };
};
