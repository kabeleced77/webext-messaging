import { IMessagingMessageName } from './IMessagingMessageName'

/**
 * Interface describing a serializable message sent via a messaging system.
 *
 * In order to sent actual content the sub-type $(ref:IMessagingMessageWithContent) of this
 * interface must be used.
 *
 * @property name - Identifier of the messaging message
 */
export interface IMessagingMessage {
  name: IMessagingMessageName
}
