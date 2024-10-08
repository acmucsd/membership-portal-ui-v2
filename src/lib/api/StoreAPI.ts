import { config } from '@/lib';
import type { UUID } from '@/lib/types';
import {
  CreateMerchCollectionRequest,
  CreateMerchItemOptionRequest,
  CreateMerchItemRequest,
  EditMerchCollectionRequest,
  EditMerchItemRequest,
  FulfillMerchOrderRequest,
  MerchCollection,
  MerchCollectionEdit,
  MerchItem,
  MerchItemEdit,
  MerchItemOption,
  OrderItemFulfillmentUpdate,
  PlaceMerchOrderRequest,
  RescheduleOrderPickupRequest,
} from '@/lib/types/apiRequests';
import type {
  ApiResponse,
  CreateCollectionPhotoResponse,
  CreateMerchCollectionResponse,
  CreateMerchItemOptionResponse,
  CreateMerchItemResponse,
  CreateMerchPhotoResponse,
  DeleteMerchCollectionResponse,
  DeleteMerchItemResponse,
  EditMerchCollectionResponse,
  EditMerchItemResponse,
  FulfillMerchOrderResponse,
  GetAllMerchCollectionsResponse,
  GetMerchOrdersResponse,
  GetOneMerchCollectionResponse,
  GetOneMerchItemResponse,
  GetOneMerchOrderResponse,
  GetOrderPickupEventResponse,
  GetOrderPickupEventsResponse,
  PlaceMerchOrderResponse,
  PublicMerchCollection,
  PublicMerchCollectionPhoto,
  PublicMerchItem,
  PublicMerchItemOption,
  PublicMerchItemPhoto,
  PublicMerchItemWithPurchaseLimits,
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
  token: string,
  uuid: UUID
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
  collection: MerchCollectionEdit
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

export const getPickupEvent = async (
  token: string,
  uuid: string
): Promise<PublicOrderPickupEvent> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.store.pickup.single}/${uuid}`;

  const response = await axios.get<GetOrderPickupEventResponse>(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.pickupEvent;
};

/**
 * Upload a photo for a store collection
 * @param token Authorization bearer token
 * @param uuid Store collection UUID
 * @param image Photo
 * @param position The position of the image
 * @returns The store collection photo object
 */
export const createCollectionPhoto = async (
  token: string,
  uuid: UUID,
  image: Blob,
  position = 0
): Promise<PublicMerchCollectionPhoto> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.store.collectionPicture}/${uuid}`;

  const requestBody = new FormData();
  requestBody.append('position', `${position}`);
  requestBody.append('image', image);

  const response = await axios.post<CreateCollectionPhotoResponse>(requestUrl, requestBody, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.collectionPhoto;
};

/**
 * Delete a merch collection photo
 * @param token Authorization bearer token
 * @param uuid Merch collection *photo* UUID
 */
export const deleteCollectionPhoto = async (token: string, uuid: UUID): Promise<void> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.store.collectionPicture}/${uuid}`;

  await axios.delete(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
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

export const getValidFutureOrderPickupEvents = async (
  token: string
): Promise<PublicOrderPickupEvent[]> => {
  return getFutureOrderPickupEvents(token).then(events =>
    events
      .filter(event => event.status !== 'CANCELLED')
      .filter(
        event => !(event.orders && event.orderLimit && event.orders.length > event.orderLimit)
      )
      // filter out events that have a start time less than 2 days from now
      .filter(event => {
        const startTime = new Date(event.start);
        const now = Date.now();
        const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;
        const twoDaysFromNow = new Date(now + twoDaysInMs);
        return startTime >= twoDaysFromNow;
      })
  );
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

export const getPastOrderPickupEvents = async (
  token: string
): Promise<PublicOrderPickupEvent[]> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.store.pickup.past}`;

  const response = await axios.get<GetOrderPickupEventsResponse>(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.pickupEvents;
};

export const fulfillOrderPickup = async (
  token: string,
  order: UUID,
  items: OrderItemFulfillmentUpdate[]
): Promise<PublicOrder> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.store.order}/${order}/fulfill`;

  const requestBody: FulfillMerchOrderRequest = { items };

  const response = await axios.post<FulfillMerchOrderResponse>(requestUrl, requestBody, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.order;
};

export const rescheduleOrderPickup = async (
  token: string,
  order: string,
  pickupEvent: string
): Promise<void> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.store.order}/${order}/reschedule`;

  const requestBody: RescheduleOrderPickupRequest = { pickupEvent };

  await axios.post<ApiResponse>(requestUrl, requestBody, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const cancelMerchOrder = async (token: string, order: string): Promise<void> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.store.order}/${order}/cancel`;

  await axios.post(
    requestUrl,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
