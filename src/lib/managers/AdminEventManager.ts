/* eslint-disable import/prefer-default-export */
import { KlefkiAPI } from '@/lib/api';
import type { APIHandlerProps, URL } from '@/lib/types';
import type { NotionEventDetails } from '@/lib/types/apiResponses';

interface GetEventFromNotion {
  pageUrl: URL;
}

export const getEventFromNotionURL = async (data: GetEventFromNotion & APIHandlerProps) => {
  const { pageUrl, onSuccessCallback, onFailCallback } = data;

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
