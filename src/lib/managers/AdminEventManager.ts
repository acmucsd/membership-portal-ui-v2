import { EventAPI, KlefkiAPI } from '@/lib/api';
import config from '@/lib/config';
import type { APIHandlerProps, AuthAPIHandlerProps, URL, UUID } from '@/lib/types';
import {
  CreateDiscordEventRequest,
  CreateEventRequest,
  DeleteEventRequest,
  Event,
  GenerateACMURLRequest,
  OrderPickupEvent,
  UploadEventImageRequest,
} from '@/lib/types/apiRequests';
import type {
  NotionEventDetails,
  PublicEvent,
  PublicOrderPickupEvent,
} from '@/lib/types/apiResponses';
import { reportError } from '@/lib/utils';

interface GetEventFromNotion {
  pageUrl: URL;
}

export const getEventFromNotionURL = async (
  data: GetEventFromNotion & APIHandlerProps<NotionEventDetails>
) => {
  const { pageUrl, onSuccessCallback, onFailCallback } = data;

  // Added this additional check here because it was erroring on empty data
  if (!pageUrl) {
    onFailCallback?.('Missing Notion URL');
    return;
  }

  try {
    const eventInfo: NotionEventDetails = await KlefkiAPI.getNotionEventPage(pageUrl);

    onSuccessCallback?.(eventInfo);
  } catch (e) {
    onFailCallback?.(e);
  }
};

/**
 * Create Discord event
 * @param data
 */
export const createDiscordEvent = async (
  data: CreateDiscordEventRequest & APIHandlerProps<void>
) => {
  const { onSuccessCallback, onFailCallback, ...event } = data;
  try {
    await KlefkiAPI.createDiscordEvent(event);
    onSuccessCallback?.();
  } catch (e: any) {
    onFailCallback?.(e.response.data.error);
  }
};

export const generateACMURL = async (data: GenerateACMURLRequest & APIHandlerProps<void>) => {
  const { onSuccessCallback, onFailCallback, ...acmurlInfo } = data;
  try {
    await KlefkiAPI.generateACMURL(acmurlInfo);
    onSuccessCallback?.();
  } catch (e) {
    onFailCallback?.(e);
  }
};

export const createNewEvent = async (
  data: CreateEventRequest & UploadEventImageRequest & AuthAPIHandlerProps<PublicEvent>
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
  } catch (e) {
    onFailCallback?.(e);
  }
};

interface EditEventRequest {
  event: Partial<Event>;
  cover?: File;
  uuid: UUID;
}

export const editEvent = async (data: EditEventRequest & AuthAPIHandlerProps<PublicEvent>) => {
  const { onSuccessCallback, onFailCallback, token, event, uuid } = data;
  if (data.cover && data.cover.size > config.file.MAX_EVENT_COVER_SIZE_KB * 1024) {
    onFailCallback?.(new Error('Cover size too large'));
    return;
  }

  try {
    const modifiedEvent = await EventAPI.editEvent(token, uuid, event);
    if (data.cover) {
      // There's some weird behavior that happens when we editEvent after uploading a new
      // event image, so I've kept the API calls in the same order as createNewEvent
      await EventAPI.uploadEventImage(token, uuid, data.cover);
    }

    onSuccessCallback?.(modifiedEvent);
  } catch (e) {
    onFailCallback?.(e);
  }
};

export const createPickupEvent = async (
  token: string,
  event: OrderPickupEvent
): Promise<UUID | null> => {
  try {
    console.log(event);
    const { uuid } = await EventAPI.createPickupEvent(token, event);
    return uuid;
  } catch (error) {
    reportError('Could not create pickup event', error);
    return null;
  }
};

interface EditPickupEventRequest {
  event: Partial<OrderPickupEvent>;
  cover?: File;
  uuid: UUID;
}

export const editPickupEvent = async (
  data: EditPickupEventRequest & AuthAPIHandlerProps<PublicOrderPickupEvent>
) => {
  const { onSuccessCallback, onFailCallback, token, event, uuid } = data;
  if (data.cover && data.cover.size > config.file.MAX_EVENT_COVER_SIZE_KB * 1024) {
    onFailCallback?.(new Error('Cover size too large'));
    return;
  }

  try {
    const modifiedEvent = await EventAPI.editPickupEvent(token, uuid, event);
    if (data.cover) {
      // There's some weird behavior that happens when we editEvent after uploading a new
      // event image, so I've kept the API calls in the same order as createNewEvent
      await EventAPI.uploadEventImage(token, uuid, data.cover);
    }

    onSuccessCallback?.(modifiedEvent);
  } catch (e) {
    onFailCallback?.(e);
  }
};

interface PatchEventRequest {
  uuid: UUID;
  cover: File;
}

export const uploadEventImage = async (data: PatchEventRequest & AuthAPIHandlerProps<void>) => {
  const { onSuccessCallback, onFailCallback, token, uuid, cover } = data;

  try {
    await EventAPI.uploadEventImage(token, uuid, cover);

    onSuccessCallback?.();
  } catch (e) {
    onFailCallback?.(e);
  }
};

export const deleteEvent = async (data: DeleteEventRequest & AuthAPIHandlerProps<void>) => {
  const { onSuccessCallback, onFailCallback, token, event } = data;

  try {
    await EventAPI.deleteEvent(token, event);

    onSuccessCallback?.();
  } catch (e) {
    onFailCallback?.(e);
  }
};
