import { IMessagingMessageWithContent } from './IMessagingMessageWithContent'
import { IMessagingMessage } from './IMessagingMessage'
import { IMessagingMessageName } from './IMessagingMessageName'

export class MessagingMessageWithContent<TMessagingMessageContent>
  implements IMessagingMessage, IMessagingMessageWithContent<TMessagingMessageContent>
{
  constructor(
    public readonly name: IMessagingMessageName,
    public readonly content: TMessagingMessageContent,
  ) {}
}
