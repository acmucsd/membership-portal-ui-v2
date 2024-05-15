import { config } from '@/lib';
import { URL } from '@/lib/types';
import {
  CreateDiscordEventRequest,
  DeleteDiscordEventRequest,
  GenerateACMURLRequest,
  PatchDiscordEventRequest,
} from '@/lib/types/apiRequests';
import type { NotionEventDetails, NotionEventPreview } from '@/lib/types/apiResponses';
import axios from 'axios';
import totp from 'totp-generator';

const generateToken = (key: string): string => {
  const totpValue = totp(key, {
    digits: 8,
    algorithm: 'SHA-512',
    period: 10,
  });
  return totpValue;
};

/**
 * Fetch details from Notion URL
 * @param pageUrl Notion Calendar page URL
 * @returns Event details
 */
export const getNotionEventPage = async (pageUrl: URL): Promise<NotionEventDetails> => {
  const { klefki } = config;
  const requestUrl = `${klefki.baseUrl}${klefki.endpoints.notion.page}${encodeURIComponent(
    pageUrl
  )}`;

  const response = await axios.get<NotionEventDetails>(requestUrl, {
    headers: {
      Authorization: `Bearer ${generateToken(klefki.key)}`,
    },
  });

  return response.data;
};

export const createDiscordEvent = async (event: CreateDiscordEventRequest): Promise<any> => {
  const { klefki } = config;
  const requestUrl = `${klefki.baseUrl}${klefki.endpoints.discord.event}`;

  return axios.post<void>(requestUrl, event, {
    headers: {
      Authorization: `Bearer ${generateToken(klefki.key)}`,
    },
  });
};

export const patchDiscordEvent = async (event: PatchDiscordEventRequest): Promise<any> => {
  const { klefki } = config;
  const requestUrl = `${klefki.baseUrl}${klefki.endpoints.discord.event}`;

  return axios.patch<void>(requestUrl, event, {
    headers: {
      Authorization: `Bearer ${generateToken(klefki.key)}`,
    },
  });
};

export const deleteDiscordEvent = async (event: DeleteDiscordEventRequest): Promise<void> => {
  const { klefki } = config;
  const requestUrl = `${klefki.baseUrl}${klefki.endpoints.discord.event}`;

  await axios.delete<void>(requestUrl, {
    data: event,
    headers: {
      Authorization: `Bearer ${generateToken(klefki.key)}`,
    },
  });
};

export const getFutureEventsPreview = async (): Promise<NotionEventPreview[]> => {
  const { klefki } = config;
  const requestUrl = `${klefki.baseUrl}${klefki.endpoints.notion.events}`;

  try {
    const response = await axios.get<NotionEventPreview[]>(requestUrl, {
      headers: {
        Authorization: `Bearer ${generateToken(klefki.key)}`,
      },
    });

    return response.data.sort(
      (a, b) => new Date(a.date.start).getTime() - new Date(b.date.start).getTime()
    );
  } catch (e) {
    return [];
  }
};

export const generateACMURL = async (acmurlInfo: GenerateACMURLRequest): Promise<void> => {
  const { klefki } = config;
  const requestUrl = `${klefki.baseUrl}${klefki.endpoints.acmurl.generate}`;

  await axios.post<void>(requestUrl, acmurlInfo, {
    headers: {
      Authorization: `Bearer ${generateToken(klefki.key)}`,
    },
  });
};
