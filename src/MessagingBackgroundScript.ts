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
        if (message === undefined) throw new Error('Error: received message is undefined.')
        if (message.name === undefined)
          throw new Error("Error: received message does not implemented property 'name'.")
        if (message.name.name === undefined)
          throw new Error("Error: received message does not implemented property 'name.name'.")
        this.callbacks
          .filter((callback) => callback.executeAsync)
          .filter((callback) => callback.messageName && callback.messageName()?.name)
          .filter((callback) => callback.messageName().name.match(message.name.name))
          .forEach(async (callbackByMessageName) => {
            const reply = await callbackByMessageName.executeAsync(message).catch((err) => {
              console.warn(`Error in callback for message name '${message.name.name}': ${err}`)
            })
            if (reply) {
              port.postMessage(reply)
            }
          })
      })
    })
  }
}
