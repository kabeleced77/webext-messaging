import { IMessagingMessage } from './Common/IMessagingMessage'

/**
 * Interface of a message sent via a messaging system including content.
 *
 * A messaging message with content extends the base messaging-message by a generic content.
 */
export interface IMessagingMessageWithContent<TContent> extends IMessagingMessage {
  content: TContent
}
