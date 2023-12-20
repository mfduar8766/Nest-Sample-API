import { TUsers } from './users.types';

export type TUserMessagePayloadParams = {
  user?: TUsers;
  users?: TUsers[];
  id?: string;
  _id?: string;
  idsToDelete?: string[];
};

export type TResponsePayloadResult =
  | 'success'
  | 'internalServerError'
  | 'notFound'
  | 'ResourceInUse';

export type TResponsePayloadParams = {
  result: TResponsePayloadResult;
  data: Record<string, any>;
};

export type TMessagePayload = {
  event: string;
  params?: TUserMessagePayloadParams;
  response?: TResponsePayloadParams;
};
