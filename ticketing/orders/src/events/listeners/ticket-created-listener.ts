import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@dwktickets/common';

// Models
import { Ticket } from '../../models/ticket';

// Constants
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { title, price } = data;

    const ticket = Ticket.build({
      title,
      price,
    });
    await ticket.save();

    /**
     * Acks the message, note this method shouldn't be called unless
     * the manualAcks option was set on the subscription.
     */
    msg.ack();
  }
}
