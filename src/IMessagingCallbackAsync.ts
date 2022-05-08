import { IMessagingMessage } from './IMessagingMessage'
import { IMessagingMessageName } from './IMessagingMessageName'

export interface IMessagingCallbackAsync {
  messageName(): IMessagingMessageName
  executeAsync(messageReceived: IMessagingMessage): Promise<IMessagingMessage>
}
