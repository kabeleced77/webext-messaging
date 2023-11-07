import { IMessagingMessageName } from '@kabeleced/webext-messaging'

export class MessagingMessageNameWait implements IMessagingMessageName {
  constructor() {}

  public readonly name = 'wait'
}
