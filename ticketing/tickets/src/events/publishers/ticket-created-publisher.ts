import { Publisher, Subjects, TicketCreatedEvent } from '@dwktickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
