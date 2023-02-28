import { Message } from 'node-nats-streaming';
import { Listener } from './base-listener';
import { TicketUpdatedEvent } from './ticket-updated-event';
import { Subjects } from './subjects';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = 'payments-service';

  onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    // console.log('Event data: ', data);
    console.log(`Event data #${msg.getSequence()}:`, data);

    msg.ack();
  }
}
