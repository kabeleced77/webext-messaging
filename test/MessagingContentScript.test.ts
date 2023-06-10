// import of mockzilla-webextension before(!) actual import of 'webextension-polyfill' in system-under-test
import { mockEvent, MockzillaEventOf } from 'mockzilla-webextension'
import { Runtime } from 'webextension-polyfill'
import { Mock } from 'moq.ts'
import { deepMock } from 'mockzilla'
import { MessagingContentScript } from './../src/MessagingContentScript'
import { IMessagingPort } from '../src/IMessagingPort'

describe('MessagingContentScript', () => {
  const [port, mockPort, mockPortNode] = deepMock<Runtime.Port>('port')
  let addListenerOnMessage: MockzillaEventOf<typeof mockPort.onMessage>

  beforeEach(() => {
    addListenerOnMessage = mockEvent(mockPort.onMessage)
    mockPortNode.enable()
  })

  afterEach(() => mockPortNode.verifyAndDisable())

  describe('MessagingContentScript function test', () => {
    it('expect no reply of sent (message !== undefined)', async () => {
      const portName = 'port-name'
      const message = 'message-no-reply'
      const mockedMessagingPort = new Mock<IMessagingPort>()
        .setup((port) => port.name())
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
      const mockedMessagingPort = new Mock<IMessagingPort>()
        .setup((port) => port.name())
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
      const mockedMessagingPort = new Mock<IMessagingPort>()
        .setup((port) => port.name())
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
      const mockedMessagingPort = new Mock<IMessagingPort>()
        .setup((port) => port.name())
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
      const mockedMessagingPort = new Mock<IMessagingPort>()
        .setup((port) => port.name())
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
      const mockedMessagingPort = new Mock<IMessagingPort>()
        .setup((port) => port.name())
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
      const mockedMessagingPort = new Mock<IMessagingPort>()
        .setup((port) => port.name)
        .returns(undefined!)
        .object()
      expect(() => {
        const sut = new MessagingContentScript<string,void>(mockedMessagingPort)
        sut.send(message)
      }).rejects
    })
    it('expect error if messaging-port-interface is not implemented', async () => {
      const message = 'message-no-reply'
      const mockedMessagingPort = new Mock<IMessagingPort>()
        .setup((port) => port.name())
        .returns(undefined!)
        .object()
      expect(() => {
        const sut = new MessagingContentScript<string, void>(mockedMessagingPort)
        sut.send(message)
      }).rejects
    })
  })
})
