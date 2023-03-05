import { IMessagingMessageName } from './IMessagingMessageName'
import browser from 'webextension-polyfill'
import { IMessagingCallbackAsync } from './IMessagingCallbackAsync'
import { IMessagingOnConnect } from './IMessagingOnConnect'
import { IMessagingMessage } from './IMessagingMessage'

/**
 * Handle received messages by message name and registered message handler
 */
export class MessagingBackgroundScript implements IMessagingOnConnect {
  constructor(private readonly callbacks: IMessagingCallbackAsync[]) {}

  public connect(): void {
    browser.runtime.onConnect.addListener((port: browser.Runtime.Port) => {
      port.onMessage.addListener((message: IMessagingMessage): void => {
        if (message?.name?.name === undefined)
          throw new Error('Error: received message did not implement interface correctly.')
        console.info(
          `onMessage: received message: name: ${message.name.name}, object: ${JSON.stringify(
            message,
          )}`,
        )
        this.callbacks
          .filter((callback) => callback.messageName && callback.messageName()?.name)
          .filter((callback) => callback.messageName().name.match(message.name.name))
          .forEach(async (callbackByMessageName) => {
            // check if the callback actually implemented a method handling the received message
            if (callbackByMessageName.executeAsync) {
              const reply = await callbackByMessageName.executeAsync(message)
              if (reply) {
                port.postMessage(reply)
              }
            }
          })
      })
    })
  }
}
