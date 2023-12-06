// import of mockzilla-webextension before(!) actual import of 'webextension-polyfill' in system-under-test
import { mockEvent, MockzillaEventOf } from 'mockzilla-webextension'
import { It, Mock } from 'moq.ts'
import { OneOffMessagingWithCallbacks } from '../../src/OneOffMessaging/OneOffMessagingWithCallbacks'
import { IMessagingMessageName } from '../../src/Common/IMessagingMessageName'
import { MessagingMessageWithContent } from '../../src/Common/MessagingMessageWithContent'
import { IMessagingMessageWithContent } from '../../src/Common/IMessagingMessageWithContent'
import { IOneOffMessagingCallback } from '../../src/OneOffMessaging/IOneOffMessagingCallback'
import { Runtime } from 'webextension-polyfill'

/** Name of "power-of"-message */
class MsgNamePowerOf implements IMessagingMessageName {
  constructor(public readonly name: string = 'power-of') {}
}

/** Interface for message-content of "power-of"-message */
interface IContentMsgPowerOf {
  readonly base: number
  readonly exponent: number
}

/** Implementation of interface for content of "power-of"-message */
class MsgContentPowerOf implements IContentMsgPowerOf {
  constructor(public readonly base: number, public readonly exponent: number) {}
}

/** Callback handling "power-of"-message */
class CallbackPowerOf
  implements
    IOneOffMessagingCallback<IMessagingMessageWithContent<IContentMsgPowerOf>, IMessagingMessageWithContent<number>>
{
  messageName(): IMessagingMessageName {
    return new MsgNamePowerOf()
  }
  execute(
    message: IMessagingMessageWithContent<IContentMsgPowerOf>,
    sender?: Runtime.MessageSender | undefined,
  ): Promise<IMessagingMessageWithContent<number>> {
    return new Promise((r) =>
      r(
        new MessagingMessageWithContent<number>(
          new MsgNamePowerOf(),
          Math.pow(message.content.base, message.content.exponent),
        ),
      ),
    )
  }
}

describe('OneOffMessageWithCallbacks', () => {
  let addListenerOnMessage: MockzillaEventOf<typeof mockBrowser.runtime.onMessage>

  beforeEach(() => {
    addListenerOnMessage = mockEvent(mockBrowser.runtime.onMessage)
  })

  afterEach(() => {})

  describe('OneOffMessageWithCallback function test', () => {
    it('message-handling by callback for "power-of" message', async () => {
      const message = new MessagingMessageWithContent(new MsgNamePowerOf(), new MsgContentPowerOf(3, 2))
      const sut = new OneOffMessagingWithCallbacks([new CallbackPowerOf()])
      sut.handle()

      addListenerOnMessage.emit(message, It.IsAny())
    })
  })
})
