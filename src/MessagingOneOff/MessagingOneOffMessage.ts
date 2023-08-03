import browser from 'webextension-polyfill'
import IMessaging from '../Common/IMessaging'
import { CallbackOneOff } from '../Common/IMessagingCallback'

/**
 * Implementation of a connection-less messaging communication.
 *
 * Handle received "one-off" messages and reply once.
 *
 * Can be used by content and background scripts.
 */
export default class MessagingOneOffMessage<TReceive, TReply>
  implements IMessaging<CallbackOneOff<TReceive, TReply>>
{
  constructor() {}

  /**
   * This method calls given callback as soon as a message has been received.
   *
   * @param callback Called when a message is received. The parameter of this function are the
   *   received message and the sender. The return value - given as a Promise - is returned as a
   *   reply, once.
   */
  public handle(callback: CallbackOneOff<TReceive, TReply>): void {
    browser.runtime.onMessage.addListener(
      async (message: TReceive, sender: browser.Runtime.MessageSender): Promise<TReply> => {
        return callback(message, sender).catch((error) => {
          throw new Error(`Error when handling message in callback: ${error}`)
        })
      },
    )
  }
}
