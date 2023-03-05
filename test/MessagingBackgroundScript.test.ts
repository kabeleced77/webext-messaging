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
    it('expect no message-handling as there is no message handler registered and no message received', async () => {
      const sut = new MessagingBackgroundScript([])
      sut.connect()
      addListenerOnConnect.emit(port)
    })
    it('expect no message-handling as no message received', async () => {
      const callbacks = [
        new Mock<IMessagingCallbackAsync>().object(),
        new Mock<IMessagingCallbackAsync>().object(),
        new Mock<IMessagingCallbackAsync>().object(),
      ]
      const sut = new MessagingBackgroundScript(callbacks)
      sut.connect()
      addListenerOnConnect.emit(port)
    })
    it('expect no message-handling as there is no correctly implemented handler registered', async () => {
      const msg01 = mockedMessage(mockedMessageName('message-name'))
      const callbacks = [
        new Mock<IMessagingCallbackAsync>().object(),
        new Mock<IMessagingCallbackAsync>().object(),
        new Mock<IMessagingCallbackAsync>().object(),
      ]
      const sut = new MessagingBackgroundScript(callbacks)
      sut.connect()
      addListenerOnConnect.emit(port)
      addListenerOnMessage.emit(msg01, port)
    })
    it('expect no message-handling as there is no well-implemented message handler registered', async () => {
      const msg01 = mockedMessage(mockedMessageName('message-name'))
      const sut = new MessagingBackgroundScript([])
      sut.connect()
      addListenerOnConnect.emit(port)
      addListenerOnMessage.emit(msg01, port)
    })
    it("expect exception 'received message not well implemented' as received message is 'undefined'", async () => {
      const sut = new MessagingBackgroundScript([])
      expect(() => {
        sut.connect()
        addListenerOnConnect.emit(port)
        addListenerOnMessage.emit(undefined, port)
      }).toThrow('Error: received message did not implement interface correctly.')
    })
    it("expect exception 'received message not well implemented' as received message's name is 'undefined'", async () => {
      const msg01 = mockedMessage(mockedMessageName(undefined!))
      const sut = new MessagingBackgroundScript([])
      expect(() => {
        sut.connect()
        addListenerOnConnect.emit(port)
        addListenerOnMessage.emit(msg01, port)
      }).toThrow('Error: received message did not implement interface correctly.')
    })
    it("expect exception 'received message not well implemented' as received message is just a string", async () => {
      const sut = new MessagingBackgroundScript([])
      expect(() => {
        sut.connect()
        addListenerOnConnect.emit(port)
        addListenerOnMessage.emit('just a string and no object', port)
      }).toThrow('Error: received message did not implement interface correctly.')
    })
    it('expect no message-handling as there is no message handler registered for received message', async () => {
      const msgName01 = mockedMessageName('message-name-01')
      const msg02 = mockedMessage(mockedMessageName('message-name-02'))
      const sut = new MessagingBackgroundScript([
        mockedCallback(msgName01),
        mockedCallback(msgName01),
      ])
      sut.connect()
      addListenerOnConnect.emit(port)
      addListenerOnMessage.emit(msg02, port)
    })
    it("expect no message-handling as message handler does not implement method 'messageName()' correctly", async () => {
      const msg02 = mockedMessage(mockedMessageName('message-name-02'))
      const sut = new MessagingBackgroundScript([mockedCallback(undefined!)])
      sut.connect()
      addListenerOnConnect.emit(port)
      addListenerOnMessage.emit(msg02, port)
    })
    it("expect no message-handling as message handler's message name object is not well implemented", async () => {
      const msgName01 = mockedMessageName(undefined!)
      const msg01 = mockedMessage(mockedMessageName('message-name-01'))
      const sut = new MessagingBackgroundScript([mockedCallback(msgName01)])
      sut.connect()
      addListenerOnConnect.emit(port)
      addListenerOnMessage.emit(msg01, port)
    })
    it('expect message-handling (2 times) of received message as two message handler registered for received message', async () => {
      const msgName01 = mockedMessageName('message-name-01')
      const msg01 = mockedMessage(msgName01)
      const sut = new MessagingBackgroundScript([
        mockedCallback(
          msgName01,
          msg01,
          new Promise<IMessagingMessage>((resolve) => resolve(msg01)),
        ),
        mockedCallback(
          msgName01,
          msg01,
          new Promise<IMessagingMessage>((resolve) => resolve(msg01)),
        ),
      ])
      sut.connect()
      mockPort.postMessage.expect(msg01).times(2)
      addListenerOnConnect.emit(port)
      console.info(`from UT: ${msg01.name.name}, ${JSON.stringify(msg01)}`)
      addListenerOnMessage.emit(msg01, port)
    })
  })

  /*** Supporting functions encapsulating repeating mocking methods ***/

  function mockedCallback(
    msgNameObj: IMessagingMessageName,
    msgObj?: IMessagingMessage,
    callbackAsync?: Promise<IMessagingMessage>,
  ): IMessagingCallbackAsync {
    let mockedCallback = new Mock<IMessagingCallbackAsync>()
      .setup((callback) => callback.messageName())
      .returns(msgNameObj)
    if (msgObj && callbackAsync) {
      mockedCallback = mockedCallback
        .setup((callback) => callback.executeAsync(msgObj))
        .returns(callbackAsync)
    }
    return mockedCallback.object()
  }
  function mockedMessage(msgNameObj: IMessagingMessageName): IMessagingMessage {
    return new Mock<IMessagingMessage>()
      .setup((msg) => msg.name)
      .returns(msgNameObj)
      .object()
  }
  function mockedMessageName(msgNameStr: string): IMessagingMessageName {
    return new Mock<IMessagingMessageName>()
      .setup((msgName) => msgName.name)
      .returns(msgNameStr)
      .object()
  }
})
