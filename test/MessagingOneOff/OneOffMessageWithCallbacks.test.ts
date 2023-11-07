// import of mockzilla-webextension before(!) actual import of 'webextension-polyfill' in system-under-test
import { mockEvent, MockzillaEventOf } from 'mockzilla-webextension'
import { It, Mock, Times } from 'moq.ts'
import { OneOffMessagingWithCallbacks } from '../../src/OneOffMessaging/OneOffMessagingWithCallbacks'
import { IMessagingMessage } from '../../src/Common/IMessagingMessage'
import { IMessagingMessageWithContent } from '../../src/Common/IMessagingMessageWithContent'
import { IMessagingMessageName } from '../../src/Common/IMessagingMessageName'
import IMessaging from '../../src/Common/IMessaging'
import { IOneOffMessagingCallback } from '../../src/OneOffMessaging/IOneOffMessagingCallback'

describe('OneOffMessageWithCallbacks', () => {
  let addListenerOnMessage: MockzillaEventOf<typeof mockBrowser.runtime.onMessage>

  beforeEach(() => {
    addListenerOnMessage = mockEvent(mockBrowser.runtime.onMessage)
  })

  //  afterEach(() => mockPortNode.verifyAndDisable())

  describe('MessagingBackgroundScriptOnConnect function test', () => {
    it('no message-handling by callback as no message received', async () => {
      const msg01Name = 'message-name'
      const mockedMessageName = mockedMessagingMessageName(msg01Name)
      const mockedMessage = mockedMessagingMessage(mockedMessageName)
      const callback = new Mock<IOneOffMessagingCallback<IMessagingMessage, IMessagingMessage>>()
        .setup((callback) => callback.messageName())
        .returns(mockedMessageName)
        .setup((callback) => callback.execute(mockedMessage))
        .returns(new Promise((r) => r(mockedMessage)))

      const sut = new OneOffMessagingWithCallbacks([callback.object()])
      sut.handle()

      callback.verify((instance) => instance.messageName(), Times.Never())
      callback.verify((instance) => instance.execute(It.IsAny()), Times.Never())
    })
    it('message-handling by callback of received message without a reply', async () => {
      const msg01Name = 'message-name'
      const msg01 = 'message-in-unit-test'
      const mockedMessageName = mockedMessagingMessageName(msg01Name)
      const mockedMessage = mockedMessagingMessage(mockedMessageName)
      const callback = new Mock<IOneOffMessagingCallback<IMessagingMessage, IMessagingMessage>>()
        .setup((callback) => callback.messageName())
        .returns(mockedMessageName)
        .setup((callback) => callback.execute(mockedMessage))
        .returns(new Promise((r) => r(mockedMessage)))

      const sut = new OneOffMessagingWithCallbacks([callback.object()])
      sut.handle()

      addListenerOnMessage.emit(mockedMessage, It.IsAny())
      callback.verify((instance) => instance.messageName(), Times.Exactly(2))
      callback.verify((instance) => instance.execute(It.IsAny()), Times.Exactly(1))
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
    callback: IOneOffMessagingCallback<IMessagingMessage, IMessagingMessage>,
  ): IMessaging<IOneOffMessagingCallback<IMessagingMessage, IMessagingMessage>> {
    return new Mock<IMessaging<IOneOffMessagingCallback<IMessagingMessage, IMessagingMessage>>>()
      .setup((messaging) => messaging.handle(callback))
      .returns()
      .object()
  }

  function mockedCallback(
    msgNameObj: IMessagingMessageName,
    msgObjReceived?: IMessagingMessage,
    callbackReturn?: Promise<IMessagingMessage>,
  ): IOneOffMessagingCallback<unknown, unknown> {
    let mockedCallback = new Mock<IOneOffMessagingCallback<unknown, unknown>>()
      .setup((callback) => callback.messageName())
      .returns(msgNameObj)
    if (msgObjReceived) {
      mockedCallback = mockedCallback
        .setup((callback) => callback.execute(msgObjReceived))
        .returns(new Promise<void>((r) => r()))
    }
    if (msgObjReceived && callbackReturn) {
      mockedCallback = mockedCallback
        .setup((callback) => callback.execute(msgObjReceived))
        .returns(callbackReturn)
    }
    return mockedCallback.object()
  }
  function mockedMessagingMessage(msgNameObj: IMessagingMessageName): IMessagingMessage {
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
  function mockedMessagingMessageName(msgNameStr: string): IMessagingMessageName {
    return new Mock<IMessagingMessageName>()
      .setup((msgName) => msgName.name)
      .returns(msgNameStr)
      .object()
  }
})
