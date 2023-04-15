import browser from 'webextension-polyfill'
import { IMessagingSend } from './IMessagingSend'
import { IMessagingPort } from './IMessagingPort'

export class MessagingContentScript<TSend, TReceive> implements IMessagingSend<TSend, TReceive> {
  constructor(private port: IMessagingPort) {}

  public send(message: TSend): Promise<TReceive> {
    return new Promise((resolve, reject) => {
      try {
        const port = browser.runtime.connect({ name: this.port.name() })
        port.onMessage.addListener((m, p): void => {
          resolve(m)
        })
        port.postMessage(message)
      } catch (error) {
        reject(error)
      }
    })
  }
}
