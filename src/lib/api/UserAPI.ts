import { config } from '@/lib';
import { CookieService } from '@/lib/services';
import type { UUID } from '@/lib/types';
import {
  InsertUserSocialMediaRequest,
  PatchUserRequest,
  SocialMedia,
  SocialMediaPatches,
  UpdateUserSocialMediaRequest,
  UserPatches,
} from '@/lib/types/apiRequests';
import type {
  GetAttendancesForUserResponse,
  GetCurrentUserResponse,
  GetUserResponse,
  InsertSocialMediaResponse,
  PatchUserResponse,
  PrivateProfile,
  PublicAttendance,
  PublicProfile,
  PublicUserSocialMedia,
  UpdateProfilePictureResponse,
  UpdateSocialMediaResponse,
} from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import axios from 'axios';
import { OptionsType } from 'cookies-next/lib/types';

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

export const getCurrentUserAndRefresh = async (
  token: string,
  options: OptionsType
): Promise<PrivateProfile> => {
  const userCookie = CookieService.getServerCookie(CookieType.USER, options);
  if (userCookie) return JSON.parse(userCookie);

  const user: PrivateProfile = await getCurrentUser(token);

  const { req, res } = options;
  CookieService.setServerCookie(CookieType.USER, JSON.stringify(user), {
    req,
    res,
    maxAge: 5 * 60,
  });

  return user;
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
export const updateCurrentUserProfile = async (
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

/**
 * Create a new social media URL
 * @param token Authorization bearer token
 * @param socialMedia The URL and social media platform to add
 * @returns The social media entry that was inserted
 */
export const insertSocialMedia = async (
  token: string,
  socialMedia: SocialMedia
): Promise<PublicUserSocialMedia> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.user.socialMedia}`;

  const requestBody: InsertUserSocialMediaRequest = { socialMedia };

  const response = await axios.post<InsertSocialMediaResponse>(requestUrl, requestBody, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.userSocialMedia;
};

/**
 * Update a social media URL
 * @param token Authorization bearer token
 * @param uuid The ID of the social media entry
 * @param socialMedia The new URL
 * @returns The social media entry that was updated
 */
export const updateSocialMedia = async (
  token: string,
  uuid: UUID,
  socialMedia: SocialMediaPatches
): Promise<PublicUserSocialMedia> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.user.socialMedia}/${uuid}`;

  const requestBody: UpdateUserSocialMediaRequest = { socialMedia };

  const response = await axios.patch<UpdateSocialMediaResponse>(requestUrl, requestBody, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.userSocialMedia;
};

/**
 * Delete a social media URL
 * @param token Authorization bearer token
 * @param uuid The ID of the social media entry
 */
export const deleteSocialMedia = async (token: string, uuid: UUID): Promise<void> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.user.socialMedia}/${uuid}`;

  await axios.delete(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAttendancesForCurrentUser = async (token: string): Promise<PublicAttendance[]> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.attendance.attendance}`;

  const response = await axios.get<GetAttendancesForUserResponse>(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.attendances;
};

export const getAttendancesForUserByUUID = async (
  token: string,
  uuid: UUID
): Promise<PublicAttendance[]> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.attendance.forUserByUUID}/${uuid}`;

  const response = await axios.get<GetAttendancesForUserResponse>(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.attendances;
};

export const getPublicUserProfileByUUID = async (
  token: string,
  uuid: UUID
): Promise<PublicProfile> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.user.user}/${uuid}`;

  const response = await axios.get<GetUserResponse>(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.user;
};
