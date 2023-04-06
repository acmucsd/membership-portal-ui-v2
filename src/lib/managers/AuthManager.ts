import { AuthAPI, UserAPI } from '@/lib/api';
import { CookieService } from '@/lib/services';
import { APIHandlerProps } from '@/lib/types';
import {
  LoginRequest,
  SendPasswordResetEmailRequest,
  UserRegistration,
} from '@/lib/types/apiRequests';
import { CookieType } from '@/lib/types/enums';

export default class AuthManager {
  /**
   * Handle login with user data, set cookies correctly, and provide callbacks
   * @param data Login form data
   */
  static async login(data: LoginRequest & APIHandlerProps): Promise<void> {
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
  }

  static async register(data: UserRegistration & APIHandlerProps): Promise<void> {
    const { onSuccessCallback, onFailCallback, ...userRegistration } = data;
    try {
      const user = await AuthAPI.register(userRegistration);
      onSuccessCallback?.(user);
    } catch (e: any) {
      onFailCallback?.(e.response.data.error);
    }
  }

  /**
   * Handle password reset request and provide callback
   * @param data Reset request data
   */
  static async sendPasswordResetEmail(
    data: SendPasswordResetEmailRequest & APIHandlerProps
  ): Promise<void> {
    const { email, onSuccessCallback, onFailCallback } = data;

    try {
      await AuthAPI.sendPasswordResetEmail(email);
      onSuccessCallback?.();
    } catch (e: any) {
      onFailCallback?.(e.response.data.error);
    }
  }
}
