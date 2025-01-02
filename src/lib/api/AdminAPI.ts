import { config } from '@/lib';
import { Bonus, Milestone, SubmitAttendanceForUsersRequest } from '@/lib/types/apiRequests';
import { UUID } from '@/lib/types';
import {
  CreateBonusResponse,
  GetAllNamesAndEmailsResponse,
  SubmitAttendanceForUsersResponse,
  type ModifyUserAccessLevelResponse,
  type PrivateProfile,
  type NameAndEmail,
  CreateMilestoneResponse,
} from '@/lib/types/apiResponses';
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

/**
 * Get all users emails
 */
export const getAllUserEmails = async (token: string): Promise<NameAndEmail[]> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.admin.emails}`;

  const response = await axios.get<GetAllNamesAndEmailsResponse>(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.namesAndEmails;
};

/**
 * Retroactively add bonus points
 * @param token Bearer token
 * @param users Users that the bonus is going to
 * @param description Description for the bonus
 * @param points Number of points awarded
 * @returns Updated users
 */
export const addBonus = async (
  token: string,
  users: string[],
  description: string,
  points: number
): Promise<CreateBonusResponse> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.admin.bonus}`;
  const bonus: Bonus = { users: users, description: description, points: points };
  const response = await axios.post<CreateBonusResponse>(
    requestUrl,
    { bonus: bonus },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

/**
 * Retroactively add attendance points
 * @param token Bearer token
 * @param users List of users
 * @param event Event for whcih attendance is added
 * @param points Number of points awarded
 */
export const addAttendance = async (
  token: string,
  users: string[],
  event: UUID
): Promise<SubmitAttendanceForUsersResponse> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.admin.attendance}`;
  const attendance: SubmitAttendanceForUsersRequest = {
    users: users,
    event: event,
  };

  const response = await axios.post<SubmitAttendanceForUsersResponse>(requestUrl, attendance, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createMilestone = async (
  token: string,
  name: string,
  points: number
): Promise<CreateMilestoneResponse> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.admin.milestone}`;
  const milestone: Milestone = {
    name: name,
    points: points,
  };

  const response = await axios.post<CreateMilestoneResponse>(
    requestUrl,
    { milestone },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
