export interface IMessagingSend<TSend, TReceive> {
  send(message: TSend): Promise<TReceive>
}
