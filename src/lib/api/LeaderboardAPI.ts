/* eslint-disable import/prefer-default-export */
import { config } from '@/lib';
import { GetLeaderboardResponse, PublicProfile } from '@/lib/types/apiResponses';
import axios from 'axios';

export const getLeaderboard = async (token: string): Promise<PublicProfile[]> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.leaderboard}`;

  const response = await axios.get<GetLeaderboardResponse>(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.leaderboard;
};
