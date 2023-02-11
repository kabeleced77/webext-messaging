// import of mockzilla-webextension before(!) actual import of 'webextension-polyfill' in system-under-test
import { mockEvent, MockzillaEventOf } from 'mockzilla-webextension'
import { IMessagingMessageName } from '../test-extension/dist/src/IMessagingMessageName'
import { IMessagingCallbackAsync } from '../src/IMessagingCallbackAsync'
import { Mock } from 'moq.ts'
import { MessagingBackgroundScript } from '../src/MessagingBackgroundScript'
import { IMessagingMessage } from '../src/IMessagingMessage'
import { deepMock } from 'mockzilla'
import { Runtime } from 'webextension-polyfill'

describe('MessagingBackgroundScript', () => {
  const [port, mockPort, mockPortNode] = deepMock<Runtime.Port>('port')
  let addListenerOnConnect: MockzillaEventOf<typeof mockBrowser.runtime.onConnect>
  let addListenerOnMessage: MockzillaEventOf<typeof mockPort.onMessage>

  beforeEach(() => {
    addListenerOnConnect = mockEvent(mockBrowser.runtime.onConnect)
    addListenerOnMessage = mockEvent(mockPort.onMessage)
    mockPortNode.enable()
  })

  afterEach(() => mockPortNode.verifyAndDisable())

  describe('MessagingBackgroundScript function test', () => {
    it('method connect() shall handle connection request', async () => {
      const name01 = 'messageName01'
      const msgName01 = new Mock<IMessagingMessageName>()
        .setup((msgName) => msgName.name)
        .returns(name01)
        .object()
      const msg01 = new Mock<IMessagingMessage>()
        .setup((msg) => msg.name)
        .returns(msgName01)
        .object()
      const callbacks = [
        new Mock<IMessagingCallbackAsync>()
          .setup((callback) => callback.messageName())
          .returns(msgName01)
          .setup((callback) => callback.executeAsync(msg01))
          .returns(new Promise<IMessagingMessage>((resolve) => resolve(msg01)))
          .object(),
      ]
      const sut = new MessagingBackgroundScript(callbacks)
      sut.connect()
      mockPort.postMessage.expect(msg01)
      addListenerOnConnect.emit(port)
      addListenerOnMessage.emit(msg01, port)
    })
    it('method connect() shall handle messages by message-name', async () => {
      const name01 = 'messageName01'
      const msgName01 = new Mock<IMessagingMessageName>()
        .setup((msgName) => msgName.name)
        .returns(name01)
        .object()
      const msg01 = new Mock<IMessagingMessage>()
        .setup((msg) => msg.name)
        .returns(msgName01)
        .object()
      const callbacks = [
        new Mock<IMessagingCallbackAsync>()
          .setup((callback) => callback.messageName())
          .returns(msgName01)
          .setup((callback) => callback.executeAsync(msg01))
          .returns(new Promise<IMessagingMessage>((resolve) => resolve(msg01)))
          .object(),
      ]
      const sut = new MessagingBackgroundScript(callbacks)
      sut.connect()
      mockPort.postMessage.expect(msg01)
      addListenerOnConnect.emit(port)
      addListenerOnMessage.emit(msg01, port)
    })
  })
})
