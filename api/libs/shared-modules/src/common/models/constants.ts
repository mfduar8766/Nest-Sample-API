export const APP_GUARD = 'APP_GUARD';
export enum ENV {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
}

export type TQueueNames = 'users_queue' | 'auth_queue';

type TQueues = {
  USERS_QUEUE: TQueueNames;
};

export const QUEUES: TQueues = {
  USERS_QUEUE: 'users_queue',
};
