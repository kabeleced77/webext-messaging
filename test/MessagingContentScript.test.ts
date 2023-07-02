// import of mockzilla-webextension before(!) actual import of 'webextension-polyfill' in system-under-test
import { mockEvent, MockzillaEventOf } from 'mockzilla-webextension'
import { runtime, Runtime } from 'webextension-polyfill'
import { Mock } from 'moq.ts'
import { deepMock } from 'mockzilla'
import { MessagingContentScript } from '../src/MessagingContentScript'
import { IMessagingPort } from '../src/IMessagingPort'

describe('MessagingContentScript', () => {
  const [portErrorType, mockPortErrorType, mockPortErrorTypeNode] = deepMock<Runtime.PortErrorType>('portErrorType')
  const [port, mockPort, mockPortNode] = deepMock<Runtime.Port>('port')
  let addListenerOnMessage: MockzillaEventOf<typeof mockPort.onMessage>
  let addListenerOnDisconnect: MockzillaEventOf<typeof mockPort.onDisconnect>

  beforeEach(() => {
    addListenerOnMessage = mockEvent(mockPort.onMessage)
    addListenerOnDisconnect = mockEvent(mockPort.onDisconnect)
    mockPortNode.enable()
    mockPortErrorTypeNode.enable()
  })

  afterEach(() => mockPortNode.verifyAndDisable())

  describe('MessagingContentScript function test', () => {
    it('expect no reply of sent (message !== undefined)', async () => {
      const portName = 'port-name'
      const message = 'message-no-reply'
      const mockedMessagingPort = new Mock<IMessagingPort<string>>()
        .setup((port) => port.id())
        .returns(portName)
        .object()
      mockBrowser.runtime.connect.expect({ name: portName }).andReturn(port)
      mockPort.postMessage.expect(message).times(1)
      const sut = new MessagingContentScript<string, void>(mockedMessagingPort)
      sut.send(message)
    })
    it('expect no reply of sent (message === undefined)', async () => {
      const portName = 'port-name'
      const message = undefined!
      const mockedMessagingPort = new Mock<IMessagingPort<string>>()
        .setup((port) => port.id())
        .returns(portName)
        .object()
      mockBrowser.runtime.connect.expect({ name: portName }).andReturn(port)
      mockPort.postMessage.expect(message).times(1)
      const sut = new MessagingContentScript<string, void>(mockedMessagingPort)
      sut.send(message)
    })
    it('expect a (reply !== undefined) of sent (message !== undefined)', async () => {
      const portName = 'port-name'
      const message = 'message-with-reply'
      const messageReply = 'reply of message-with-reply'
      const mockedMessagingPort = new Mock<IMessagingPort<string>>()
        .setup((port) => port.id())
        .returns(portName)
        .object()
      mockBrowser.runtime.connect.expect({ name: portName }).andReturn(port)
      mockPort.postMessage.expect(message).times(1)
      const sut = new MessagingContentScript<string, string>(mockedMessagingPort)
      sut.send(message).then(reply => expect(reply).toEqual(messageReply))
      addListenerOnMessage.emit(messageReply, port)
    })
    it('expect a (reply !== undefined) of sent (message === undefined)', async () => {
      const portName = 'port-name'
      const message = undefined!
      const messageReply = 'reply of message-with-reply'
      const mockedMessagingPort = new Mock<IMessagingPort<string>>()
        .setup((port) => port.id())
        .returns(portName)
        .object()
      mockBrowser.runtime.connect.expect({ name: portName }).andReturn(port)
      mockPort.postMessage.expect(message).times(1)
      const sut = new MessagingContentScript<string, string>(mockedMessagingPort)
      sut.send(message).then(reply => expect(reply).toEqual(messageReply))
      addListenerOnMessage.emit(messageReply, port)
    })
    it('expect a (reply === undefined) of sent (message !== undefined)', async () => {
      const portName = 'port-name'
      const message = 'message-with-reply'
      const messageReply = undefined
      const mockedMessagingPort = new Mock<IMessagingPort<string>>()
        .setup((port) => port.id())
        .returns(portName)
        .object()
      mockBrowser.runtime.connect.expect({ name: portName }).andReturn(port)
      mockPort.postMessage.expect(message).times(1)
      const sut = new MessagingContentScript<string, string>(mockedMessagingPort)
      sut.send(message).then(reply => expect(reply).toEqual(messageReply))
      addListenerOnMessage.emit(messageReply, port)
    })
    it('expect a (reply !== undefined) of sent (message === undefined)', async () => {
      const portName = 'port-name'
      const message = undefined!
      const messageReply = undefined
      const mockedMessagingPort = new Mock<IMessagingPort<string>>()
        .setup((port) => port.id())
        .returns(portName)
        .object()
      mockBrowser.runtime.connect.expect({ name: portName }).andReturn(port)
      mockPort.postMessage.expect(message).times(1)
      const sut = new MessagingContentScript<string, string>(mockedMessagingPort)
      sut.send(message).then(reply => expect(reply).toEqual(messageReply))
      addListenerOnMessage.emit(messageReply, port)
    })
    it('expect error if messaging-port-interface is not implementing method name()', async () => {
      const message = 'message-no-reply'
      const mockedMessagingPort = undefined!
      expect(() => {
        const sut = new MessagingContentScript<string, void>(mockedMessagingPort)
        sut.send(message)
      }).rejects
    })
    it('expect error if messaging-port-interface is not implementing method name()', async () => {
      const message = 'message-no-reply'
      const mockedMessagingPort = new Mock<IMessagingPort<string>>()
        .setup((port) => port.id())
        .returns(undefined!)
        .object()
      expect(() => {
        const sut = new MessagingContentScript<string, void>(mockedMessagingPort)
        sut.send(message)
      }).rejects
    })
    it('expect error if messaging-port-interface is not implemented', async () => {
      const message = 'message-no-reply'
      const mockedMessagingPort = new Mock<IMessagingPort<string>>()
        .setup((port) => port.id())
        .returns(undefined!)
        .object()
      expect(() => {
        const sut = new MessagingContentScript<string, void>(mockedMessagingPort)
        sut.send(message)
      }).rejects
    })
    it('Port got disconnected ', async () => {
      const portName = 'port-name'
      const message = 'message-no-reply'
      const mockedMessagingPort = new Mock<IMessagingPort<string>>()
        .setup((port) => port.id())
        .returns(portName)
        .object()
      mockBrowser.runtime.connect.expect({ name: portName }).andReturn(port)
      mockPort.postMessage.expect(message).times(1)
      const sut = new MessagingContentScript<string, void>(mockedMessagingPort)
      sut.send(message)
      mockPortErrorType.message.mock("Forced by unit-test testing port got disconnected.")
      mockPort.error?.mock(portErrorType)
      addListenerOnDisconnect.emit(port)
    })
    it('Port got disconnected - reconnection at next call of send()', async () => {
      const portName = 'port-name'
      const message = 'message-no-reply'
      const mockedMessagingPort = new Mock<IMessagingPort<string>>()
        .setup((port) => port.id())
        .returns(portName)
        .object()
      mockBrowser.runtime.connect.expect({ name: portName }).andReturn(port).times(2)
      mockPort.postMessage.expect(message).times(2)
      const sut = new MessagingContentScript<string, void>(mockedMessagingPort)
      sut.send(message)
      mockPortErrorType.message.mock("Forced by unit-test testing port got disconnected.")
      mockPort.error?.mock(portErrorType)
      addListenerOnDisconnect.emit(port)
      sut.send(message)
    })
  })
})
