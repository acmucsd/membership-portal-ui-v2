import config from '@/lib/config';
import { GetCurrentUserResponse, PrivateProfile } from '@/lib/types/apiResponses';
import axios from 'axios';

// TODO: Add some middleware to handle
export default class UserAPI {
  /**
   * Get current user's private profile
   * @param token Bearer token
   * @returns User profile
   */
  static async getCurrentUser(token: string): Promise<PrivateProfile> {
    const requestUrl = `${config.acmApi.baseUrl}${config.acmApi.endpoints.user.user}`;

    const response = await axios.get<GetCurrentUserResponse>(requestUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.user;
  }
}
