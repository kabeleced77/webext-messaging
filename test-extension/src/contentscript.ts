import browser from 'webextension-polyfill'
import { MessagingMessageNameTimeNow } from './MessagingMessageNameTimeNow'
import { MessagingMessageNameClearLocalStorage } from './MessagingMessageNameClearLocalStorage'
import { MessagingMessageContentPowerOf } from './MessagingMessageContentPowerOf'
import { IMessagingMessageContentPowerOf } from './IMessagingMessageContentPowerOf'
import { MessagingMessageNamePowerOf } from './MessagingMessageNamePowerOf'
import {
  IMessagingMessageWithContent,
  MessagingMessage,
  MessagingMessageWithContent,
} from '@kabeleced/webext-messaging'
import { MessagingMessageNameDoSomething } from './MessagingMessageNameDoSomething'
import { MessagingMessageNameThrow } from './MessagingMessageNameThrow'
import { MessagingMessageNameWait } from './MessagingMessageNameWait'
import { IMessagingMessageContentWait } from './IMessagingMessageContentWait'
import { MessagingMessageContentWait } from './MessagingMessageContentWait'
;(async () => {
  try {
    console.log('Test-Extension: content script started')
    /** For all tests ** */
    const send = browser.runtime.sendMessage

    /** Send message to background script: 3 to the power of 2 = 9 */
    await testPowerOf(3, 2, 9)
    /** Send message to background script: 4 to the power of 3 = 64 */
    await testPowerOf(4, 3, 64)
    /** Send message to background script: get time now */
    await testGetTimeNow()
    /** Send message to background script: wait 4000ms */
    await testWait(4000)
    /** Send message to background script: clear local storage */
    await testGetTimeNow()
    /** Send message to background script: wait 4000ms */
    await testClearLocalStorage()
    /** Send message to background script: no callback registered */
    const sendMsgDoSomething = new MessagingMessage(new MessagingMessageNameDoSomething())
    console.log(`send message: '${JSON.stringify(sendMsgDoSomething)}'`)
    const replyDoSomething = await send(sendMsgDoSomething)
    console.log(`received message: '${JSON.stringify(replyDoSomething)}'`)

    /** Send message to background script: callback will throw exception */
    const sendMsgThrowException = new MessagingMessage(new MessagingMessageNameThrow())
    console.log(`send message: '${JSON.stringify(sendMsgThrowException)}'`)
    const replyThrowException = await send(sendMsgThrowException)
    console.log(`received message: '${JSON.stringify(replyThrowException)}'`)

    /***/
    /** Actual test functions called above */
    /***/

    /** Send message to background script: 3 to the power of 2 */
    async function testPowerOf(base: number, exponent: number, expectedResult: number) {
      const msg = new MessagingMessageWithContent<IMessagingMessageContentPowerOf>(
        new MessagingMessageNamePowerOf(),
        new MessagingMessageContentPowerOf(base, exponent),
      )
      console.log(`send message: '${JSON.stringify(msg)}'`)
      const result = <IMessagingMessageWithContent<number>>await send(msg)
      console.log(`received message: '${JSON.stringify(result)}'`)

      console.assert(
        result?.content === expectedResult,
        `Received message does not contain expected result: message: '${JSON.stringify(result)}'`,
      )
    }

    /** Send message to background script: get current time */
    async function testGetTimeNow() {
      const sendMsgTimeNow = new MessagingMessage(new MessagingMessageNameTimeNow())
      console.log(`send message: '${JSON.stringify(sendMsgTimeNow)}'`)
      const recMsgTmeNow = <IMessagingMessageWithContent<string>>await send(sendMsgTimeNow)
      console.log(`received message: '${JSON.stringify(recMsgTmeNow)}'`)
      const recDateTime = new Date(recMsgTmeNow?.content)
      const now = new Date()
      console.assert(
        recDateTime.getFullYear() === now.getFullYear(),
        recDateTime.getMonth() === now.getMonth(),
        recDateTime.getDay() === now.getDay(),
        recDateTime.getHours() === now.getHours(),
        recDateTime.getMinutes() === now.getMinutes(),
        `Received message does not contain expected time 'now': message: '${JSON.stringify(
          recMsgTmeNow,
        )}'`,
      )
    }

    /** Send message to background script: wait given number of milliseconds */
    async function testWait(milliseconds: number) {
      /** Send message to background script: wait given milliseconds */
      const msg = new MessagingMessageWithContent<IMessagingMessageContentWait>(
        new MessagingMessageNameWait(),
        new MessagingMessageContentWait(milliseconds),
      )
      console.log(`send message: '${JSON.stringify(msg)}'`)
      const reply = await send(msg)
      console.log(`received message: '${JSON.stringify(reply)}'`)

      console.assert(
        reply === null,
        `Received message is not null: message: '${JSON.stringify(reply)}'`,
      )
    }
    /** Send message to background script: clear local storage */
    async function testClearLocalStorage() {
      const sendMsgClearLocalStorage = new MessagingMessage(
        new MessagingMessageNameClearLocalStorage(),
      )
      const value = 123
      browser.storage.local.set({ 'test-item': value })
      const valueInStorageBeforeClearing = <number>(
        (await browser.storage.local.get('test-item'))['test-item']
      )
      console.log(`test value in localStorage: '${valueInStorageBeforeClearing}'`)
      console.assert(
        valueInStorageBeforeClearing === value,
        `value in storage not set: expected value in localStorage: '${value}'`,
      )
      console.log(`clear localStorage`)
      console.log(`send message: '${JSON.stringify(sendMsgClearLocalStorage)}'`)
      const recMsgClearLocalStorage = await send(sendMsgClearLocalStorage)
      console.log(`received message: '${JSON.stringify(recMsgClearLocalStorage)}'`)
      const valueInStorageAfterClearing = <number>(
        (await browser.storage.local.get('test-item'))['test-item']
      )
      console.log(`test value in localStorage: '${valueInStorageAfterClearing}'`)
      console.assert(
        valueInStorageAfterClearing === undefined,
        `value in storage was not cleared: value in localStorage: '${valueInStorageAfterClearing}'`,
      )
    }
  } catch (error) {
    console.error(`Content script error: ${error} ${error.stack}`)
  }
})()
