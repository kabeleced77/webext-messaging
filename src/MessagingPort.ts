import { IMessagingPort } from './IMessagingPort'

export class MessagingPort implements IMessagingPort {
  constructor(private readonly portName: string) {}
  public name(): string {
    return this.portName
  }
}
