import { IMessagingMessage } from './IMessagingMessage'
import { IMessagingMessageName } from './IMessagingMessageName'

export class MessagingMessage implements IMessagingMessage {
  constructor(public readonly name: IMessagingMessageName) {}
}
