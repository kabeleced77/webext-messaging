import { Mock } from 'moq.ts'
import { IMessagingMessageName } from '../../src/Common/IMessagingMessageName'
import { IMessagingMessage } from '../../src/Common/IMessagingMessage'

describe('IMessagingMessage property test', () => {
  it("interface shall define property 'name'", () => {
    const name01 = 'messageName01'
    const msgName = new Mock<IMessagingMessageName>().setup((msgName) => msgName.name).returns(name01)
    const msg = new Mock<IMessagingMessage>()
      .setup((msg) => msg.name)
      .returns(msgName.object())
      .object()
    expect(msg.name.name).toEqual(name01)
  })
})
