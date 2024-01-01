import { TMessagePayload, TUSER_EVENTS } from '../events';
import {
  TResponsePayloadParams,
  TUserMessagePayloadParams,
} from '../models/message-payload.types';

export class MessagePayload implements TMessagePayload {
  constructor(
    public event: TUSER_EVENTS,
    public params?: TUserMessagePayloadParams,
    public response?: TResponsePayloadParams,
    public error?: any,
  ) {}
}
