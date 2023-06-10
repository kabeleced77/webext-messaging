import browser from 'webextension-polyfill'
import { IMessagingSend } from './IMessagingSend'
import { IMessagingPort } from './IMessagingPort'

export class MessagingContentScript<TSend, TReceive> implements IMessagingSend<TSend, TReceive> {
  constructor(private port: IMessagingPort) { }

  public send(message: TSend): Promise<TReceive> {
    return new Promise((resolve, reject) => {
      try {
        if (this.port === undefined) throw new Error("Messaging port is undefined.")
        if (this.port.name === undefined) throw new Error("Messaging port does not implement method 'name()'.")
        if (this.port.name() === undefined) throw new Error("Messaging port's name is undefined.")
        // connect to opened listeners (e.g. from background script)
        const port = browser.runtime.connect({ name: this.port.name() })
        // send message (e.g. to background script)
        port.postMessage(message)
        // register handler in case a reply is sent (e.g. from background script)
        port.onMessage.addListener((m, p): void => {
          resolve(m)
        })
      } catch (error) {
        reject(error)
      }
    })
  }
}
