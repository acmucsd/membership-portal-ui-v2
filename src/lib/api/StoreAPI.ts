/* eslint-disable import/prefer-default-export */
import { config } from '@/lib';
import { UUID } from '@/lib/types';
import {
  GetAllMerchCollectionsResponse,
  GetOneMerchItemResponse,
  PublicMerchCollection,
  PublicMerchItemWithPurchaseLimits,
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
