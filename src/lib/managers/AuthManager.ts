import { AuthAPI, UserAPI } from '@/lib/api';
import { CookieService } from '@/lib/services';
import { APIHandlerProps } from '@/lib/types';
import { LoginRequest, SendPasswordResetEmailRequest } from '@/lib/types/apiRequests';
import { CookieType } from '@/lib/types/enums';

export default class AuthManager {
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

  static async sendPasswordResetEmailRequest(
    data: SendPasswordResetEmailRequest & APIHandlerProps
  ): Promise<void> {
    const { email, onSuccessCallback, onFailCallback } = data;

    try {
      await AuthAPI.sendPasswordResetEmailRequest(email);
      onSuccessCallback?.();
    } catch (e: any) {
      onFailCallback?.(e.response.data.error);
    }
  }
}
