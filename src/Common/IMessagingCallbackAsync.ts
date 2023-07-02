import { IMessagingMessageName } from './IMessagingMessageName'

export interface IMessagingCallbackAsync<TReceive, TReply> {
  messageName(): IMessagingMessageName
  executeAsync(messageReceived: TReceive): Promise<TReply>
}
