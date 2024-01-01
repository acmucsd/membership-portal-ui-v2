import { config } from '@/lib';
import { UUID } from '@/lib/types';
import type {
  GetAllMerchCollectionsResponse,
  GetMerchOrdersResponse,
  GetOneMerchItemResponse,
  GetOneMerchOrderResponse,
  PublicMerchCollection,
  PublicMerchItemWithPurchaseLimits,
  PublicOrder,
  PublicOrderWithItems,
} from '@/lib/types/apiResponses';
import axios from 'axios';

/**
 * Get a single item by UUID
 * @param uuid Search query uuid
 * @param token Bearer token
 * @returns Item info
 */
export const getItem = async (
  uuid: UUID,
  token: string
): Promise<PublicMerchItemWithPurchaseLimits> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.store.item}/${uuid}`;

  const response = await axios.get<GetOneMerchItemResponse>(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.item;
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
