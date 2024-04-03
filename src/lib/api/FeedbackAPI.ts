import config from '@/lib/config';
import { UUID } from '@/lib/types';
import {
  Feedback,
  SubmitFeedbackRequest,
  UpdateFeedbackStatusRequest,
} from '@/lib/types/apiRequests';
import {
  GetFeedbackResponse,
  PublicFeedback,
  SubmitFeedbackResponse,
  UpdateFeedbackStatusResponse,
} from '@/lib/types/apiResponses';
import { FeedbackStatus, FeedbackType } from '@/lib/types/enums';
import axios from 'axios';

/**
 * Submit feedback
 * @param token Bearer token
 * @param feedback Feedback object
 * @returns The submitted feedback
 */
export const addFeedback = async (token: string, feedback: Feedback): Promise<PublicFeedback> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.feedback}`;

  const requestBody: SubmitFeedbackRequest = { feedback };

  const response = await axios.post<SubmitFeedbackResponse>(requestUrl, requestBody, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.feedback;
};

export interface FeedbackSearchOptions {
  event?: UUID;
  type?: FeedbackType;
  status?: FeedbackStatus;
  user?: UUID;
}

/**
 * Get all feedback submitted by user, or by all users if current user can see
 * all feedback
 * @param token Bearer token
 * @param options Filter feedback by properties. Ignored if user can't see all
 * feedback
 * @returns List of submitted feedback
 */
export const getFeedback = async (
  token: string,
  options: FeedbackSearchOptions = {}
): Promise<PublicFeedback[]> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.feedback}?${new URLSearchParams(
    Object.entries(options)
  )}`;

  const response = await axios.get<GetFeedbackResponse>(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.feedback;
};

/**
 * Set status (e.g. acknowledged, ignored) of feedback
 * @param token Bearer token
 * @param uuid Feedback ID
 * @param status Status to set feedback to
 * @returns The updated feedback object
 */
export const respondToFeedback = async (
  token: string,
  uuid: string,
  status: FeedbackStatus
): Promise<PublicFeedback> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.feedback}/${uuid}`;

  const requestBody: UpdateFeedbackStatusRequest = { status };

  const response = await axios.patch<UpdateFeedbackStatusResponse>(requestUrl, requestBody, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.feedback;
};
