import browser from 'webextension-polyfill'
import { IMessagingSend } from '../Common/IMessagingSend'

/**
 * Implementation of the messaging-send interface sending "one-off" messages from the background script.
 */
export class MessagingOneOffMessageBackgroundScriptSend<TSend, TReceive> implements IMessagingSend<TSend, TReceive> {
  /**
   * 
   * @param tabId TabId of the content script a message shall be send to.
   * @param options Optional. Settings affecting the message transmission. 
   */
  constructor(private readonly tabId: number, private readonly options?: browser.Runtime.SendMessageOptionsType) { }

  /**
   * Sends a single message to the content script(s)
   * @param message Message to be send.
   * @returns Promise with an optional reply.
   */
  public send(message: TSend): Promise<TReceive> {
    return browser.tabs.sendMessage(this.tabId, message, this.options)
  }
}
