import browser from 'webextension-polyfill'
import IMessaging from '../Common/IMessaging'
import { IMessagingMessage } from '../Common/IMessagingMessage'
import { IOneOffMessagingCallback } from './IOneOffMessagingCallback'

/**
 * Handle received messages through a list of given "message-handler". Each handler needs to
 * "registered" for a certain message via the message name. The handler is executed as soon as a
 * message is received and the message name matches.
 *
 * Can be used in content and background scripts.
 *
 * Remark: only one callback per message name. If more than one callback is registered for a message
 * the first one is called only.
 */
export class OneOffMessagingWithCallbacks implements IMessaging<void> {
  /**
   * @param callbacks Array of callbacks handling certain messages based on property
   *   IMessagingMessage.IMessageName.
   */
  constructor(
    private readonly callbacks: IOneOffMessagingCallback<
      IMessagingMessage,
      IMessagingMessage | void
    >[],
  ) {}

  /**
   * Starts the event handler listening for sent messages. As son as a message is received the
   * callback is executed whose message name fits the name of the received message.
   *
   * An optional reply from the callback is send back to the sender as a Promise.
   *
   * @returns Nothing
   */
  public handle(): void {
    browser.runtime.onMessage.addListener(
      (
        message: IMessagingMessage,
        sender: browser.Runtime.MessageSender,
      ): Promise<void | IMessagingMessage> => {
        if (message === undefined) throw new Error('message undefined.')
        if (message.name === undefined) throw new Error("message does not have property 'name'.")
        if (message.name.name === undefined)
          throw new Error("message does not have property 'name.name'.")
        return (
          this.callbacks
            .filter((callback) => callback.execute)
            .filter((callback) => callback.messageName && callback.messageName()?.name)
            .find((callback) => callback.messageName().name.match(message.name.name))
            ?.execute(message, sender)
            .catch((err) => {
              console.error(`Error in callback for message name '${message.name.name}': ${err}`)
            }) ??
          new Promise<void>((resolve) => {
            console.warn(`Received message was not handled: ${JSON.stringify(message)}`)
            resolve()
          })
        )
      },
    )
  }
}
