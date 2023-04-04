import { config } from '@/lib';
import { LoginRequest } from '@/lib/types/apiRequests';
import { LoginResponse, SendPasswordResetEmailResponse } from '@/lib/types/apiResponses';

import axios from 'axios';

export default class AuthAPI {
  /**
   * Make login request to fetch valid bearer token
   * @param data Post request body JSON (email, password)
   * @returns Bearer token on successful login
   */
  static async login(data: LoginRequest): Promise<string> {
    const requestUrl = `${config.acmApi.baseUrl}${config.acmApi.endpoints.auth.login}`;

    const response = await axios.post<LoginResponse>(requestUrl, data);

    return response.data.token;
  }

  /**
   * Send a password reset email request to the server for the given email
   * @param {string} email The email address to send the password reset email to
   * @returns {Promise<void>} Promise that resolves with no value on successful completion
   * @throws {Error} If the request to the server fails or returns an error response
   */
  static async sendPasswordResetEmailRequest(email: string): Promise<void> {
    const requestUrl = `${config.acmApi.baseUrl}${config.acmApi.endpoints.auth.resetPassword}/${email}`;

    await axios.get<SendPasswordResetEmailResponse>(requestUrl);
  }
}
