import { IMessagingMessageName } from '@kabeleced/webext-messaging'

export class MessagingMessageNameClearLocalStorage implements IMessagingMessageName {
  constructor() {}

  public readonly name = 'clearLocalStorage'
}
