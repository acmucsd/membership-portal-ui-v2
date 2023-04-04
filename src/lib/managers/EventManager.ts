import EventAPI from '@/lib/api/EventAPI';
import type { AuthAPIHandlerProps, UuidQuery } from '@/lib/types';
import { PublicEvent } from '@/lib/types/apiResponses';

export default class EventManager {
  static async getEvent(data: UuidQuery & AuthAPIHandlerProps): Promise<PublicEvent | undefined> {
    const { uuid, token, onSuccessCallback, onFailCallback } = data;

    try {
      const event: PublicEvent = await EventAPI.getEvent(uuid, token);

      onSuccessCallback?.(event);
      return event;
    } catch (e: any) {
      onFailCallback?.(e.response.data.error);
      return undefined;
    }
  }

  static async getAllEvents(data: AuthAPIHandlerProps): Promise<PublicEvent[] | undefined> {
    const { token, onSuccessCallback, onFailCallback } = data;

    try {
      const eventArray = await EventAPI.getAllEvents(token);

      onSuccessCallback?.(eventArray);
      return eventArray;
    } catch (e: any) {
      onFailCallback?.(e.response.data.error);
      return undefined;
    }
  }
}
