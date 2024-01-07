import { EventAPI, KlefkiAPI } from '@/lib/api';
import config from '@/lib/config';
import type { APIHandlerProps, AuthAPIHandlerProps, URL, UUID } from '@/lib/types';
import {
  CreateDiscordEventRequest,
  CreateEventRequest,
  DeleteEventRequest,
  Event,
  UploadEventImageRequest,
} from '@/lib/types/apiRequests';
import type { NotionEventDetails } from '@/lib/types/apiResponses';

interface GetEventFromNotion {
  pageUrl: URL;
}

export const getEventFromNotionURL = async (data: GetEventFromNotion & APIHandlerProps) => {
  const { pageUrl, onSuccessCallback, onFailCallback } = data;

  // Added this additional check here because it was erroring on empty data
  if (!pageUrl) {
    onFailCallback?.('Missing Notion URL');
    return;
  }

  try {
    const eventInfo: NotionEventDetails = await KlefkiAPI.getNotionEventPage(pageUrl);

    onSuccessCallback?.(eventInfo);
  } catch (e: any) {
    onFailCallback?.(e.response.data.error);
  }
};

/**
 * Create Discord event
 * @param data
 */
export const createDiscordEvent = async (data: CreateDiscordEventRequest & APIHandlerProps) => {
  const { onSuccessCallback, onFailCallback, ...event } = data;
  try {
    await KlefkiAPI.createDiscordEvent(event);
    onSuccessCallback?.();
  } catch (e: any) {
    onFailCallback?.(e.response.data.error);
  }
};

export const createNewEvent = async (
  data: CreateEventRequest & UploadEventImageRequest & AuthAPIHandlerProps
) => {
  const { onSuccessCallback, onFailCallback, token, event, cover } = data;

  if (cover.size > config.file.MAX_EVENT_COVER_SIZE_KB * 1024) {
    onFailCallback?.(new Error('Cover size too large'));
    return;
  }
  try {
    const createdEvent = await EventAPI.createEvent(token, event);
    await EventAPI.uploadEventImage(token, createdEvent.uuid, cover);

    onSuccessCallback?.(createdEvent);
  } catch (e: any) {
    onFailCallback?.(e.response.data.error);
  }
};

interface EditEventRequest {
  event: Partial<Event>;
  uuid: UUID;
}

export const editEvent = async (data: EditEventRequest & AuthAPIHandlerProps) => {
  const { onSuccessCallback, onFailCallback, token, event, uuid } = data;

  try {
    const modifiedEvent = await EventAPI.editEvent(token, uuid, event);

    onSuccessCallback?.(modifiedEvent);
  } catch (e: any) {
    onFailCallback?.(e.response.data.error);
  }
};
interface PatchEventRequest {
  uuid: UUID;
  cover: File;
}

export const uploadEventImage = async (data: PatchEventRequest & AuthAPIHandlerProps) => {
  const { onSuccessCallback, onFailCallback, token, uuid, cover } = data;

  try {
    await EventAPI.uploadEventImage(token, uuid, cover);

    onSuccessCallback?.();
  } catch (e: any) {
    onFailCallback?.(e.response.data.error);
  }
};

export const deleteEvent = async (data: DeleteEventRequest & AuthAPIHandlerProps) => {
  const { onSuccessCallback, onFailCallback, token, event } = data;

  try {
    await EventAPI.deleteEvent(token, event);

    onSuccessCallback?.();
  } catch (e: any) {
    onFailCallback?.(e.response.data.error);
  }
};
