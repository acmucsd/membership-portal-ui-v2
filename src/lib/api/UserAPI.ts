/* eslint-disable import/prefer-default-export */
import { config } from '@/lib';
import type {
  GetCurrentUserResponse,
  GetUserResponse,
  PrivateProfile,
  PublicProfile,
} from '@/lib/types/apiResponses';
import axios from 'axios';

/**
 * Get current user's private profile
 * @param token Authorization bearer token
 * @returns User's full profile
 */
export const getCurrentUser = async (token: string): Promise<PrivateProfile> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.user.user}`;

  const response = await axios.get<GetCurrentUserResponse>(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.user;
};

/**
 * Get specified user's public profile
 * @param token Authorization bearer token
 * @param handle Handle of user to retrieve
 * @returns User's public profile
 */
export const getUserByHandle = async (token: string, handle: string): Promise<PublicProfile> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.user.handle}/${handle}`;

  const response = await axios.get<GetUserResponse>(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.user;
};
