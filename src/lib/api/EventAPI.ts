import { config } from '@/lib';
import { Uuid } from '@/lib/types';
import {
  GetAllEventsResponse,
  GetFutureEventsResponse,
  GetOneEventResponse,
  PublicEvent,
} from '@/lib/types/apiResponses';
import axios from 'axios';

export default class EventAPI {
  /**
   * Get single event by uuid
   * @param uuid Search query
   * @param token Bearer token
   * @returns Event info
   */
  static async getEvent(uuid: Uuid, token: string): Promise<PublicEvent> {
    const requestUrl = `${config.acmApi.baseUrl}${config.acmApi.endpoints.event.event}/${uuid}`;

    const response = await axios.get<GetOneEventResponse>(requestUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.event;
  }

  /**
   * Get all future events
   * @param token Bearer token
   * @returns List of event info
   */
  static async getAllFutureEvents(token: string): Promise<PublicEvent[]> {
    const requestUrl = `${config.acmApi.baseUrl}${config.acmApi.endpoints.event.future}`;

    const response = await axios.get<GetFutureEventsResponse>(requestUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.events;
  }

  /**
   * Get all past events
   * @param token Bearer token
   * @returns List of event info
   */
  static async getAllPastEvents(token: string): Promise<PublicEvent[]> {
    const requestUrl = `${config.acmApi.baseUrl}${config.acmApi.endpoints.event.past}`;

    const response = await axios.get<GetFutureEventsResponse>(requestUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.events;
  }

  /**
   * Get all lifetime events
   * @param token Bearer token
   * @returns List of event info
   */
  static async getAllEvents(token: string): Promise<PublicEvent[]> {
    const requestUrl = `${config.acmApi.baseUrl}${config.acmApi.endpoints.event.event}`;

    const response = await axios.get<GetAllEventsResponse>(requestUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.events;
  }
}
