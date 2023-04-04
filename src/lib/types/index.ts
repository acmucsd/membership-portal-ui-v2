/* eslint-disable no-unused-vars */
export type URL = string;
export type UUID = string;
export type FillInLater = any;

export type APIHandlerProps = {
  onSuccessCallback?: (data?: any) => void;
  onFailCallback?: (error: any) => void;
};

export interface AuthAPIHandlerProps extends APIHandlerProps {
  token: string;
}
