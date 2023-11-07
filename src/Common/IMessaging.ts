/** Interface describing the handing of a received message. */
export default interface IMessaging<TCallback> {
  /**
   * This message 'handles' the received message.
   *
   * @param callback Called when a message had been received
   */
  handle(callback: TCallback): void
}
