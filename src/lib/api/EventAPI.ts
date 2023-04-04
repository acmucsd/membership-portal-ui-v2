import { config } from '@/lib';
import { UUID } from '@/lib/types';
import {
  GetAllEventsResponse,
  GetFutureEventsResponse,
  GetOneEventResponse,
  PublicEvent,
} from '@/lib/types/apiResponses';
import axios from 'axios';

export default class EventAPI {
  /**
   * Get a single event by UUID
   * @param uuid Search query uuid
   * @param token Bearer token
   * @returns Event info
   */
  static async getEvent(uuid: UUID, token: string): Promise<PublicEvent> {
    const requestUrl = `${config.api.baseUrl}${config.api.endpoints.event.event}/${uuid}`;

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
    const requestUrl = `${config.api.baseUrl}${config.api.endpoints.event.future}`;

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
    const requestUrl = `${config.api.baseUrl}${config.api.endpoints.event.past}`;

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
    const requestUrl = `${config.api.baseUrl}${config.api.endpoints.event.event}`;

    const response = await axios.get<GetAllEventsResponse>(requestUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.events;
  }
}
