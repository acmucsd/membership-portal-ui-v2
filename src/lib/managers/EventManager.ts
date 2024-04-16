import { EventAPI } from '@/lib/api';
import type { APIHandlerProps, AuthAPIHandlerProps } from '@/lib/types';
import type {
  AttendEventRequest,
  ExpressCheckInRequest,
  GetEventRequest,
} from '@/lib/types/apiRequests';
import type { CustomErrorBody, PublicEvent } from '@/lib/types/apiResponses';
import { getErrorMessage } from '@/lib/utils';

/**
 * Get details for a single ACM event
 * @param data Request parameters object
 * @returns
 */
export const getEvent = async (
  data: GetEventRequest & AuthAPIHandlerProps<PublicEvent>
): Promise<PublicEvent | undefined> => {
  const { event: uuid, token, onSuccessCallback, onFailCallback } = data;

  try {
    const event: PublicEvent = await EventAPI.getEvent(uuid, token);

    onSuccessCallback?.(event);
    return event;
  } catch (e) {
    onFailCallback?.(e);
    return undefined;
  }
};

/**
 * Get details for all past and future ACM events
 * @param data Request parameters object
 * @returns Array of all lifetime events
 */
export const getAllEvents = async (
  data: APIHandlerProps<PublicEvent[]>
): Promise<PublicEvent[] | undefined> => {
  const { onSuccessCallback, onFailCallback } = data;

  try {
    const eventArray = await EventAPI.getAllEvents();

    onSuccessCallback?.(eventArray);
    return eventArray;
  } catch (e) {
    onFailCallback?.(e);
    return undefined;
  }
};

export const attendEvent = async (
  data: AttendEventRequest & AuthAPIHandlerProps<PublicEvent>
): Promise<PublicEvent | { error: string }> => {
  const { token, attendanceCode, onSuccessCallback, onFailCallback } = data;

  try {
    const response = await EventAPI.attendEvent(token, attendanceCode);
    onSuccessCallback?.(response.event);
    return response.event;
  } catch (e) {
    onFailCallback?.(e);
    return { error: getErrorMessage(e) };
  }
};

export const expressCheckIn = async (
  data: ExpressCheckInRequest & APIHandlerProps
): Promise<PublicEvent | CustomErrorBody> => {
  const { email, attendanceCode, onSuccessCallback, onFailCallback } = data;

  try {
    const response = await EventAPI.expressCheckin(email, attendanceCode);
    onSuccessCallback?.(response.event);
    return response.event;
  } catch (e: any) {
    onFailCallback?.(e.response.data.error);
    return e.response.data.error;
  }
};
