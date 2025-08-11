import { useEffect, useState } from 'react';
import { getDefaultAddress } from '../__apis__/user';

{/*
    there is no something called current address in the user or backend 
    but we can get the default address of the user
    and use it as the current address (displayed as "current" to user)
    and if the user has no default address, we can use the first address as the current address
*/}

export const useGetCurrentAddress = () => {
    const [currentAddress, setCurrentAddress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDefaultAddress = async () => {

            try {
                setLoading(true);
                const response = await getDefaultAddress();
                setCurrentAddress(response.data.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };  
        fetchDefaultAddress();
    }, []);

    return { currentAddress, loading, error };
};