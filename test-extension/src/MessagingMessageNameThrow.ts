import { IMessagingMessageName } from '@kabeleced/webext-messaging'

export class MessagingMessageNameThrow implements IMessagingMessageName {
  constructor() {}

  public readonly name = 'throwException'
}
