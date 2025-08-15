import { useState } from 'react';
import { updateRestaurant } from '../api/restaurant';

export const useUpdateRestaurant = () => {
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);

    const updateRestaurantStatus = async (restaurantId, data) => {
        if (!restaurantId) {
            setError('معرف المطعم مطلوب');
            return { success: false, error: 'معرف المطعم مطلوب' };
        }

        setUpdating(true);
        setError(null);

        try {
            const response = await updateRestaurant(restaurantId, data);
            return { success: true, data: response.data };
        } catch (error) {
            const errorMessage = error?.response?.data?.message || 'حدث خطأ أثناء تحديث المطعم';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setUpdating(false);
        }
    };

    return {
        updateRestaurantStatus,
        updating,
        error,
        clearError: () => setError(null),
    };
};
