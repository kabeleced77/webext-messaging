export interface IMessagingOnConnect<TOnConnect = void> {
  onConnect(onConnect?: TOnConnect): void
}
