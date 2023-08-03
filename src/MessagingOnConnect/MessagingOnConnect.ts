import browser from 'webextension-polyfill'
import { CallbackOnConnect } from '../Common/IMessagingCallback'
import IMessaging from '../Common/IMessaging'

/** Handle messaging connection requests. */
export class MessagingOnConnect implements IMessaging<CallbackOnConnect> {
  constructor() {}

  public handle(callback: CallbackOnConnect): void {
    browser.runtime.onConnect.addListener(callback)
  }
}
