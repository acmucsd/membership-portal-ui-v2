export type URL = string;
export type UUID = string;
export type FillInLater = any;

/**
 * The API sends `Date` object as strings in the ISO 8601 format. You can turn
 * them back into dates using `new Date(date)`.
 */
export type Date = string;

export type APIHandlerProps<T> = {
  onSuccessCallback?: (data: T) => void;
  onFailCallback?: (error: unknown) => void;
};

export interface AuthAPIHandlerProps<T> extends APIHandlerProps<T> {
  token: string;
}
