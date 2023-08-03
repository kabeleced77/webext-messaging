export default interface IMessaging<TCallback> {
  handle(callback: TCallback): void
}
