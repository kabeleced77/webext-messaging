import browser from 'webextension-polyfill'
import { IMessagingSend } from './Common/IMessagingSend'

/**
 * Implementation of the messaging-send interface sending "one-off" messages from the content script.
 */
export class MessagingOneOffMessageContentScriptSend<TSend, TReceive> implements IMessagingSend<TSend, TReceive> {
  /**
   * 
   * @param extensionId Optional. Id the message to send to. If not given the message is sent to own extension.
   * @param options Optional. Settings affecting the message transmission. 
   */
  constructor(private readonly extensionId?: string, private readonly options?: browser.Runtime.SendMessageOptionsType) { }

  /**
   * Sends a single message to the background script
   * @param message Message to be send.
   * @returns Promise with an optional reply.
   */
  public send(message: TSend): Promise<TReceive> {
    return browser.runtime.sendMessage(this.extensionId, message, this.options)
  }
}
