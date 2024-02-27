import { config } from '@/lib';
import type { UUID } from '@/lib/types';
import {
  CreateMerchCollectionRequest,
  CreateMerchItemOptionRequest,
  CreateMerchItemRequest,
  EditMerchCollectionRequest,
  EditMerchItemRequest,
  MerchCollection,
  MerchItem,
  MerchItemEdit,
  MerchItemOption,
  PlaceMerchOrderRequest,
} from '@/lib/types/apiRequests';
import type {
  CreateMerchCollectionResponse,
  CreateMerchItemOptionResponse,
  CreateMerchItemResponse,
  CreateMerchPhotoResponse,
  DeleteMerchCollectionResponse,
  DeleteMerchItemResponse,
  EditMerchCollectionResponse,
  EditMerchItemResponse,
  GetAllMerchCollectionsResponse,
  GetMerchOrdersResponse,
  GetOneMerchCollectionResponse,
  GetOneMerchItemResponse,
  GetOneMerchOrderResponse,
  GetOrderPickupEventsResponse,
  PlaceMerchOrderResponse,
  PublicMerchCollection,
  PublicOrder,
  PublicOrderPickupEvent,
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
 * Create a single store item by UUID
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
 * Edit a single store item by UUID
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
 * Delete a single store item by UUID
 * @param token Bearer token
 * @param uuid Merch item UUID
 */
export const deleteItem = async (token: string, uuid: UUID): Promise<void> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.store.item}/${uuid}`;

  await axios.delete<DeleteMerchItemResponse>(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/**
 * Upload a photo for a store item
 * @param token Authorization bearer token
 * @param uuid Store item UUID
 * @param image Photo
 * @param position The position of the image
 * @returns The store item photo object
 */
export const createItemPhoto = async (
  token: string,
  uuid: UUID,
  image: Blob,
  position = 0
): Promise<PublicMerchItemPhoto> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.store.itemPicture}/${uuid}`;

  const requestBody = new FormData();
  requestBody.append('position', `${position}`);
  requestBody.append('image', image);

  const response = await axios.post<CreateMerchPhotoResponse>(requestUrl, requestBody, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.merchPhoto;
};

/**
 * Delete a merch item photo
 * @param token Authorization bearer token
 * @param uuid Merch item *photo* UUID
 */
export const deleteItemPhoto = async (token: string, uuid: UUID): Promise<void> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.store.itemPicture}/${uuid}`;

  await axios.delete(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/**
 * Create a store item option
 * @param token Authorization bearer token
 * @param uuid Store item UUID
 * @param option The store item option object
 * @returns The store item option object
 */
export const createItemOption = async (
  token: string,
  uuid: UUID,
  option: MerchItemOption
): Promise<PublicMerchItemOption> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.store.option}/${uuid}`;

  const requestBody: CreateMerchItemOptionRequest = { option };

  const response = await axios.post<CreateMerchItemOptionResponse>(requestUrl, requestBody, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.option;
};

/**
 * Delete a merch item option
 * @param token Authorization bearer token
 * @param uuid Merch item *option* UUID
 */
export const deleteItemOption = async (token: string, uuid: UUID): Promise<void> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.store.option}/${uuid}`;

  await axios.delete(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/**
 * Create a single collection by UUID
 * @param token Bearer token
 * @param collection Collection info
 * @returns Collection info
 */
export const createCollection = async (
  token: string,
  collection: MerchCollection
): Promise<PublicMerchCollection> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.store.collection}`;

  const requestBody: CreateMerchCollectionRequest = { collection };

  const response = await axios.post<CreateMerchCollectionResponse>(requestUrl, requestBody, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.collection;
};

/**
 * Edit a single collection by UUID
 * @param token Bearer token
 * @param uuid Collection UUID
 * @param collection Collection info
 * @returns Collection info
 */
export const editCollection = async (
  token: string,
  uuid: UUID,
  collection: MerchCollection
): Promise<PublicMerchCollection> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.store.collection}/${uuid}`;

  const requestBody: EditMerchCollectionRequest = { collection };

  const response = await axios.patch<EditMerchCollectionResponse>(requestUrl, requestBody, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.collection;
};

/**
 * Delete a single collection by UUID
 * @param token Bearer token
 * @param uuid Merch collection UUID
 */
export const deleteCollection = async (token: string, uuid: UUID): Promise<void> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.store.collection}/${uuid}`;

  await axios.delete<DeleteMerchCollectionResponse>(requestUrl, {
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

export const getCollection = async (
  token: string,
  uuid: string
): Promise<PublicMerchCollection> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.store.collection}/${uuid}`;

  const response = await axios.get<GetOneMerchCollectionResponse>(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.collection;
};

export const getItem = async (
  token: string,
  uuid: string
): Promise<PublicMerchItemWithPurchaseLimits> => {
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

  const response = await axios.post<PlaceMerchOrderResponse>(requestUrl, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.order;
};
