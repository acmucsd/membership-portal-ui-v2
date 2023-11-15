import { config } from '@/lib';
import type {
  EmailModificationRequest,
  LoginRequest,
  PasswordResetRequest,
  UserRegistration,
} from '@/lib/types/apiRequests';
import type {
  EmailModificationResponse,
  LoginResponse,
  PrivateProfile,
  RegistrationResponse,
  ResetPasswordResponse,
  SendPasswordResetEmailResponse,
  VerifyEmailResponse,
} from '@/lib/types/apiResponses';

import axios from 'axios';

/**
 * Make login request to fetch valid bearer token
 * @param data Post request body JSON (email, password)
 * @returns Bearer token on successful login
 */
export const login = async (data: LoginRequest): Promise<string> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.auth.login}`;

  const response = await axios.post<LoginResponse>(requestUrl, data);

  return response.data.token;
};

/**
 * Make a register request to create a new user
 * @param data UserRegistration info (email, name, major, etc.)
 * @returns PrivateProfile containing user information on successful creation
 */
export const register = async (user: UserRegistration): Promise<PrivateProfile> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.auth.register}`;

  const response = await axios.post<RegistrationResponse>(requestUrl, { user: user });

  return response.data.user;
};

/**
 * Send a password reset email request to the server for the given email
 * @param {string} email The email address to send the password reset email to
 */
export const sendPasswordResetEmail = async (email: string): Promise<void> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.auth.resetPassword}/${email}`;

  await axios.get<SendPasswordResetEmailResponse>(requestUrl);
};

/**
 * Verifies account email by access code to enable full account access
 * @param accessCode The access code provided to the user via the link on the email.
 */
export const verifyEmail = async (accessCode: string): Promise<void> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.auth.emailVerification}/${accessCode}`;

  await axios.post<VerifyEmailResponse>(requestUrl);
};

/**
 * Resets password for account by accessCode to new password provided
 * @param data Request data of the user object with new password and access code
 */
export const resetPassword = async (code: string, data: PasswordResetRequest): Promise<void> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.auth.resetPassword}/${code}`;

  await axios.post<ResetPasswordResponse>(requestUrl, data);
};

/**
 * Modifies account email
 * @param token Authorization bearer token
 * @param accessCode The new email
 */
export const modifyEmail = async (token: string, email: string): Promise<void> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.auth.emailModification}`;

  const requestBody: EmailModificationRequest = { email };

  await axios.post<EmailModificationResponse>(requestUrl, requestBody, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
