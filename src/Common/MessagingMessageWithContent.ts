import { IMessagingMessageWithContent } from '../IMessagingMessageWithContent'
import { IMessagingMessageName } from './IMessagingMessageName'

export class MessagingMessageWithContent<TContent>
  implements IMessagingMessageWithContent<TContent>
{
  constructor(
    public readonly name: IMessagingMessageName,
    public readonly content: TContent,
  ) {}
}
