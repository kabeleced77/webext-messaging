import { Mock } from 'moq.ts'
import { IMessagingMessageName } from '../src/IMessagingMessageName'
import { MessagingMessage } from './../src/MessagingMessage'

describe('property test', () => {
  it('property name shall return message-name object', () => {
    const name01 = 'messageName01'
    const mockMsgName01 = new Mock<IMessagingMessageName>()
      .setup((msgName) => msgName.name)
      .returns(name01)
    const sut = new MessagingMessage(mockMsgName01.object())
    expect(sut.name.name).toEqual(name01)
  })
})
