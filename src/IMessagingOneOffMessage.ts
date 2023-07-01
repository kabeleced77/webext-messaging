/**
 * Interface describing a connection-less messaging communication.
 */
export interface IMessagingOneOffMessage<TReceive, TReply, TSender> {
  /**
   * This method describes an event handler called when a message has been received.
   * @param callback The given callback gets as parameter the received message and optionally
   * sender information. The callback can provide an optional reply as return value.
   */
  onMessage(callback: (message: TReceive, sender?: TSender) => Promise<TReply | void>): void
}
