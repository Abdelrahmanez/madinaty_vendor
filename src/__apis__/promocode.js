import axiosInstance from './axios';
import { API_ENDPOINTS } from '../config/api';

export const validatePromoCode = (promoCode) => {
    return axiosInstance.post(API_ENDPOINTS.PROMOCODE.VALIDATE, { code: promoCode });
};
