import { config } from '@/lib';
import { UUID } from '@/lib/types';
import type {
  GetAllMerchCollectionsResponse,
  GetMerchOrdersResponse,
  GetOneMerchCollectionResponse,
  GetOneMerchOrderResponse,
  PublicMerchCollection,
  PublicOrder,
  PublicOrderWithItems,
} from '@/lib/types/apiResponses';
import axios from 'axios';

/**
 * Get a Collection by UUID
 * @param uuid Search query uuid
 * @param token Bearer token
 * @returns Collection info
 */
export const getCollection = async (uuid: UUID, token: string): Promise<PublicMerchCollection> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.store.collection}/${uuid}`;

  const response = await axios.get<GetOneMerchCollectionResponse>(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.collection;
};

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

export const getOrder = async (token: string, uuid: string): Promise<PublicOrderWithItems> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.store.order}/${uuid}`;

  const response = await axios.get<GetOneMerchOrderResponse>(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.order;
};
