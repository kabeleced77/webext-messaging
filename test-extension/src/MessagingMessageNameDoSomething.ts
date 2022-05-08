import { IMessagingMessageName } from '@kabeleced/webext-messaging'

export class MessagingMessageNameDoSomething implements IMessagingMessageName {
  constructor() {}

  public readonly name = 'doSomething'
}
