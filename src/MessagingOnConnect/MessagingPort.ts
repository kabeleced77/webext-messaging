import { IMessagingPort } from './IMessagingPort'

export class MessagingPort implements IMessagingPort<string> {
  constructor(private readonly portName: string) {}
  public id(): string {
    return this.portName
  }
}
