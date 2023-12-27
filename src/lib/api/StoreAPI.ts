/* eslint-disable import/prefer-default-export */
import { config } from '@/lib';
import {
  GetAllMerchCollectionsResponse,
  GetMerchOrdersResponse,
  PublicMerchCollection,
  PublicOrder,
} from '@/lib/types/apiResponses';
import axios from 'axios';

export const getAllCollections = async (token: string): Promise<PublicMerchCollection[]> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.store.collection}`;

  const response = await axios.get<GetAllMerchCollectionsResponse>(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.collections;
};

export const getAllOrders = async (token: string): Promise<PublicOrder[]> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.store.orders}`;

  const response = await axios.get<GetMerchOrdersResponse>(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.orders;
};
