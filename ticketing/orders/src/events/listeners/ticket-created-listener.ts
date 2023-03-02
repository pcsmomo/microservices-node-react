import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@dwktickets/common';

// Models
import { Ticket } from '../../models/ticket';

// Constants
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {}
}
