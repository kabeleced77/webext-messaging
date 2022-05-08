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
      port.onMessage.addListener((message: IMessagingMessage) => {
        this.callbacks
          .filter((callback) => callback.messageName().name.match(message.name.name))
          .forEach(async (handler) => {
            const reply = await handler.executeAsync(message)
            if (reply !== undefined) {
              port.postMessage(reply)
            }
          })
      })
    })
  }
}
