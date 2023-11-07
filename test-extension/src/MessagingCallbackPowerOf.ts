import {
  IOneOffMessagingCallback,
  IMessagingMessageName,
  IMessagingMessageWithContent,
  MessagingMessageWithContent,
} from '@kabeleced/webext-messaging'
import { MessagingMessageNamePowerOf } from './MessagingMessageNamePowerOf'
import { IMessagingMessageContentPowerOf } from './IMessagingMessageContentPowerOf'

export class MessagingCallbackPowerOf
  implements
    IOneOffMessagingCallback<
      IMessagingMessageWithContent<IMessagingMessageContentPowerOf>,
      IMessagingMessageWithContent<number>
    >
{
  constructor() {}

  public messageName(): IMessagingMessageName {
    return new MessagingMessageNamePowerOf()
  }
  public execute(
    messageReceived: IMessagingMessageWithContent<IMessagingMessageContentPowerOf>,
  ): Promise<IMessagingMessageWithContent<number>> {
    return new Promise((resolve) => {
      console.log(
        `Callback ${this.messageName().name} received message: ${JSON.stringify(messageReceived)}`,
      )
      const reply = new MessagingMessageWithContent<number>(
        this.messageName(),
        Math.pow(messageReceived.content.base, messageReceived.content.exponent),
      )
      console.log(
        `Callback ${this.messageName().name} reply with message: ${JSON.stringify(reply)}`,
      )
      resolve(reply)
    })
  }
}
