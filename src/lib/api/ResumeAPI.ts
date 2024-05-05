import { config } from '@/lib';
import type { UUID } from '@/lib/types';
import { PatchResumeRequest } from '@/lib/types/apiRequests';
import {
  GetVisibleResumesResponse,
  type PatchResumeResponse,
  type PublicResume,
  type UpdateResumeResponse,
} from '@/lib/types/apiResponses';
import axios from 'axios';

/**
 * Update current user's resume
 * @param token Authorization bearer token
 * @param file The resume file
 * @param isResumeVisible Whether to share the resume with ACM sponsors (default: false)
 * @returns The resume
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
 * Update a resume's visibility
 * @param token Authorization bearer token
 * @param uuid The resume UUID
 * @param isResumeVisible Whether to share the resume with ACM sponsors
 * @returns The resume
 */
export const uploadResumeVisibility = async (
  token: string,
  uuid: UUID,
  isResumeVisible?: boolean
): Promise<PublicResume> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.resume}/${uuid}`;

  const requestBody: PatchResumeRequest = { resume: { isResumeVisible } };

  const response = await axios.patch<PatchResumeResponse>(requestUrl, requestBody, {
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
 */
export const deleteResume = async (token: string, uuid: UUID): Promise<void> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.resume}/${uuid}`;

  await axios.delete(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/**
 * Get all visible resumes
 * @param token Authorization bearer token. User needs to be admin or
 * sponsorship manager
 */
export const getResumes = async (token: string): Promise<PublicResume[]> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.resume}`;

  const response = await axios.get<GetVisibleResumesResponse>(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.resumes;
};
