// import of mockzilla-webextension before(!) actual import of 'webextension-polyfill' in system-under-test
import { mockEvent, MockzillaEventOf } from 'mockzilla-webextension'
import { Runtime } from 'webextension-polyfill'
import { Mock } from 'moq.ts'
import { deepMock } from 'mockzilla'
import { IMessagingCallbackAsync } from '../src/Common/IMessagingCallbackAsync'
import { MessagingBackgroundScript } from '../src/MessagingOnConnect/MessagingBackgroundScript'
import { IMessagingMessage } from '../src/Common/IMessagingMessage'
import { IMessagingMessageWithContent } from '../src/Common/IMessagingMessageWithContent'
import { IMessagingMessageName } from '../src/Common/IMessagingMessageName'

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
      sut.onConnect()
      addListenerOnConnect.emit(port)
    })
    it('expect no message-handling as no message received', async () => {
      const callbacks = [
        new Mock<IMessagingCallbackAsync<unknown, unknown>>().object(),
        new Mock<IMessagingCallbackAsync<unknown, unknown>>().object(),
        new Mock<IMessagingCallbackAsync<unknown, unknown>>().object(),
      ]
      const sut = new MessagingBackgroundScript(callbacks)
      sut.onConnect()
      addListenerOnConnect.emit(port)
    })
    it('expect no message-handling as there is no correctly implemented handler registered', async () => {
      const msg01 = mockedMessage(mockedMessageName('message-name'))
      const callbacks = [
        new Mock<IMessagingCallbackAsync<unknown, unknown>>().object(),
        new Mock<IMessagingCallbackAsync<unknown, unknown>>().object(),
        new Mock<IMessagingCallbackAsync<unknown, unknown>>().object(),
      ]
      const sut = new MessagingBackgroundScript(callbacks)
      sut.onConnect()
      addListenerOnConnect.emit(port)
      addListenerOnMessage.emit(msg01, port)
    })
    it('expect no message-handling as there is no well-implemented message handler registered', async () => {
      const msg01 = mockedMessage(mockedMessageName('message-name'))
      const sut = new MessagingBackgroundScript([])
      sut.onConnect()
      addListenerOnConnect.emit(port)
      addListenerOnMessage.emit(msg01, port)
    })
    it("expect exception as received message is 'undefined'", async () => {
      const sut = new MessagingBackgroundScript([])
      expect(() => {
        sut.onConnect()
        addListenerOnConnect.emit(port)
        addListenerOnMessage.emit(undefined, port)
      }).toThrowError()
    })
    it("expect exception as received message's name-property is 'undefined'", async () => {
      const msg01 = mockedMessage(undefined!)
      const sut = new MessagingBackgroundScript([])
      expect(() => {
        sut.onConnect()
        addListenerOnConnect.emit(port)
        addListenerOnMessage.emit(msg01, port)
      }).toThrowError()
    })
    it("expect exception as received message's name-property's name is 'undefined'", async () => {
      const msg01 = mockedMessage(mockedMessageName(undefined!))
      const sut = new MessagingBackgroundScript([])
      expect(() => {
        sut.onConnect()
        addListenerOnConnect.emit(port)
        addListenerOnMessage.emit(msg01, port)
      }).toThrowError()
    })
    it('expect exception as received message is just a string', async () => {
      const sut = new MessagingBackgroundScript([])
      expect(() => {
        sut.onConnect()
        addListenerOnConnect.emit(port)
        addListenerOnMessage.emit('just a string and no object', port)
      }).toThrowError()
    })
    it('expect no message-handling as there is no message handler registered for received message', async () => {
      const msgName01 = mockedMessageName('message-name-01')
      const msg02 = mockedMessage(mockedMessageName('message-name-02'))
      const sut = new MessagingBackgroundScript([
        mockedCallback(msgName01),
        mockedCallback(msgName01),
      ])
      sut.onConnect()
      addListenerOnConnect.emit(port)
      addListenerOnMessage.emit(msg02, port)
    })
    it("expect no message-handling as message handler does not implement method 'messageName()' correctly", async () => {
      const msg02 = mockedMessage(mockedMessageName('message-name-02'))
      const sut = new MessagingBackgroundScript([mockedCallback(undefined!)])
      sut.onConnect()
      addListenerOnConnect.emit(port)
      addListenerOnMessage.emit(msg02, port)
    })
    it("expect no message-handling as message handler's message name object is not well implemented", async () => {
      const msg01 = mockedMessage(mockedMessageName('message-name-01'))
      const sut = new MessagingBackgroundScript([mockedCallback(mockedMessageName(undefined!))])
      sut.onConnect()
      addListenerOnConnect.emit(port)
      addListenerOnMessage.emit(msg01, port)
    })
    it('expect message-handling even one callback throws internal error', async () => {
      const msgName01 = mockedMessageName('message-name-01')
      const msg01 = mockedMessage(msgName01)
      const sut = new MessagingBackgroundScript([
        mockedCallback(
          msgName01,
          msg01,
          new Promise<IMessagingMessage>(() => {
            throw 'Internal UT-Error'
          }),
        ),
        mockedCallback(
          msgName01,
          msg01,
          new Promise<IMessagingMessage>((resolve) => resolve(msg01)),
        ),
      ])
      sut.onConnect()
      mockPort.postMessage.expect(msg01).times(1)
      addListenerOnConnect.emit(port)
      addListenerOnMessage.emit(msg01, port)
    })
    it('expect message-handling of received message by message handler registered for received message', async () => {
      const msgName01 = mockedMessageName('message-name-01')
      const msg01 = mockedMessage(msgName01)
      const sut = new MessagingBackgroundScript([
        mockedCallback(
          msgName01,
          msg01,
          new Promise<IMessagingMessage>((resolve) => resolve(msg01)),
        ),
      ])
      sut.onConnect()
      mockPort.postMessage.expect(msg01).times(1)
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
      sut.onConnect()
      mockPort.postMessage.expect(msg01).times(2)
      addListenerOnConnect.emit(port)
      addListenerOnMessage.emit(msg01, port)
    })
    it('expect message-handling of received message where no reply comes from message handler', async () => {
      const msgName01 = mockedMessageName('message-name-01')
      const msg01 = mockedMessage(msgName01)
      const sut = new MessagingBackgroundScript([mockedCallback(msgName01, msg01)])
      sut.onConnect()
      addListenerOnConnect.emit(port)
      addListenerOnMessage.emit(msg01, port)
    })
    it("expect message-handling of received message where message contains 'content' and no reply comes from message handler", async () => {
      const msgName01 = mockedMessageName('message-name-01')
      const msg01 = mockedMessageWithContent<string>(msgName01, 'message-content')
      let mockedCallback = new Mock<
        IMessagingCallbackAsync<IMessagingMessageWithContent<string>, void>
      >()
        .setup((callback) => callback.messageName())
        .returns(msgName01)
        .setup((cb) => cb.executeAsync(msg01))
        .returns(new Promise<void>((resolve) => resolve()))
        .object()
      const sut = new MessagingBackgroundScript([mockedCallback])
      sut.onConnect()
      addListenerOnConnect.emit(port)
      addListenerOnMessage.emit(msg01, port)
    })
    it("expect message-handling of received message where message contains 'content' and a reply comes from message handler", async () => {
      const msgName01 = mockedMessageName('message-name-01')
      const msg01 = mockedMessageWithContent<string>(msgName01, 'message-content')
      let mockedCallback = new Mock<
        IMessagingCallbackAsync<IMessagingMessageWithContent<string>, number>
      >()
        .setup((callback) => callback.messageName())
        .returns(msgName01)
        .setup((cb) => cb.executeAsync(msg01))
        .returns(new Promise<number>((resolve) => resolve(42)))
        .object()
      const sut = new MessagingBackgroundScript([mockedCallback])
      sut.onConnect()
      mockPort.postMessage.expect(42).times(1)
      addListenerOnConnect.emit(port)
      addListenerOnMessage.emit(msg01, port)
    })
  })

  /*** Supporting functions encapsulating repeating mocking methods ***/

  function mockedCallback(
    msgNameObj: IMessagingMessageName,
    msgObjReceived?: IMessagingMessage,
    callbackReturn?: Promise<IMessagingMessage>,
  ): IMessagingCallbackAsync<unknown, unknown> {
    let mockedCallback = new Mock<IMessagingCallbackAsync<unknown, unknown>>()
      .setup((callback) => callback.messageName())
      .returns(msgNameObj)
    if (msgObjReceived) {
      mockedCallback = mockedCallback
        .setup((callback) => callback.executeAsync(msgObjReceived))
        .returns(new Promise<void>((r) => r()))
    }
    if (msgObjReceived && callbackReturn) {
      mockedCallback = mockedCallback
        .setup((callback) => callback.executeAsync(msgObjReceived))
        .returns(callbackReturn)
    }
    return mockedCallback.object()
  }
  function mockedMessage(msgNameObj: IMessagingMessageName): IMessagingMessage {
    return new Mock<IMessagingMessage>()
      .setup((msg) => msg.name)
      .returns(msgNameObj)
      .object()
  }
  function mockedMessageWithContent<TContent>(
    msgNameObj: IMessagingMessageName,
    msgContent: TContent,
  ): IMessagingMessageWithContent<TContent> {
    return new Mock<IMessagingMessageWithContent<TContent>>()
      .setup((msg) => msg.name)
      .returns(msgNameObj)
      .setup((msg) => msg.content)
      .returns(msgContent)
      .object()
  }
  function mockedMessageName(msgNameStr: string): IMessagingMessageName {
    return new Mock<IMessagingMessageName>()
      .setup((msgName) => msgName.name)
      .returns(msgNameStr)
      .object()
  }
})
