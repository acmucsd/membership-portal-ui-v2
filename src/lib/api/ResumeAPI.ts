import { config } from '@/lib';
import { UUID } from '@/lib/types';
import { PatchResumeRequest } from '@/lib/types/apiRequests';
import type {
  PatchResumeResponse,
  PublicResume,
  UpdateResumeResponse,
} from '@/lib/types/apiResponses';
import axios from 'axios';

/**
 * Update current user's resume
 * @param token Authorization bearer token
 * @param file The resume file
 * @param isResumeVisible Whether to share the resume with ACM sponsors (default: false)
 * @returns User's full profile
 */
export const uploadResume = async (
  token: string,
  file: File,
  isResumeVisible?: boolean
): Promise<PublicResume> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.resume}`;

  const requestBody = new FormData();
  requestBody.append('file', file);
  if (isResumeVisible !== undefined) {
    requestBody.append('isResumeVisible', String(isResumeVisible));
  }

  const response = await axios.post<UpdateResumeResponse>(requestUrl, requestBody, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.resume;
};

/**
 * Update a resume
 * @param token Authorization bearer token
 * @param uuid The resume UUID
 * @param isResumeVisible Whether to share the resume with ACM sponsors
 * @returns User's full profile
 */
export const uploadResumeVisibility = async (
  token: string,
  uuid: UUID,
  isResumeVisible?: boolean
): Promise<PublicResume> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.resume}/${uuid}`;

  const requestBody: PatchResumeRequest = { resume: { isResumeVisible } };

  const response = await axios.post<PatchResumeResponse>(requestUrl, requestBody, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.resume;
};

/**
 * Delete a resume
 * @param token Authorization bearer token
 * @param uuid The resume UUID
 * @returns User's full profile
 */
export const deleteResume = async (token: string, uuid: UUID): Promise<void> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.resume}/${uuid}`;

  await axios.delete(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
