import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@dwktickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
