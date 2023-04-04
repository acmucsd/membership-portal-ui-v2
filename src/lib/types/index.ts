/* eslint-disable no-unused-vars */
export type Url = string;
export type Uuid = string;
export type FillInLater = any;

export type UuidQuery = {
  uuid: Uuid;
};

export type APIHandlerProps = {
  onSuccessCallback?: (data?: any) => void;
  onFailCallback?: (error: any) => void;
};

export interface AuthAPIHandlerProps extends APIHandlerProps {
  token: string;
}
