import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import type { OptionsType } from 'cookies-next/lib/types';

/**
 * Wrapper class to manage fetching of cookies both on a client's browser and in a server request object.
 *
 * If you use the incorrect form of the CRUD function, you will not get a proper response.
 *
 * Client side cookies will typically be used in functions that respond to user input
 *
 * Server side cookies will typically be used in functions that run server-side before the page is rendered
 */
export default class CookieService {
  public static getClientCookie(key: string): string {
    return getCookie(key) as string;
  }

  public static getServerCookie(key: string, options: OptionsType): string {
    return getCookie(key, options) as string;
  }

  public static setClientCookie(key: string, value: string): void {
    setCookie(key, value);
  }

  public static setServerCookie(key: string, value: string, options: OptionsType): void {
    setCookie(key, value, options);
  }

  public static deleteClientCookie(key: string): void {
    deleteCookie(key);
  }

  public static deleteServerCookie(key: string, options: OptionsType): void {
    deleteCookie(key, options);
  }
}
