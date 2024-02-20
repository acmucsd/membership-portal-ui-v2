export type URL = string;
export type UUID = string;
export type FillInLater = any;

export type APIHandlerProps<T> = {
  onSuccessCallback?: (data: T) => void;
  onFailCallback?: (error: unknown) => void;
};

export interface AuthAPIHandlerProps<T> extends APIHandlerProps<T> {
  token: string;
}
