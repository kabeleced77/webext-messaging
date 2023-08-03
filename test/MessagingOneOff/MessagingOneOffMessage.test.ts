// import of mockzilla-webextension before(!) actual import of 'webextension-polyfill' in system-under-test
import { mockEvent, MockzillaEventOf } from 'mockzilla-webextension'
import { Runtime } from 'webextension-polyfill'
import { deepMock } from 'mockzilla'
import MessagingOneOffMessage from '../../src/MessagingOneOff/MessagingOneOffMessage'

describe('MessagingOneOffMessage', () => {
  const [messageSender, mockMessageSender, mockMessageSenderNode] =
    deepMock<Runtime.MessageSender>('messageSender')
  let addListenerOnMessage: MockzillaEventOf<typeof mockBrowser.runtime.onMessage>

  beforeEach(() => {
    addListenerOnMessage = mockEvent(mockBrowser.runtime.onMessage)
    mockMessageSenderNode.enable()
  })

  afterEach(() => mockMessageSenderNode.verifyAndDisable())

  describe('MessagingOneOffMessage function test - reply of callback called in handle() is (cannot) be tested', () => {
    it('no message-handling as no message received', async () => {
      const callback = (msg: string) => {
        expect(msg).toBe(undefined)
        return new Promise<void>((r) => r)
      }
      const sut = new MessagingOneOffMessage<string, void>()
      sut.handle(callback)
    })

    it('message-handling by callback of received message without a reply', async () => {
      const msg01 = 'message-in-unit-test'
      const callback = (msg: string) => {
        console.warn(`called with ${msg}`)
        expect(msg).toBe(msg01)
        return new Promise<void>((r) => r)
      }
      const sut = new MessagingOneOffMessage<string, void>()
      sut.handle(callback)
      addListenerOnMessage.emit(msg01, messageSender)
    })

    it('message-handling by callback of received message with a reply', async () => {
      const msg01 = 'message-in-unit-test'
      const msg01Reply = 'reply-from-unit-test'
      const callback = (msg: string) => {
        console.warn(`called with ${msg}`)
        expect(msg).toBe(msg01)
        return new Promise<string>((r) => r(msg01Reply))
      }
      const sut = new MessagingOneOffMessage<string, string>()
      sut.handle(callback)
      addListenerOnMessage.emit(msg01, messageSender)
    })

    it('exception handling not really possible when callback throws error', async () => {
      const msg01 = 'message-in-unit-test'
      const callback = (msg: string) => {
        console.warn(`called with ${msg}`)
        throw new Error(`Unit test throws error for testing exception handling.`)
      }
      const sut = new MessagingOneOffMessage<string, string>()
      expect(() => sut.handle(callback))
      addListenerOnMessage.emit(msg01, messageSender)
    })
  })
})
