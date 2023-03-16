import { OrderCancelledEvent, Publisher, Subjects } from '@avitickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
