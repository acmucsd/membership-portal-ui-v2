/* eslint-disable import/prefer-default-export */
import { config } from '@/lib';
import { GetAllMerchCollectionsResponse, PublicMerchCollection } from '@/lib/types/apiResponses';
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
