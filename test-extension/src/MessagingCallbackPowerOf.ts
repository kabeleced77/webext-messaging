import { MessagingMessageNamePowerOf } from './MessagingMessageNamePowerOf'
import { IMessagingMessageContentPowerOf } from './IMessagingMessageContentPowerOf'
import { MessagingMessageWithContent } from '../../src/MessagingMessageWithContent'
import { IMessagingMessageWithContent } from '../../src/IMessagingMessageWithContent'
import { IMessagingMessageName } from '@kabeleced/webext-messaging'
import { IMessagingCallbackAsync } from '@kabeleced/webext-messaging'

export class MessagingCallbackPowerOf implements IMessagingCallbackAsync {
  constructor() {}

  public messageName(): IMessagingMessageName {
    return new MessagingMessageNamePowerOf()
  }
  public executeAsync(
    messageReceived: IMessagingMessageWithContent<IMessagingMessageContentPowerOf>,
  ): Promise<IMessagingMessageWithContent<number>> {
    return new Promise((resolve) => {
      console.log(`Callback ${this.messageName().name} received message: ${JSON.stringify(messageReceived)}`)
      const reply = new MessagingMessageWithContent<number>(
        this.messageName(),
        Math.pow(messageReceived.content.base, messageReceived.content.exponent),
      )
      console.log(`Callback ${this.messageName().name} reply with message: ${JSON.stringify(reply)}`)
      resolve(reply)
    })
  }
}
