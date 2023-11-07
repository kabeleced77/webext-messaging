import { IMessagingMessageContentWait } from './IMessagingMessageContentWait'

export class MessagingMessageContentWait implements IMessagingMessageContentWait {
  constructor(public milliseconds: number) {}
}
