import {
  IMessagingMessage,
  IMessagingMessageWithContent,
  MessagingMessageWithContent,
} from '@kabeleced/webext-messaging'
import { IMessagingMessageName } from '@kabeleced/webext-messaging'
import { IMessagingCallbackAsync } from '@kabeleced/webext-messaging'
import { MessagingMessageNameTimeNow } from './MessagingMessageNameTimeNow'

export class MessagingCallbackTimeNow
  implements IMessagingCallbackAsync<IMessagingMessage, IMessagingMessageWithContent<Date>>
{
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
