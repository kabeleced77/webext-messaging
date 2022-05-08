import { MessagingMessageNameTimeNow } from './MessagingMessageNameTimeNow'
import { MessagingMessageWithContent } from './../../src/MessagingMessageWithContent'
import { IMessagingMessageWithContent } from '../../src/IMessagingMessageWithContent'
import { IMessagingMessage } from '@kabeleced/webext-messaging'
import { IMessagingMessageName } from '@kabeleced/webext-messaging'
import { IMessagingCallbackAsync } from '@kabeleced/webext-messaging'

export class MessagingCallbackTimeNow implements IMessagingCallbackAsync {
  constructor() {}

  public messageName(): IMessagingMessageName {
    return new MessagingMessageNameTimeNow()
  }
  public executeAsync(
    messageReceived: IMessagingMessage,
  ): Promise<IMessagingMessageWithContent<Date>> {
    return new Promise((resolve) => {
      console.log(
        `Callback ${this.messageName().name} received message: ${JSON.stringify(messageReceived)}`,
      )
      const reply = new MessagingMessageWithContent<Date>(this.messageName(), new Date())
      console.log(
        `Callback ${this.messageName().name} reply with message: ${JSON.stringify(reply)}`,
      )
      resolve(reply)
    })
  }
}
