import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import type { OptionsType } from 'cookies-next/lib/types';

/**
 * Wrapper functions to manage fetching of cookies both on a client's browser and in a server request object.
 *
 * If you use the incorrect form of the CRUD function, you will not get a proper response.
 *
 * Client side cookies will typically be used in functions that respond to user input
 *
 * Server side cookies will typically be used in functions that run server-side before the page is rendered
 */
export const getClientCookie = (key: string): string => {
  return getCookie(key) as string;
};

export const getServerCookie = (key: string, options: OptionsType): string => {
  return getCookie(key, options) as string;
};

export const setClientCookie = (key: string, value: string, options?: OptionsType): void => {
  setCookie(key, value, options);
};

export const setServerCookie = (key: string, value: string, options: OptionsType): void => {
  setCookie(key, value, options);
};

export const deleteClientCookie = (key: string): void => {
  deleteCookie(key);
};

export const deleteServerCookie = (key: string, options: OptionsType): void => {
  deleteCookie(key, options);
};
