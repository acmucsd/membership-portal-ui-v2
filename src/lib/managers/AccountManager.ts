/* eslint-disable import/prefer-default-export */
import { UserAPI } from '@/lib/api';
import { CookieService } from '@/lib/services';
import { AuthAPIHandlerProps } from '@/lib/types';
import type { PrivateProfile } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';

/**
 * Handle request to get current user's full profile
 * @param data Request paramaters object
 * @returns Full user profile
 */
export const getCurrentUser = async (
  data: AuthAPIHandlerProps
): Promise<PrivateProfile | undefined> => {
  const { token, onSuccessCallback, onFailCallback } = data;

  try {
    const user: PrivateProfile = await UserAPI.getCurrentUser(token);
    CookieService.setClientCookie(CookieType.USER, JSON.stringify(user));

    onSuccessCallback?.(user);
    return user;
  } catch (e: any) {
    onFailCallback?.(e.response.data.error);
    return undefined;
  }
};
