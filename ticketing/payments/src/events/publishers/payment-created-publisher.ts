import { Subjects, Publisher, PaymentCreatedEvent } from '@dwktickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
