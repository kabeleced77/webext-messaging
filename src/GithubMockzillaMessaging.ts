import browser from 'webextension-polyfill'

export class GithubMockzillaMessaging {
  public connect(): void {
    console.debug(`connect: start`)
    browser.runtime.onConnect.addListener((port: browser.Runtime.Port) => {
      console.debug(`onConnect: add listener`)
      port.onMessage.addListener((message): void => {
        console.debug(`onMessage: received message: ${message}`)
        port.postMessage(`${message}: reply`)
      })
    })
  }
}
