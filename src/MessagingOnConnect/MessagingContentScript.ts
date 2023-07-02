import browser from 'webextension-polyfill'
import { IMessagingSend } from '../Common/IMessagingSend'
import { IMessagingPort } from './IMessagingPort'

export class MessagingContentScript<TSend, TReceive> implements IMessagingSend<TSend, TReceive> {
  private runtimePort!: browser.Runtime.Port
  private readonly messagingPortId: string

  constructor(private readonly messagingPort: IMessagingPort<string>) {
    if (this.messagingPort === undefined) throw new Error("Messaging port is undefined.")
    if (this.messagingPort.id === undefined) throw new Error("Messaging port does not implement method 'id()'.")
    this.messagingPortId = this.messagingPort.id()
    if (this.messagingPortId === undefined) throw new Error("Messaging port's id is undefined.")
  }

  private connect() {
    // connect to opened listeners (e.g. from background script)
    this.runtimePort = browser.runtime.connect({ name: this.messagingPortId })
    // register handler in case of port got disconnected
    this.runtimePort.onDisconnect.addListener((port) => {
      if (port.error) {
        console.warn(`Port '${this.messagingPortId}' got disconnected. Reconnect on next call of 'this.send()'. Error was: ${port.error.message}`);
      }
      // set port-property to undefined supporting automated re-connect on calling this.send()
      this.runtimePort = undefined!
    })
  }

  public send(message: TSend): Promise<TReceive> {
    return new Promise((resolve, reject) => {
      try {
        if (!this.runtimePort) this.connect()
        // send message (e.g. to background script)
        this.runtimePort.postMessage(message)
        // register handler in case a reply is sent (e.g. from background script)
        this.runtimePort.onMessage.addListener((m, p): void => {
          resolve(m)
        })
      } catch (error) {
        reject(error)
      }
    })
  }
}
