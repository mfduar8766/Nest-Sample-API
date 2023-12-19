export type TSevices = {
  USER_SERVICE: 'USER_SERVICE';
  AUTH_SERVICE: 'AUTH_SERVICE';
};

export const APP_GUARD = 'APP_GUARD';
export const USER_SERVICE = 'USER_SERVICE';
export enum ENV {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
}

export type TQueueNames = 'users_queue' | 'auth_queue';

export const QUEUES = {
  users_queue: 'users_queue',
};

export const SERVICES: TSevices = {
  USER_SERVICE: 'USER_SERVICE',
  AUTH_SERVICE: 'AUTH_SERVICE',
};
