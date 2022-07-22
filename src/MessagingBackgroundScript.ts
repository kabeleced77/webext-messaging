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
        this.callbacks
          .filter((callback) => callback.messageName().name.match(message.name.name))
          .forEach(async (callbackByMessageName) => {
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
