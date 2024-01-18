import { config } from '@/lib';
import type { UUID } from '@/lib/types';
import {
  CreateMerchItemRequest,
  EditMerchItemRequest,
  MerchItem,
  MerchItemEdit,
} from '@/lib/types/apiRequests';
import type {
  CreateMerchItemResponse,
  DeleteMerchItemResponse,
  EditMerchItemResponse,
  GetAllMerchCollectionsResponse,
  GetMerchOrdersResponse,
  GetOneMerchItemResponse,
  GetOneMerchOrderResponse,
  PublicMerchCollection,
  PublicMerchItem,
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

/**
 * Create a single item by UUID
 * @param token Bearer token
 * @param merchandise Item info
 * @returns Item info
 */
export const createItem = async (
  token: string,
  merchandise: MerchItem
): Promise<PublicMerchItem> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.store.item}`;

  const requestBody: CreateMerchItemRequest = { merchandise };

  const response = await axios.post<CreateMerchItemResponse>(requestUrl, requestBody, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.item;
};

/**
 * Edit a single item by UUID
 * @param token Bearer token
 * @param uuid Merch item UUID
 * @param merchandise Item info
 * @returns Item info
 */
export const editItem = async (
  token: string,
  uuid: UUID,
  merchandise: MerchItemEdit
): Promise<PublicMerchItem> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.store.item}/${uuid}`;

  const requestBody: EditMerchItemRequest = { merchandise };

  const response = await axios.patch<EditMerchItemResponse>(requestUrl, requestBody, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.item;
};

/**
 * Delete a single item by UUID
 * @param token Bearer token
 * @param uuid Merch item UUID
 * @returns Item info
 */
export const deleteItem = async (token: string, uuid: UUID): Promise<void> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.store.item}/${uuid}`;

  await axios.delete<DeleteMerchItemResponse>(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
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
