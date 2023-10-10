/* eslint-disable import/prefer-default-export */
import { config } from '@/lib';
import { SlidingLeaderboardQueryParams } from '@/lib/types/apiRequests';
import { GetLeaderboardResponse, PublicProfile } from '@/lib/types/apiResponses';
import axios from 'axios';

/**
 * @param params The default `limit` (in `params`) is 100. Set `limit` to 0 for
 * no limit.
 */
export const getLeaderboard = async (
  token: string,
  params: SlidingLeaderboardQueryParams = {}
): Promise<PublicProfile[]> => {
  const requestUrl = `${config.api.baseUrl}${
    config.api.endpoints.leaderboard
  }?${new URLSearchParams(Object.entries(params))}`;

  const response = await axios.get<GetLeaderboardResponse>(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.leaderboard;
};
