import { IMessagingMessage } from './IMessagingMessage'

/**
 * Interface of a message sent via a messaging system.
 *
 * A messaging message has a certain type and transports a generic content.
 */
export interface IMessagingMessageWithContent<TContent> extends IMessagingMessage {
  content: TContent
}
