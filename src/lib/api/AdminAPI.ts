import { config } from '@/lib';
import type { ModifyUserAccessLevelResponse, PrivateProfile } from '@/lib/types/apiResponses';
import axios from 'axios';

/**
 * Update current user's access level
 * @param token Authorization bearer token
 * @param user Email of the user whose access is being updated
 * @param accessType The user's updated access type
 * @returns The updated user profile
 */
export const manageUserAccess = async (
  token: string,
  user: string,
  accessType: string
): Promise<PrivateProfile[]> => {
  const accessUpdates = [{ user: user, accessType: accessType }];

  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.admin.access}`;

  const response = await axios.patch<ModifyUserAccessLevelResponse>(
    requestUrl,
    { accessUpdates: accessUpdates },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.updatedUsers;
};

export default manageUserAccess;
