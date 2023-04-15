import browser from 'webextension-polyfill'
import { IMessagingMessage } from '@kabeleced/webext-messaging'
import { IMessagingMessageName } from '@kabeleced/webext-messaging'
import { IMessagingCallbackAsync } from '@kabeleced/webext-messaging'
import { MessagingMessageNameClearLocalStorage } from './MessagingMessageNameClearLocalStorage'

export class MessagingCallbackClearLocalStorage
  implements IMessagingCallbackAsync<IMessagingMessage, void>
{
  constructor() {}

  public messageName(): IMessagingMessageName {
    return new MessagingMessageNameClearLocalStorage()
  }
  public async executeAsync(messageReceived: IMessagingMessage): Promise<void> {
    console.log(
      `Callback ${this.messageName().name} received message: ${JSON.stringify(messageReceived)}`,
    )
    browser.storage.local.clear()
  }
}
