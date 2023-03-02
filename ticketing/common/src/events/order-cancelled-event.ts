import { Subjects } from './subjects';

export interface OrderCancelledEvent {
  subject: Subjects.OrderCancelled;
  data: {
    data: {
      id: string;
      ticket: {
        id: string;
      };
    };
  };
}
