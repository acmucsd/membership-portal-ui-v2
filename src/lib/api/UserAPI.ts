import { config } from '@/lib';
import { PatchUserRequest, UserPatches } from '@/lib/types/apiRequests';
import type {
  GetCurrentUserResponse,
  GetUserResponse,
  PatchUserResponse,
  PrivateProfile,
  PublicProfile,
  UpdateProfilePictureResponse,
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

/**
 * Update current user's profile picture
 * @param token Authorization bearer token
 * @param picture Profile picture
 * @returns User's full profile
 */
export const uploadProfilePicture = async (
  token: string,
  picture: Blob
): Promise<PrivateProfile> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.user.profilepicture}`;

  const requestBody = new FormData();
  requestBody.append('image', picture);

  const response = await axios.post<UpdateProfilePictureResponse>(requestUrl, requestBody, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.user;
};

/**
 * Update current user's private profile
 * @param token Authorization bearer token
 * @param user Profile changes
 * @returns User's full profile
 */
export const updateCurrentUser = async (
  token: string,
  user: UserPatches
): Promise<PrivateProfile> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.user.user}`;

  const requestBody: PatchUserRequest = { user };

  const response = await axios.patch<PatchUserResponse>(requestUrl, requestBody, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.user;
};
