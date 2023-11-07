import { IMessagingMessage } from './IMessagingMessage'
import { IMessagingMessageName } from './IMessagingMessageName'

/** Implementation of a messaging message containing the name. */
export class MessagingMessage implements IMessagingMessage {
  /** @property name - Identifier of the message */
  constructor(public readonly name: IMessagingMessageName) {}
}
