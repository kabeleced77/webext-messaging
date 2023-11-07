import { deepMock } from 'mockzilla'
import { mockEvent, MockzillaEventOf } from 'mockzilla-webextension'
import { Runtime } from 'webextension-polyfill'
import OneOffMessaging from './GithubOneOffMessaging'

describe('OneOffMessaging', () => {
  const [messageSender, mockMessageSender, mockMessageSenderNode] =
    deepMock<Runtime.MessageSender>('messageSender')
  let addListenerOnMessage: MockzillaEventOf<typeof mockBrowser.runtime.onMessage>
  const mockMessageSenderFrame = 456
  const mockMessageSenderId = '123'
  const mockMessageSenderUrl = 'url'
  const msg01 = 'message-in-unit-test'

  beforeEach(() => {
    addListenerOnMessage = mockEvent(mockBrowser.runtime.onMessage)
    mockMessageSenderNode.enable()
    mockMessageSender.frameId?.mock(mockMessageSenderFrame)
    mockMessageSender.id?.mock(mockMessageSenderId)
    mockMessageSender.url?.mock(mockMessageSenderUrl)
  })

  afterEach(() => mockMessageSenderNode.verifyAndDisable())

  describe('OneOffMessaging function test', () => {
    it('message-handling by callback receiving message and messageSender-data; no reply', async () => {
      const listener = jest.fn()
      mockBrowser.runtime.onMessage.addListener.expect(listener, expect.anything())
      const sut = new OneOffMessaging<string, void>()
      sut.handle(listener)
      addListenerOnMessage.emit(msg01, messageSender)
    })
  })
})
