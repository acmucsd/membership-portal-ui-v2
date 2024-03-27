import { config } from '@/lib';
import { FillInLater, UUID } from '@/lib/types';
import { AttendEventRequest, Event, OrderPickupEvent } from '@/lib/types/apiRequests';
import {
  AttendEventResponse,
  CreateEventResponse,
  CreatePickupEventResponse,
  GetAllEventsResponse,
  GetFutureEventsResponse,
  GetOneEventResponse,
  GetPastEventsResponse,
  PatchEventResponse,
  PublicEvent,
  PublicOrderPickupEvent,
} from '@/lib/types/apiResponses';
import axios from 'axios';

/**
 * Get a single event by UUID
 * @param uuid Search query uuid
 * @param token Bearer token
 * @returns Event info
 */
export const getEvent = async (uuid: UUID, token: string): Promise<PublicEvent> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.event.event}/${uuid}`;

  const response = await axios.get<GetOneEventResponse>(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.event;
};

/**
 * Get all future events
 * @param token Bearer token
 * @returns List of event info
 */
export const getAllFutureEvents = async (): Promise<PublicEvent[]> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.event.future}`;

  const response = await axios.get<GetFutureEventsResponse>(requestUrl);

  return response.data.events;
};

/**
 * Get all past events
 * @param token Bearer token
 * @returns List of event info
 */
export const getAllPastEvents = async (): Promise<PublicEvent[]> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.event.past}`;

  const response = await axios.get<GetPastEventsResponse>(requestUrl);

  return response.data.events;
};

/**
 * Get all lifetime events
 * @param token Bearer token
 * @returns List of event info
 */
export const getAllEvents = async (): Promise<PublicEvent[]> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.event.event}`;

  const response = await axios.get<GetAllEventsResponse>(requestUrl);

  return response.data.events;
};

export const attendEvent = async (
  token: string,
  attendanceCode: string
): Promise<AttendEventResponse> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.attendance.attendance}`;

  const requestBody = { attendanceCode, asStaff: false } as AttendEventRequest;

  const response = await axios.post<AttendEventResponse>(requestUrl, requestBody, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createEvent = async (token: string, event: Event): Promise<PublicEvent> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.event.event}`;

  const requestBody = { event };

  const response = await axios.post<CreateEventResponse>(requestUrl, requestBody, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.event;
};

export const editEvent = async (
  token: string,
  uuid: UUID,
  event: Partial<Event>
): Promise<PublicEvent> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.event.event}/${uuid}`;

  const requestBody = { event };

  const response = await axios.patch<PatchEventResponse>(requestUrl, requestBody, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.event;
};

export const deleteEvent = async (token: string, event: UUID): Promise<void> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.event.event}/${event}`;

  await axios.delete(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createPickupEvent = async (
  token: string,
  pickupEvent: Partial<OrderPickupEvent>
): Promise<PublicOrderPickupEvent> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.store.pickup.single}`;

  const requestBody = { pickupEvent };

  console.log('eventAPI');
  console.log(JSON.stringify(pickupEvent, null, 4));
  console.log('endJsonString');

  const response = await axios.post<CreatePickupEventResponse>(requestUrl, requestBody, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.pickupEvent;
};

export const editPickupEvent = async (
  token: string,
  uuid: UUID,
  event: Partial<OrderPickupEvent>
): Promise<PublicOrderPickupEvent> => {
  // PublicOrderPickupEvent part of apiResponses
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.store.pickup.single}/${uuid}`;

  const requestBody = { event };

  const response = await axios.post<CreatePickupEventResponse>(requestUrl, requestBody, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.pickupEvent;
};

export const uploadEventImage = async (
  token: string,
  uuid: UUID,
  cover: File
): Promise<FillInLater> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.event.picture}/${uuid}`;

  const requestBody = new FormData();
  requestBody.append('image', cover);

  await axios.post<Response>(requestUrl, requestBody, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
