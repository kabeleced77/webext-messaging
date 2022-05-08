import { MessagingBackgroundScript } from '@kabeleced/webext-messaging'
import { MessagingCallbackPowerOf } from './MessagingCallbackPowerOf'
import { MessagingCallbackTimeNow } from './MessagingCallbackTimeNow'
import { MessagingCallbackClearLocalStorage } from './MessagingCallbackClearLocalStorage'

/**
 * Following the entry point for the background script of this WebExtension.
 */
;(() => {
  try {
    console.log('Test-Extension: background script started')
    new MessagingBackgroundScript([
      new MessagingCallbackPowerOf(),
      new MessagingCallbackTimeNow(),
      new MessagingCallbackClearLocalStorage(),
    ]).connect()
  } catch (error) {
    console.error(`Background script error: ${error} ${error.stack}`)
  }
})()
