// import of mockzilla-webextension before(!) actual import of 'webextension-polyfill' in system-under-test
import { mockEvent, MockzillaEventOf } from 'mockzilla-webextension'
import { Runtime } from 'webextension-polyfill'
import { deepMock } from 'mockzilla'
import { OneOffMessagingBackgroundScriptSend } from '../../src/OneOffMessaging/OneOffMessagingBackgroundScriptSend'

describe('MessagingOneOffMessageBackgroundScriptSend', () => {
  const [sendMessageOptions, mockSendMessageOptions, mockSendMessageOptionsNode] =
    deepMock<Runtime.SendMessageOptionsType>('sendMessageOptionsType')
  let addListenerOnMessage: MockzillaEventOf<typeof mockBrowser.runtime.onMessage>

  beforeEach(() => {
    addListenerOnMessage = mockEvent(mockBrowser.runtime.onMessage)
    mockSendMessageOptionsNode.enable()
  })

  afterEach(() => mockSendMessageOptionsNode.verifyAndDisable())

  describe('MessagingOneOffMessageBackgroundScriptSend function test', () => {
    it('send message to configured tab', async () => {
      const tabId = 1
      const msg01 = 'message-in-unit-test'
      mockBrowser.tabs.sendMessage.expect(tabId, msg01, undefined).andResolve(false)
      const sut = new OneOffMessagingBackgroundScriptSend<string, void>(tabId)
      sut.send(msg01)
    })
  })
})
