# webext-messaging

This package provides interfaces and implementations exchanging messages between the content and the background script of a WebExtension.

Please note: webextension messaging offers "one-off" and connection based messaging This package currently supports only one-off messaging.

## Background of the Messaging-API for WebExtension

The WebExtension's messaging-API provides functions exchanging "messages" between content and background script. I.e. one side is sending a messages whereas the other side has to listen if a message has been received. The listening side has to provide a callback handling the received message.

## Messages are serialised

The message sent is serialised before the actual transmission. I.e. objects will "loose" their methods and only actual properties will "survive" the message transfer.

## Aim of package

This package provides the event handling - i.e. listening - of received messages. The pattern is as following:

- register one or more callbacks on the receiving end
- each callback handles a certain message
- each message is identified by its name
- a callback is executed if the received message's name matches the callback's message-name
- the callback can provide a reply

# Common Interfaces of this Package

This section describes the common interfaces of this package. "Common" in the sense that it can be used for either one-off or connection-based messaging.

## Interface `IMessaging<TCallback>`

The interface describes the messaging to be implemented by the receiving part. The implementation of this interface handles a received message. The generic `TCallback` defines the type of the handling method.
Usually the generic `TCallback` will be something like `(msg: TReceive) => Promise<TReply>`, where `TReceive` defines the type of the message received and `TReply` the type of the response. `TReply = void` would mean that there will be no response.

### `IMessaging<TCallback>.handle(callback: TCallback): void`

The interface's method `handle()` is called when a message has ben received. The parameter `callback` is called.

## Interface `IMessagingMessage`

The interface describes the expected structure of a message. A message always requires a name for identification.

As a message is always serialised before it is send, only solid properties are defined.

### `IMessagingMessage.name: IMessagingMessageName`

The interface's property `name` is used to identify a message.

The property is defined as a type to reuse the name across the extension. Rather than providing a `string` in each place needed.

## Interface `IMessagingMessageName`

The interface describes the name of a message.

As a message is always serialised before it is send, only solid properties are defined.

### `IMessagingMessageName.name: string`

The interface's property `name` is used to identify a message.

## Interface `IMessagingMessageWithContent<TContent> extends IMessagingMessage`

The interface extends the interface `IMessagingMessage` with the possibility sending content in the message - next to the message's name.

As a message is always serialised before it is send, only solid properties are defined.

### `IMessagingMessageWithContent<TContent>.content: TContent`

The interface's property holds the `content` of a message.

The `content`'s type is given as a generic.

# Common Implementations of this Package

This section describes the common implementations of this package. "Common" in the sense that it can be used for either one-off or connection-based messaging.

## Implementation `MessagingMessage`

The implementation of message identified by its name.

### `MessagingMessage.name`

Returns the name of the message.

## Implementation `MessagingMessageWithContent<TContent>`

The implementation extends the type `MessagingMessage` in order to also contain content next to the message's name.

### `MessagingMessageWithContent.content`

Returns the content of a message.

# Interfaces for One-off Messaging

This section describes the interfaces specific to the one-off messaging functionality.

## Interface `IOneOffMessagingCallback<TReceive, TReply>`

This interface describes a callback which can be registered to handle a certain message. I.e. the callback is only executed if the name of the received message matches the name of the callback's message.

### `IOneOffMessagingCallback<TReceive, TReply>.messageName(): IMessagingName`

The method `messageName()` returns the name of the message this callback is "registered" for.

### `IOneOffMessagingCallback<TReceive, TReply>.execute(message: TReceive, sender?: browser.Runtime.MessageSender): Promise<TReply>`

The method `execute()` is to be called when the name of the received message matches the message-name of the callback. The received message is provided as parameter.

The optional parameter `sender` provides information about the sender of the received message.

The response is returned as a `Promise`.

# Implementations for One-off Messaging

This section describes the implementations of the interfaces that provide the one-off messaging functionality.

## Implementation `OneOffMessagingWithCallbacks`

The implementation of the interface `IMessaging<void>`. It offers the pattern implementation where one or more callbacks can be "registered". Each callback must implement the interface `IOneOffMessagingCallback`.

As soon as a message is received all given (i.e. "registered") callbacks are checked. The first callback matches is called.

An optional reply is send back.

This implementation can be used in background as well as content scripts of a WebExtension.

### `OneOffMessagingWithCallbacks.handle()`

Once the method `handle()` is called a listener is setup waiting to receive one-off messages.

# Example

Following example uses the interfaces and implementations of this package described above.

The following shows a background script which handles received message by certain callback implementations.

```
# background.ts

import { MessagingCallbackPowerOf } from './MessagingCallbackPowerOf'
import { MessagingCallbackTimeNow } from './MessagingCallbackTimeNow'
import { OneOffMessagingWithCallbacks } from '@kabeleced/webext-messaging'

;(() => {
  try {
    new OneOffMessagingWithCallbacks([
      new MessagingCallbackPowerOf(),
    ]).handle()
  } catch (error) {
    console.error(`in background: ${error} ${error.stack}`)
  }
})()
```

The following code shows the callback implementations

```
# MessagingCallbackPowerOf.ts

import {
  IOneOffMessagingCallback,
  IMessagingMessageName,
  IMessagingMessageWithContent,
  MessagingMessageWithContent,
} from '@kabeleced/webext-messaging'
import { MessagingMessageNamePowerOf } from './MessagingMessageNamePowerOf'
import { IMessagingMessageContentPowerOf } from './IMessagingMessageContentPowerOf'

export class MessagingCallbackPowerOf
  implements
    IOneOffMessagingCallback<
      IMessagingMessageWithContent<IMessagingMessageContentPowerOf>,
      IMessagingMessageWithContent<number>
    >
{
  constructor() {}

  public messageName(): IMessagingMessageName {
    return new MessagingMessageNamePowerOf()
  }
  public execute(
    received: IMessagingMessageWithContent<IMessagingMessageContentPowerOf>,
  ): Promise<IMessagingMessageWithContent<number>> {
    return new Promise((resolve) => {
      resolve(new MessagingMessageWithContent<number>(
          this.messageName(),
          Math.pow(received.content.base, received.content.exponent),
        )
      )
    })
  }
}
```

The following code shows the message name object used in callback and later in content script:

```
# IMessagingMessageNamePowerOf.ts

import { IMessagingMessageName } from '@kabeleced/webext-messaging'

export class MessagingMessageNamePowerOf implements IMessagingMessageName {
  constructor() {}

  public readonly name = 'powerOf'
}
```

The following code shows the interface describing the content of the message power-of:

```
# IMessagingMessageContentPowerOf.ts

export interface IMessagingMessageContentPowerOf {
	base: number;
	exponent: number;
}
```

The following code shows the implementation of the interface of the content of the message power-of. This object will be actually sent:

```
# MessagingMessageContentPowerOf.ts

import { IMessagingMessageContentPowerOf } from './IMessagingMessageContentPowerOf'

export class MessagingMessageContentPowerOf implements IMessagingMessageContentPowerOf {
  constructor(public base: number, public exponent: number) {}
}
```

The following code shows the content script implementation sending messages. Those messages trigger one or all of the registered callbacks in the background script.

```
# contentscript.ts

import browser from 'webextension-polyfill'
import { MessagingMessageContentPowerOf } from './MessagingMessageContentPowerOf'
import { IMessagingMessageContentPowerOf } from './IMessagingMessageContentPowerOf'
import { MessagingMessageNamePowerOf } from './MessagingMessageNamePowerOf'
import {
  IMessagingMessageWithContent,
  MessagingMessage,
  MessagingMessageWithContent,
} from '@kabeleced/webext-messaging'
(async () => {
  try {
    /** Send message to background script: 3 to the power of 2 */
    const msg = new MessagingMessageWithContent<IMessagingMessageContentPowerOf>(
      new MessagingMessageNamePowerOf(),
      new MessagingMessageContentPowerOf(3, 2),
    )
    const result = <IMessagingMessageWithContent<number>>await browser.runtime.sendMessage(msg)
    console.assert(
      result?.content === 9,
      `Received message does not contain expected result`,
    )
  } catch (error) {
    console.error(`Content script error: ${error} ${error.stack}`)
  }
})()
```
