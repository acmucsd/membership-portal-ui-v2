import { EventAPI } from '@/lib/api';
import type { AuthAPIHandlerProps } from '@/lib/types';
import type { GetEventRequest } from '@/lib/types/apiRequests';
import type { PublicEvent } from '@/lib/types/apiResponses';

/**
 * Get details for a single ACM event
 * @param data Request parameters object
 * @returns
 */
export const getEvent = async (
  data: GetEventRequest & AuthAPIHandlerProps
): Promise<PublicEvent | undefined> => {
  const { event: uuid, token, onSuccessCallback, onFailCallback } = data;

  try {
    const event: PublicEvent = await EventAPI.getEvent(uuid, token);

    onSuccessCallback?.(event);
    return event;
  } catch (e: any) {
    onFailCallback?.(e.response.data.error);
    return undefined;
  }
};

/**
 * Get details for all past and future ACM events
 * @param data Request parameters object
 * @returns Array of all lifetime events
 */
export const getAllEvents = async (
  data: AuthAPIHandlerProps
): Promise<PublicEvent[] | undefined> => {
  const { token, onSuccessCallback, onFailCallback } = data;

  try {
    const eventArray = await EventAPI.getAllEvents(token);

    onSuccessCallback?.(eventArray);
    return eventArray;
  } catch (e: any) {
    onFailCallback?.(e.response.data.error);
    return undefined;
  }
};
