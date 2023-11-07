import { MessagingCallbackPowerOf } from './MessagingCallbackPowerOf'
import { MessagingCallbackTimeNow } from './MessagingCallbackTimeNow'
import { MessagingCallbackClearLocalStorage } from './MessagingCallbackClearLocalStorage'
import { OneOffMessagingWithCallbacks } from '@kabeleced/webext-messaging'
import { MessagingCallbackThrow } from './MessagingCallbackThrow'
import { MessagingCallbackWait } from './MessagingCallbackWait'

;(() => {
  try {
    console.log('Test-Extension: background script started')
    new OneOffMessagingWithCallbacks([
      new MessagingCallbackPowerOf(),
      new MessagingCallbackThrow(),
      new MessagingCallbackWait(),
      new MessagingCallbackTimeNow(),
      new MessagingCallbackClearLocalStorage(),
    ]).handle()
  } catch (error) {
    console.error(`in background: ${error} ${error.stack}`)
  }
})()
