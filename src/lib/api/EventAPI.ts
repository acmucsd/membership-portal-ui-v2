import { config } from '@/lib';
import { UUID } from '@/lib/types';
import type {
  GetAllEventsResponse,
  GetFutureEventsResponse,
  GetOneEventResponse,
  PublicEvent,
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
export const getAllFutureEvents = async (token: string): Promise<PublicEvent[]> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.event.future}`;

  const response = await axios.get<GetFutureEventsResponse>(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.events;
};

/**
 * Get all past events
 * @param token Bearer token
 * @returns List of event info
 */
export const getAllPastEvents = async (token: string): Promise<PublicEvent[]> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.event.past}`;

  const response = await axios.get<GetFutureEventsResponse>(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.events;
};

/**
 * Get all lifetime events
 * @param token Bearer token
 * @returns List of event info
 */
export const getAllEvents = async (token: string): Promise<PublicEvent[]> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.event.event}`;

  const response = await axios.get<GetAllEventsResponse>(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.events;
};
