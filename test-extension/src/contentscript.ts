import { MessagingMessageNameTimeNow } from './MessagingMessageNameTimeNow'
import browser from 'webextension-polyfill'
import { MessagingMessageNameClearLocalStorage } from './MessagingMessageNameClearLocalStorage'
import { MessagingMessageContentPowerOf } from './MessagingMessageContentPowerOf'
import { IMessagingMessageContentPowerOf } from './IMessagingMessageContentPowerOf'
import { MessagingMessageNamePowerOf } from './MessagingMessageNamePowerOf'
import {
  IMessagingMessageWithContent,
  MessagingContentScript,
  MessagingMessage,
  MessagingMessageWithContent,
  MessagingPort,
} from '@kabeleced/webext-messaging'
;(async () => {
  try {
    /*** prepare for all tests ***/
    const messaging = new MessagingContentScript(new MessagingPort('from-cs'))
    /*** prepare and send message to background script: base to the power of exponent ***/
    const pow3to2 = new MessagingMessageWithContent<IMessagingMessageContentPowerOf>(
      new MessagingMessageNamePowerOf(),
      new MessagingMessageContentPowerOf(3, 2),
    )
    const pow4to3 = new MessagingMessageWithContent<IMessagingMessageContentPowerOf>(
      new MessagingMessageNamePowerOf(),
      new MessagingMessageContentPowerOf(4, 3),
    )
    const resultPow3to2 = <IMessagingMessageWithContent<number>>await messaging.send(pow3to2)
    const resultPow4to3 = <IMessagingMessageWithContent<number>>await messaging.send(pow4to3)
    console.log(
      `send message: '${JSON.stringify(pow3to2)}', received message: '${JSON.stringify(
        resultPow3to2,
      )}'`,
    )
    console.assert(
      resultPow3to2.content === 9,
      `Received message does not contain expected result: message: '${JSON.stringify(
        resultPow3to2,
      )}'`,
    )
    console.log(
      `send message: '${JSON.stringify(pow4to3)}', received message: '${JSON.stringify(
        resultPow4to3,
      )}'`,
    )
    console.assert(
      resultPow4to3.content === 64,
      `Received message does not contain expected result: message: '${JSON.stringify(
        resultPow4to3,
      )}'`,
    )
    /*** prepare and send message to background script: get current time ***/
    const sendMsgTimeNow = new MessagingMessage(new MessagingMessageNameTimeNow())
    const recMsgTmeNow = <IMessagingMessageWithContent<string>>await messaging.send(sendMsgTimeNow)
    const recDateTime = new Date(recMsgTmeNow.content)
    const now = new Date()
    console.log(
      `send message: '${JSON.stringify(sendMsgTimeNow)}', received message: '${JSON.stringify(
        recMsgTmeNow,
      )}'`,
    )
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
    /*** prepare and send message to background script: get current time ***/
    const sendMsgClearLocalStorage = new MessagingMessage(
      new MessagingMessageNameClearLocalStorage(),
    )
    const value = 123
    browser.storage.local.set({ 'test-item': value })
    const valueInStorageBeforeClearing = <number>(
      (await browser.storage.local.get('test-item'))['test-item']
    )
    console.log(`test value in localStorage: '${valueInStorageBeforeClearing}`)
    console.log(`clear localStorage`)
    const recMsgClearLocalStorage = await messaging.send(sendMsgClearLocalStorage)
    const valueInStorageAfterClearing = <number>(
      (await browser.storage.local.get('test-item'))['test-item']
    )
    console.log(
      `send message: '${JSON.stringify(
        sendMsgClearLocalStorage,
      )}', received message: '${JSON.stringify(recMsgClearLocalStorage)}'`,
    )
    console.log(`test value in localStorage: '${valueInStorageAfterClearing}`)
    console.assert(
      valueInStorageBeforeClearing === value,
      `value in storage not set: expected value in localStorage: '${value}'`,
    )
    console.assert(
      valueInStorageAfterClearing === undefined,
      `value in storage was not cleared: value in localStorage: '${valueInStorageAfterClearing}'`,
    )
    /*** prepare and send message to background script: no callback registered ***/
  } catch (error) {
    console.error(`Content script error: ${error} ${error.stack}`)
  }
})()
