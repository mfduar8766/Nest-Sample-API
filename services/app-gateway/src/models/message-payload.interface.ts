export interface IMessagePayload {
  event: string;
  params?: Record<string, any>;
  response?: Record<string, any>;
  error?: any;
}
