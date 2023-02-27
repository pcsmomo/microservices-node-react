import { Message } from 'node-nats-streaming';
import { Listener } from './base-listener';

export class TicketCreatedListener extends Listener {
  subject = 'ticket:created';
  queueGroupName = 'payments-service';

  onMessage(data: any, msg: Message) {
    // console.log('Event data: ', data);
    console.log(`Event data #${msg.getSequence()}:`, data);

    console.log(data.name);
    console.log(data.cost);

    msg.ack();
  }
}
