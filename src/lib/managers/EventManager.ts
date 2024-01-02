import { EventAPI } from '@/lib/api';
import type { APIHandlerProps, AuthAPIHandlerProps } from '@/lib/types';
import type { AttendEventRequest, GetEventRequest } from '@/lib/types/apiRequests';
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
export const getAllEvents = async (data: APIHandlerProps): Promise<PublicEvent[] | undefined> => {
  const { onSuccessCallback, onFailCallback } = data;

  try {
    const eventArray = await EventAPI.getAllEvents();

    onSuccessCallback?.(eventArray);
    return eventArray;
  } catch (e: any) {
    onFailCallback?.(e.response.data.error);
    return undefined;
  }
};

export const attendEvent = async (
  data: AttendEventRequest & AuthAPIHandlerProps
): Promise<PublicEvent | undefined> => {
  const { token, attendanceCode, onSuccessCallback, onFailCallback } = data;

  try {
    const response = await EventAPI.attendEvent(token, attendanceCode);
    onSuccessCallback?.(response);
    return response.event;
  } catch (e: any) {
    onFailCallback?.(e.response.data.error);
    return undefined;
  }
};
