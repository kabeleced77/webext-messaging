import { IMessagingMessageContentPowerOf } from './IMessagingMessageContentPowerOf'

export class MessagingMessageContentPowerOf implements IMessagingMessageContentPowerOf {
  constructor(public base: number, public exponent: number) {}
}
