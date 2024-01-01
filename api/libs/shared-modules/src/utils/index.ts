import { MessagePayload } from '../common';
import { TUSER_EVENTS } from '../common/events';
import {
  TUserMessagePayloadParams,
  TResponsePayloadParams,
} from '../common/models/message-payload.types';

export const createMessagePayload = (
  event: TUSER_EVENTS,
  params?: TUserMessagePayloadParams,
  response?: TResponsePayloadParams,
  error?: any,
): MessagePayload => {
  return new MessagePayload(event, params, response, error);
};
