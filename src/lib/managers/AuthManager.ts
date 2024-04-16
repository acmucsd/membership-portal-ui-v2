import { AuthAPI, UserAPI } from '@/lib/api';
import { CookieService } from '@/lib/services';
import { APIHandlerProps } from '@/lib/types';
import type {
  LoginRequest,
  PasswordResetRequest,
  SendPasswordResetEmailRequest,
  UserRegistration,
} from '@/lib/types/apiRequests';
import { PrivateProfile } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';

/**
 * Handle login with user data, set cookies correctly, and provide callbacks
 * @param data Login form data
 */
export const login = async (
  data: LoginRequest & APIHandlerProps<PrivateProfile>
): Promise<void> => {
  const COOKIE_EXPIRATION_LENGTH = 60 * 60 * 24 * 14; // 60 * 60 * 24 * 14 is 2 weeks in seconds

  const { email, password, onSuccessCallback, onFailCallback } = data;

  try {
    const token = await AuthAPI.login({ email, password });
    CookieService.setClientCookie(CookieType.ACCESS_TOKEN, token, {
      maxAge: COOKIE_EXPIRATION_LENGTH,
    });

    const user = await UserAPI.getCurrentUser(token);
    CookieService.setClientCookie(CookieType.USER, JSON.stringify(user), { maxAge: 5 * 60 });

    onSuccessCallback?.(user);
  } catch (e) {
    onFailCallback?.(e);
  }
};

/**
 * Registers a new user account and provides callback
 * @param data
 */
export const register = async (
  data: UserRegistration & APIHandlerProps<PrivateProfile>
): Promise<void> => {
  const { onSuccessCallback, onFailCallback, ...userRegistration } = data;
  try {
    const user = await AuthAPI.register(userRegistration);
    onSuccessCallback?.(user);
  } catch (e) {
    onFailCallback?.(e);
  }
};

/**
 * Handle password reset request and provide callback
 * @param data Reset request data
 */
export const sendPasswordResetEmail = async (
  data: SendPasswordResetEmailRequest & APIHandlerProps<void>
): Promise<void> => {
  const { email, onSuccessCallback, onFailCallback } = data;

  try {
    await AuthAPI.sendPasswordResetEmail(email);
    onSuccessCallback?.();
  } catch (e) {
    onFailCallback?.(e);
  }
};

/**
 * Resets the account's password to the given value and provides callback
 * @param dataasync
 */
export const resetPassword = async (
  data: PasswordResetRequest & APIHandlerProps<void> & { code: string }
): Promise<void> => {
  const { code, user, onSuccessCallback, onFailCallback } = data;

  try {
    await AuthAPI.resetPassword(code, { user });
    onSuccessCallback?.();
  } catch (e) {
    onFailCallback?.(e);
  }
};
