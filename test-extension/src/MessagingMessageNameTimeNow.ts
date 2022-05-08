import { IMessagingMessageName } from '@kabeleced/webext-messaging'

export class MessagingMessageNameTimeNow implements IMessagingMessageName {
  constructor() {}

  public readonly name = 'timeNow'
}
