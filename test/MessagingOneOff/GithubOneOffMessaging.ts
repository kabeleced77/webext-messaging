import browser from 'webextension-polyfill'

export default class OneOffMessaging<TReceive, TReply> {
  public handle(
    handleMessage: (message: TReceive, sender?: browser.Runtime.MessageSender) => Promise<TReply>,
  ): void {
    browser.runtime.onMessage.addListener(handleMessage)
  }
}
