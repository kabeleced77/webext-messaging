// import of mockzilla-webextension before(!) actual import of 'webextension-polyfill' in system-under-test
import { mockEvent, MockzillaEventOf } from 'mockzilla-webextension'
import { It, Mock, Times } from 'moq.ts'
import { IMessagingCallbackAsync } from '../../src/Common/IMessagingCallbackAsync'
import { MessagingOneOffMessageWithCallbacks } from '../../src/MessagingOneOff/MessagingOneOffMessageWithCallbacks'
import { IMessagingMessage } from '../../src/Common/IMessagingMessage'
import { IMessagingMessageWithContent } from '../../src/Common/IMessagingMessageWithContent'
import { IMessagingMessageName } from '../../src/Common/IMessagingMessageName'
import IMessaging from '../../src/Common/IMessaging'
import { CallbackOneOff } from '../../src/Common/IMessagingCallback'


describe('MessagingOneOffMessageWithCallbacks', () => {
  let addListenerOnConnect: MockzillaEventOf<typeof mockBrowser.runtime.onConnect>

  beforeEach(() => {
    addListenerOnConnect = mockEvent(mockBrowser.runtime.onConnect)
  })

  //  afterEach(() => mockPortNode.verifyAndDisable())

  describe('MessagingBackgroundScriptOnConnect function test', () => {
    it('no message-handling by callback as no message received', async () => {
      const msg01Name = 'message-name'
      const msg01 = 'message-in-unit-test'
      const mockedMessagingMessage = mockedMessage(mockedMessageName(msg01Name))
      // const callback = (msg: IMessagingMessage) => new Promise<IMessagingMessage>((r) => r)
      const callback = new Mock<CallbackOneOff<IMessagingMessage, IMessagingMessage>>()
        .setup((c) => c(mockedMessagingMessage))
        .returns(new Promise((r) => r(mockedMessagingMessage)))
      const sut = new MessagingOneOffMessageWithCallbacks(
        mockedMessagingOneOff(callback.object()),
        [],
      )
      sut.onMessage()
      callback.verify((instance) => instance(It.IsAny()), Times.Never())
    })
    it('message-handling by callback of received message without a reply', async () => {
      const msg01Name = 'message-name'
      const msg01 = 'message-in-unit-test'
      const mockedMessagingMessage = mockedMessage(mockedMessageName(msg01Name))

      let mockedMessagingOneOff = new Mock<IMessaging<CallbackOneOff<IMessagingMessage, void>>>()
        .setup((messaging) => messaging.handle((mockedMessagingMessage) => new Promise((r) => r)))
        .returns()
      //        .callback(({ args: [argument] }) => console.warn(`called with ${argument}`))

      const sut = new MessagingOneOffMessageWithCallbacks(mockedMessagingOneOff.object(), [])
      sut.onMessage()
      mockedMessagingOneOff.verify(
        (instance) =>
          instance.handle(
            It.Is<CallbackOneOff<IMessagingMessage, void>>(
              (value) => value === ((mockedMessagingMessage: IMessagingMessage) => {}),
            ),
          ),
        Times.Exactly(1),
      )
    })
    /*
    it('message-handling by callback of received message with a reply', async () => {
      const msg01 = 'message-in-unit-test'
      const reply = 'reply-from-unit-test'
      const callback = (msg: string) => {
        expect(msg).toBe(msg01)
        return new Promise<string>((r) => r(reply))
      }
      const sut = new MessagingOneOffMessageWithCallbacks<string, string>()
      sut.onConnect(callback)
      mockPort.postMessage.expect(reply).times(1)
      addListenerOnConnect.emit(port)
      addListenerOnMessage.emit(msg01, port)
    })
    it('message-handling by callback of received "undefined" message without a reply', async () => {
      const msg01 = undefined
      const callback = (msg: string) => {
        expect(msg).toBe(msg01)
        return new Promise<void>((r) => r)
      }
      const sut = new MessagingOneOffMessageWithCallbacks<string, void>()
      sut.onConnect(callback)
      addListenerOnConnect.emit(port)
      addListenerOnMessage.emit(undefined, port)
    })
    it('message-handling by callback of received "undefined" message with a reply', async () => {
      const msg01 = undefined
      const reply = 'reply-from-unit-test'
      const callback = (msg: string) => {
        expect(msg).toBe(msg01)
        return new Promise<string>((r) => r(reply))
      }
      const sut = new MessagingOneOffMessageWithCallbacks<string, string>()
      sut.onConnect(callback)
      mockPort.postMessage.expect(reply).times(1)
      addListenerOnConnect.emit(port)
      addListenerOnMessage.emit(undefined, port)
    })
    it('exception when callback throws an error', async () => {
      const msg01 = 'message-in-unit-test'
      const callback = (msg: string) => {
        expect(msg).toBe(msg01)
        throw new Error('Test-error within unit-test')
      }
      const sut = new MessagingOneOffMessageWithCallbacks<string, void>()
      expect(() => {
        sut.onConnect(callback)
        addListenerOnConnect.emit(port)
        addListenerOnMessage.emit(msg01, port)
      }).rejects
    })
    */
    /*
    it('exception when port got disconnected', async () => {
      const msg01 = 'message-in-unit-test'
      const reply = 'reply-from-unit-test'
      const callback = ((msg: string) => {
        expect(msg).toBe(msg01)
        return new Promise<string>(r => r(reply))
      })
      const sut = new MessagingBackgroundScriptOnConnect<string, string>()
      sut.onConnect(callback)
      mockPort.postMessage.expect(reply).times(1)
      addListenerOnConnect.emit(port)
      addListenerPortOnDisconnect.emit(port)
      mockPortNode.disable()
      addListenerOnMessage.emit(msg01, port)
    })
    */
    /*
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
    */
  })

  /** Supporting functions encapsulating repeating mocking methods ** */

  function mockedMessagingOneOff(
    callback: CallbackOneOff<IMessagingMessage, IMessagingMessage>,
  ): IMessaging<CallbackOneOff<IMessagingMessage, IMessagingMessage>> {
    return new Mock<IMessaging<CallbackOneOff<IMessagingMessage, IMessagingMessage>>>()
      .setup((messaging) => messaging.handle(callback))
      .returns()
      .object()
  }

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
