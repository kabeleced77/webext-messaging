import { IOneOffMessagingCallback, IMessagingMessage } from '@kabeleced/webext-messaging'
import { IMessagingMessageName } from '@kabeleced/webext-messaging'
import { MessagingMessageNameThrow } from './MessagingMessageNameThrow'

export class MessagingCallbackThrow implements IOneOffMessagingCallback<IMessagingMessage, void> {
  constructor() {}

  public messageName(): IMessagingMessageName {
    return new MessagingMessageNameThrow()
  }
  public execute(messageReceived: IMessagingMessage): Promise<void> {
    return new Promise((resolve) => {
      console.log(
        `Callback ${this.messageName().name} received message: ${JSON.stringify(messageReceived)}`,
      )
      throw new Error('Test exception handling')
    })
  }
}
