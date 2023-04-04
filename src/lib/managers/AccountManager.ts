import UserAPI from '@/lib/api/UserAPI';
import CookieService from '@/lib/services/CookieService';
import { AuthAPIHandlerProps } from '@/lib/types';
import { PrivateProfile } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';

export default class AccountManager {
  static async getCurrentUser(data: AuthAPIHandlerProps): Promise<PrivateProfile | undefined> {
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
  }
}
