import browser from 'webextension-polyfill'
import { MessagingMessageNameClearLocalStorage } from './MessagingMessageNameClearLocalStorage'
import { IMessagingMessage, MessagingMessage } from '@kabeleced/webext-messaging'
import { IMessagingMessageName } from '@kabeleced/webext-messaging'
import { IMessagingCallbackAsync } from '@kabeleced/webext-messaging'

export class MessagingCallbackClearLocalStorage implements IMessagingCallbackAsync {
  constructor() {}

  public messageName(): IMessagingMessageName {
    return new MessagingMessageNameClearLocalStorage()
  }
  public executeAsync(messageReceived: IMessagingMessage): Promise<IMessagingMessage> {
    return new Promise((resolve) => {
      console.log(
        `Callback ${this.messageName().name} received message: ${JSON.stringify(messageReceived)}`,
      )
      browser.storage.local.clear()
      const reply = new MessagingMessage(new MessagingMessageNameClearLocalStorage())
      console.log(
        `Callback ${this.messageName().name} reply with message: ${JSON.stringify(reply)}`,
      )
      resolve(reply)
    })
  }
}
