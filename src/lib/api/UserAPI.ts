import config from '@/lib/config';
import { GetCurrentUserResponse, PrivateProfile } from '@/lib/types/apiResponses';
import axios from 'axios';

export default class UserAPI {
  /**
   * Get current user's private profile
   * @param token Authorization bearer token
   * @returns User's full profile
   */
  static async getCurrentUser(token: string): Promise<PrivateProfile> {
    const requestUrl = `${config.api.baseUrl}${config.api.endpoints.user.user}`;

    const response = await axios.get<GetCurrentUserResponse>(requestUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.user;
  }
}
