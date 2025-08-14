import axiosInstance from '../../../services/axios';
import { API_ENDPOINTS } from '../../../config/api';

export const getAddresses = () => {
    return axiosInstance.get(API_ENDPOINTS.USER.ADDRESSES);
};

export const addAddress = (addressData) => {
    return axiosInstance.post(API_ENDPOINTS.USER.ADDRESSES, addressData);
};

export const updateAddress = (addressId, addressData) => {
    return axiosInstance.put(API_ENDPOINTS.USER.ADDRESS(addressId), addressData);
};

export const deleteAddress = (addressId) => {
    return axiosInstance.delete(API_ENDPOINTS.USER.ADDRESS(addressId));
};

export const setDefaultAddress = (addressId) => {
    return axiosInstance.patch(API_ENDPOINTS.USER.SET_DEFAULT_ADDRESS(addressId));
}; 