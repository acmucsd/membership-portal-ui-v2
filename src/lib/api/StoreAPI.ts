/* eslint-disable import/prefer-default-export */
import { config } from '@/lib';
import { UUID } from '@/lib/types';
import {
  GetAllMerchCollectionsResponse,
  GetOneMerchCollectionResponse,
  PublicMerchCollection,
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
