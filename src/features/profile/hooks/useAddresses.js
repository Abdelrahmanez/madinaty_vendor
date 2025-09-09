import { useState, useEffect } from 'react';
import { getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } from '../api/addresses';

export const useAddresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await getAddresses();
            
            if (response.data && response.data.data) {
                // تحسين بيانات العناوين لضمان التوافق
                const processedAddresses = response.data.data.map(address => {
                    // إذا كان حقل area موجود كـ object، نقوم بإضافته إلى حقل zone إذا لم يكن موجودا
                    if (address.area && typeof address.area === 'object' && !address.zone) {
                        address.zone = address.area;
                    }
                    return address;
                });
                setAddresses(processedAddresses);
            } else {
                setAddresses([]);
            }
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const addNewAddress = async (addressData) => {
        try {
            setLoading(true);
            const response = await addAddress(addressData);
            await fetchAddresses();
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    };

    const updateExistingAddress = async (addressId, addressData) => {
        try {
            setLoading(true);
            const response = await updateAddress(addressId, addressData);
            await fetchAddresses();
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    };

    const deleteExistingAddress = async (addressId) => {
        try {
            setLoading(true);
            const response = await deleteAddress(addressId);
            await fetchAddresses();
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    };

    const setDefaultExistingAddress = async (addressId) => {
        try {
            setLoading(true);
            const response = await setDefaultAddress(addressId);
            await fetchAddresses();
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    return {
        addresses,
        loading,
        error,
        fetchAddresses,
        addNewAddress,
        updateExistingAddress,
        deleteExistingAddress,
        setDefaultExistingAddress
    };
}; 
