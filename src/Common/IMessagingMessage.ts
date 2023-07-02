import { IMessagingMessageName } from './IMessagingMessageName'

/**
 * Interface describing a serializable message sent via a messaging system.
 *
 * A messaging message must have at least a name for identification.
 *
 * A message without any content - except for the name - can be used to trigger an action on the receiving site.
 * 
 * In order to sent actual content a sub-type of this interface can be used.
 */
export interface IMessagingMessage {
  name: IMessagingMessageName
}
