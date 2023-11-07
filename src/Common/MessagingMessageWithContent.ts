import { IMessagingMessageWithContent } from './IMessagingMessageWithContent'
import { IMessagingMessageName } from './IMessagingMessageName'
import { MessagingMessage } from './MessagingMessage'

/** Implementation of a messaging message which provides the name and content of a message. */
export class MessagingMessageWithContent<TContent>
  extends MessagingMessage
  implements IMessagingMessageWithContent<TContent>
{
  /**
   * @property name - Identifier of the message
   * @property content - Content of message to "transport" information
   */
  constructor(public readonly name: IMessagingMessageName, public readonly content: TContent) {
    super(name)
  }
}
