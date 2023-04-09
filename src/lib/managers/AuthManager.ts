import { AuthAPI, UserAPI } from '@/lib/api';
import { CookieService } from '@/lib/services';
import { APIHandlerProps } from '@/lib/types';
import type {
  LoginRequest,
  PasswordResetRequest,
  SendPasswordResetEmailRequest,
  UserRegistration,
} from '@/lib/types/apiRequests';
import { CookieType } from '@/lib/types/enums';

/**
 * Handle login with user data, set cookies correctly, and provide callbacks
 * @param data Login form data
 */
export const login = async (data: LoginRequest & APIHandlerProps): Promise<void> => {
  const { email, password, onSuccessCallback, onFailCallback } = data;

  try {
    const token = await AuthAPI.login({ email, password });
    CookieService.setClientCookie(CookieType.ACCESS_TOKEN, token);

    const user = await UserAPI.getCurrentUser(token);
    CookieService.setClientCookie(CookieType.USER, JSON.stringify(user));

    onSuccessCallback?.(user);
  } catch (e: any) {
    onFailCallback?.(e.response.data.error);
  }
};

/**
 * Registers a new user account and provides callback
 * @param data
 */
export const register = async (data: UserRegistration & APIHandlerProps): Promise<void> => {
  const { onSuccessCallback, onFailCallback, ...userRegistration } = data;
  try {
    const user = await AuthAPI.register(userRegistration);
    onSuccessCallback?.(user);
  } catch (e: any) {
    onFailCallback?.(e.response.data.error);
  }
};

/**
 * Handle password reset request and provide callback
 * @param data Reset request data
 */
export const sendPasswordResetEmail = async (
  data: SendPasswordResetEmailRequest & APIHandlerProps
): Promise<void> => {
  const { email, onSuccessCallback, onFailCallback } = data;

  try {
    await AuthAPI.sendPasswordResetEmail(email);
    onSuccessCallback?.();
  } catch (e: any) {
    onFailCallback?.(e.response.data.error);
  }
};

/**
 * Resets the account's password to the given value and provides callback
 * @param dataasync
 */
export const resetPassword = async (
  data: PasswordResetRequest & APIHandlerProps
): Promise<void> => {
  const { user, onSuccessCallback, onFailCallback } = data;

  try {
    await AuthAPI.resetPassword({ user });
    onSuccessCallback?.();
  } catch (e: any) {
    onFailCallback?.(e.response.data.error);
  }
};
