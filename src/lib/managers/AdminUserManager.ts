import { AdminAPI } from '@/lib/api';
import { CookieService } from '@/lib/services';
import { APIHandlerProps } from '@/lib/types';
import { UserAccessUpdates } from '@/lib/types/apiRequests';
import { CookieType } from '@/lib/types/enums';

const manageUserAccess = async (data: UserAccessUpdates & APIHandlerProps) => {
  const { user, accessType, onSuccessCallback, onFailCallback } = data;

  try {
    const token = CookieService.getClientCookie(CookieType.ACCESS_TOKEN);
    const updatedUsers = await AdminAPI.manageUserAccess(token, user, accessType);
    onSuccessCallback?.(updatedUsers);
  } catch (e: any) {
    onFailCallback?.(e.response.data.error);
  }
};

export default manageUserAccess;
