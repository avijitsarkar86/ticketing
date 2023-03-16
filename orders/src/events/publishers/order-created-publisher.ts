import { OrderCreatedEvent, Publisher, Subjects } from '@avitickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
