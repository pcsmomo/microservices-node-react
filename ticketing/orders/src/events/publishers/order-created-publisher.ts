import { Publisher, OrderCreatedEvent, Subjects } from '@dwktickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
