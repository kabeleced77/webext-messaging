import { IMessagingMessage } from './IMessagingMessage'

/**
 * Interface of a message sent via a messaging system, which also contains content generic type.
 *
 * @property content - Actual content of a messaging message
 */
export interface IMessagingMessageWithContent<TContent> extends IMessagingMessage {
  content: TContent
}
