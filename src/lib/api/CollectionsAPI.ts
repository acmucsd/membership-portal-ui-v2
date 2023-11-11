/* eslint-disable import/prefer-default-export */
import { config } from '@/lib';
import type {
  GetOneMerchCollectionResponse,
  PublicMerchCollection,
} from '@/lib/types/apiResponses';
import axios from 'axios';

/**
 * export the collection
 */
export const getCollection = async (token: string): Promise<PublicMerchCollection> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.store.collection}`;

  const response = await axios.get<GetOneMerchCollectionResponse>(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.collection;
};
