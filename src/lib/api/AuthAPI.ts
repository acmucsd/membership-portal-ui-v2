import { config } from '@/lib';
import { LoginRequest, PasswordResetRequest, UserRegistration } from '@/lib/types/apiRequests';
import {
  LoginResponse,
  PrivateProfile,
  RegistrationResponse,
  ResetPasswordResponse,
  SendPasswordResetEmailResponse,
  VerifyEmailResponse,
} from '@/lib/types/apiResponses';

import axios from 'axios';

export default class AuthAPI {
  /**
   * Make login request to fetch valid bearer token
   * @param data Post request body JSON (email, password)
   * @returns Bearer token on successful login
   */
  static async login(data: LoginRequest): Promise<string> {
    const requestUrl = `${config.api.baseUrl}${config.api.endpoints.auth.login}`;

    const response = await axios.post<LoginResponse>(requestUrl, data);

    return response.data.token;
  }

  /**
   * Make a register request to create a new user
   * @param data UserRegistration info (email, name, major, etc.)
   * @returns PrivateProfile containing user information on successful creation
   */
  static async register(user: UserRegistration): Promise<PrivateProfile> {
    const requestUrl = `${config.api.baseUrl}${config.api.endpoints.auth.register}`;

    const response = await axios.post<RegistrationResponse>(requestUrl, { user: user });

    return response.data.user;
  }

  /**
   * Send a password reset email request to the server for the given email
   * @param {string} email The email address to send the password reset email to
   */
  static async sendPasswordResetEmail(email: string): Promise<void> {
    const requestUrl = `${config.api.baseUrl}${config.api.endpoints.auth.resetPassword}/${email}`;

    await axios.get<SendPasswordResetEmailResponse>(requestUrl);
  }

  /**
   * Verifies account email by access code to enable full account access
   * @param accessCode The access code provided to the user via the link on the email.
   */
  static async verifyEmail(accessCode: string): Promise<void> {
    const requestUrl = `${config.api.baseUrl}${config.api.endpoints.auth.emailVerification}/${accessCode}`;

    await axios.post<VerifyEmailResponse>(requestUrl);
  }

  /**
   * Resets password for account by accessCode to new password provided
   * @param data Request data of the user object with new password and access code
   */
  static async resetPassword(data: PasswordResetRequest): Promise<void> {
    const requestUrl = `${config.api.baseUrl}${config.api.endpoints.auth.resetPassword}/${data.user.code}`;

    await axios.post<ResetPasswordResponse>(requestUrl, data);
  }
}
