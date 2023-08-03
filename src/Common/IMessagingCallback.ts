import browser from 'webextension-polyfill'
import { IMessagingMessageName } from './IMessagingMessageName'

/**
 * Type describes the callback signature handling a one-off message with an async reply.
 *
 * @param message The received message to be handled by the callback.
 * @param sender Optional. Sender information.
 */
export type CallbackOneOff<TReceive, TReply> = (
  message: TReceive,
  sender?: browser.Runtime.MessageSender,
) => Promise<TReply>

/**
 * Type describes the callback signature handling connection-based messaging. The connection is
 * based on the port.
 *
 * @param port The actual "connection". Receiving actual messages a handler must be registered using
 *   port.onMessage.addListener().
 */
export type CallbackOnConnect = (port: browser.Runtime.Port) => void

/**
 * Interface describing a pattern where a callback is only executed when the messaging-message's
 * name matches the "registered" message-name of this callback. Callback's signature needs to be
 * provided. With this module some examples are provided as predefined types.
 */
export interface IMessagingCallback<TCallback> {
  /** Method returns the name of the message the callback is "responsible" for. */
  messageName(): IMessagingMessageName
  /** Method actually handling the messaging-message. */
  execute: TCallback
}
