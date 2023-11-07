import { IOneOffMessagingCallback, IMessagingMessage } from '@kabeleced/webext-messaging'
import { IMessagingMessageName } from '@kabeleced/webext-messaging'
import { MessagingMessageNameWait } from './MessagingMessageNameWait'

export class MessagingCallbackWait implements IOneOffMessagingCallback<IMessagingMessage, void> {
  constructor() {}

  public messageName(): IMessagingMessageName {
    return new MessagingMessageNameWait()
  }
  public async execute(messageReceived: IMessagingMessage): Promise<void> {
    console.log(
      `Callback ${this.messageName().name} received message: ${JSON.stringify(messageReceived)}`,
    )
    setTimeout(() => {}, 4000)
  }
}
