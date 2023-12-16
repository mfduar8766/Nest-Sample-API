import {
  TMessagePayload,
  TUserMessagePayloadParams,
} from '../models/message-payload.types';

export class MessagePayload implements TMessagePayload {
  constructor(
    public event: string,
    public params?: TUserMessagePayloadParams,
    public response?: Record<string, any>,
    public error?: any,
  ) {}
}
