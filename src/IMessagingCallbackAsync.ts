import { IMessagingMessageName } from './Common/IMessagingMessageName'

export interface IMessagingCallbackAsync<TReceive, TReply> {
  messageName(): IMessagingMessageName
  executeAsync(messageReceived: TReceive): Promise<TReply>
}
