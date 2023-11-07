import browser from 'webextension-polyfill'
import { IMessagingMessage, IOneOffMessagingCallback } from '@kabeleced/webext-messaging'
import { IMessagingMessageName } from '@kabeleced/webext-messaging'
import { MessagingMessageNameClearLocalStorage } from './MessagingMessageNameClearLocalStorage'

export class MessagingCallbackClearLocalStorage
  implements IOneOffMessagingCallback<IMessagingMessage, void>
{
  constructor() {}

  public messageName(): IMessagingMessageName {
    return new MessagingMessageNameClearLocalStorage()
  }
  public async execute(messageReceived: IMessagingMessage): Promise<void> {
    console.log(
      `Callback ${this.messageName().name} received message: ${JSON.stringify(messageReceived)}`,
    )
    browser.storage.local.clear()
  }
}
