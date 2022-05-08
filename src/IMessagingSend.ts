export interface IMessagingSend<TSendMessage, TReceiveMessage> {
  send(message: TSendMessage): Promise<TReceiveMessage>
}
