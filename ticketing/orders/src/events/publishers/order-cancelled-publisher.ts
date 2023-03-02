import { Publisher, OrderCancelledEvent, Subjects } from '@dwktickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
