import {
  TResponsePayloadParams,
  TUserMessagePayloadParams,
} from '../models/message-payload.types';

export type TMessagePayload = {
  event: TUSER_EVENTS;
  params?: TUserMessagePayloadParams;
  response?: TResponsePayloadParams;
  error?: any;
};

export enum USER_EVENTS {
  get_user = 'get_user',
  get_users = 'get_users',
  add_user = 'add_user',
  update_user = 'update_user',
  delete_user = 'delete_user',
  bulk_insert = 'bulk_insert',
  bulk_delete = 'bulk_delete',
}

export type TUSER_EVENTS =
  | 'get_user'
  | 'get_users'
  | 'add_user'
  | 'update_user'
  | 'delete_user'
  | 'bulk_insert'
  | 'bulk_delete';
