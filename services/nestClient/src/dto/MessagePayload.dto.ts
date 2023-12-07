import { IMessagePayload } from '../models/message-payload.interface';

export class MessagePayload implements IMessagePayload {
  constructor(
    public event: string,
    public params?: Record<string, any>,
    public response?: Record<string, any>,
    public error?: any,
  ) {}
}
