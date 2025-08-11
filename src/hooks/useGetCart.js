import { useState, useEffect, useCallback } from "react";
import { getCart } from "../__apis__/cart";

export const useGetCart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCart = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getCart();
            setCart(response.data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const refreshCart = useCallback(() => {
        fetchCart();
    }, [fetchCart]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    return { cart, loading, error, refreshCart };
};