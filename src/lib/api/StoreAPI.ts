import { config } from '@/lib';
import { PlaceMerchOrderRequest } from '@/lib/types/apiRequests';
import {
  GetOrderPickupEventsResponse,
  PlaceMerchOrderResponse,
  type GetAllMerchCollectionsResponse,
  type GetMerchOrdersResponse,
  type GetOneMerchItemResponse,
  type GetOneMerchOrderResponse,
  type PublicMerchCollection,
  type PublicMerchItem,
  type PublicOrder,
  type PublicOrderPickupEvent,
  type PublicOrderWithItems,
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

export const getOrder = async (token: string, uuid: string): Promise<PublicOrderWithItems> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.store.order}/${uuid}`;

  const response = await axios.get<GetOneMerchOrderResponse>(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.order;
};

export const getItem = async (token: string, uuid: string): Promise<PublicMerchItem> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.store.item}/${uuid}`;

  const response = await axios.get<GetOneMerchItemResponse>(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.item;
};

export const getFutureOrderPickupEvents = async (
  token: string
): Promise<PublicOrderPickupEvent[]> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.store.pickup.future}`;

  const response = await axios.get<GetOrderPickupEventsResponse>(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.pickupEvents;
};

export const placeMerchOrder = async (
  token: string,
  data: PlaceMerchOrderRequest
): Promise<PublicOrderWithItems> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.store.order}`;

  // console.log(token);
  // console.log(JSON.stringify(data));

  const response = await axios.post<PlaceMerchOrderResponse>(requestUrl, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.order;
};
