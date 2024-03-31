import config from '@/lib/config';
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
import { FeedbackStatus } from '@/lib/types/enums';
import axios from 'axios';

/**
 * Submit feedback
 * @param token Bearer token. Authenticated user must strictly be in the
 * `ACTIVE` state (not `PASSWORD_RESET`)
 * @param title Title of feedback
 * @param description Description of feedback. Must be at least 100 characters
 * long.
 * @param type Type of ACM offering that the feedback is addressed to.
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

/**
 * Get all feedback submitted by user, or by all users if current user is an
 * admin.
 * @param token Bearer token
 * @returns List of submitted feedback
 */
export const getFeedback = async (token: string): Promise<PublicFeedback[]> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.feedback}`;

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
