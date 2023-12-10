import { TUsers } from './users.types';

export type TUserMessagePayloadParams = {
  user?: TUsers;
  users?: TUsers[];
  id?: string;
  _id?: string;
  idsToDelete?: string[];
};

export type TMessagePayload = {
  event: string;
  params?: TUserMessagePayloadParams;
  response?: Record<string, any>;
};
