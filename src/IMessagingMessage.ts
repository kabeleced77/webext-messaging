import { IMessagingMessageName } from "./IMessagingMessageName";

/**
 * Interface describing a serializable message sent via a messaging system.
 *
 * A messaging message must have at least a name for identification.
 */
export interface IMessagingMessage {
  name: IMessagingMessageName
}
