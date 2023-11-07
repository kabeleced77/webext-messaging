import browser from 'webextension-polyfill'
import { IMessagingMessageName } from '../Common/IMessagingMessageName'

/**
 * Interface describing a pattern where a callback is only executed when the messaging-message's
 * name matches the message-name of a "registered" callback.
 */
export interface IOneOffMessagingCallback<TReceive, TReply> {
  /**
   * Method returns the name of the message the callback can handle.
   *
   * @returns The name of the message
   */
  messageName(): IMessagingMessageName
  /**
   * Method, which actually handles the received message.
   *
   * @param message - The received message
   * @param sender - Option. Information about the sender of the message
   * @returns An optional reply as Promise
   */
  execute(message: TReceive, sender?: browser.Runtime.MessageSender): Promise<TReply>
}
