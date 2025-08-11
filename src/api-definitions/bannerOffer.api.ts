import { AxiosResponse } from 'axios';
import axiosInstance from '../__apis__/axios';
import { API_ENDPOINTS } from '../config/api';

/**
 * نموذج لبيانات العرض البنري
 */
export interface BannerOffer {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  restaurantId: {
    _id: string;
    name: string;
    address: {
      area: {
        _id: string;
        name: string;
        deliveryPrice: number;
        isActive: boolean;
      };
    };
    owner: {
      _id: string;
      name: string;
      phoneNumber: string;
      role: string;
    };
    categories: {
      name: string;
      id: string | null;
    }[];
  };
  isFeatured: boolean;
  isActive: boolean;
  startDate: string;
  endDate: string;
  priority: number;
  createdAt: string;
  id: string;
}

/**
 * استجابة API للعروض
 */
export interface BannerOffersResponse {
  status: string;
  data: {
    bannerOffers: BannerOffer[];
  };
}

/**
 * استرجاع قائمة العروض
 */
export const getBannerOffers = async (): Promise<AxiosResponse<BannerOffersResponse>> => {
  const timestamp = new Date().getTime();
  return axiosInstance.get(`${API_ENDPOINTS.BANNER_OFFERS.LIST}?t=${timestamp}`);
};

/**
 * استرجاع عرض محدد بالمعرف
 * @param id معرف العرض
 */
export const getBannerOfferById = async (id: string): Promise<AxiosResponse<any>> => {
  return axiosInstance.get(API_ENDPOINTS.BANNER_OFFERS.DETAIL(id));
};

/**
 * استرجاع العروض المميزة
 */
export const getFeaturedBannerOffers = async (): Promise<AxiosResponse<any>> => {
  return axiosInstance.get(API_ENDPOINTS.BANNER_OFFERS.FEATURED);
};

export default {
  getBannerOffers,
  getBannerOfferById,
  getFeaturedBannerOffers
}; 