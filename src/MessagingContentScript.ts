import browser from 'webextension-polyfill'
import { IMessagingSend } from './IMessagingSend'
import { IMessagingPort } from './IMessagingPort'
import { IMessagingMessageWithContent } from './IMessagingMessageWithContent'
import { IMessagingMessage } from './IMessagingMessage'

export class MessagingContentScript
  implements
    IMessagingSend<
      IMessagingMessage | IMessagingMessageWithContent<unknown>,
      IMessagingMessage | IMessagingMessageWithContent<unknown>
    >
{
  constructor(private port: IMessagingPort) {}

  public send(
    message: IMessagingMessage | IMessagingMessageWithContent<unknown>,
  ): Promise<IMessagingMessage | IMessagingMessageWithContent<unknown>> {
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
