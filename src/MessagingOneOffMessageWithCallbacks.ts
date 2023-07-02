import browser from 'webextension-polyfill'
import { IMessagingCallbackAsync } from './IMessagingCallbackAsync'
import { IMessagingMessage } from './Common/IMessagingMessage'
import { IMessagingOneOffMessage } from './IMessagingOneOffMessage'

/**
 * Handle received messages through "message-handler". Each handler is called as soon as a message, it registered for, has been received.
 *
 * Can used by content and background scripts.
 *
 * Remark: only one callback per message is supported. If there are more callbacks for one message registered only first one is called.
 */
export class MessagingOneOffMessageWithCallbacks {
  /**
   *
   * @param onMessagingMessage Messaging implementation actually used to receive message from.
   * @param callbacks Array of callbacks providing message handler for certain messages.
   */
  constructor(
    private readonly onMessagingMessage: IMessagingOneOffMessage<
      IMessagingMessage,
      IMessagingMessage,
      browser.Runtime.MessageSender
    >,
    private readonly callbacks: IMessagingCallbackAsync<IMessagingMessage, IMessagingMessage>[],
  ) {}

  /**
   * Starts the event handler listening for sent messages.
   */
  public onMessage(): void {
    this.onMessagingMessage.onMessage(this.handleMessage)
  }

  /**
   * Private method actually filtering the array of callback in order to call the handler for the received message.
   * @param message Receive message
   * @returns A Promise with the reply of the message handler.
   */
  private handleMessage(message: IMessagingMessage): Promise<IMessagingMessage | void> {
    if (message === undefined) throw new Error('Error: received message is undefined.')
    if (message.name === undefined)
      throw new Error("Error: received message does not implemented property 'name'.")
    if (message.name.name === undefined)
      throw new Error("Error: received message does not implemented property 'name.name'.")
    return (
      this.callbacks
        .filter((callback) => callback.executeAsync)
        .filter((callback) => callback.messageName && callback.messageName()?.name)
        .find((callback) => callback.messageName().name.match(message.name.name))
        ?.executeAsync(message)
        .catch((err) => {
          console.warn(`Error in callback for message name '${message.name.name}': ${err}`)
        }) ?? new Promise<void>((r) => r)
    )
  }
}
