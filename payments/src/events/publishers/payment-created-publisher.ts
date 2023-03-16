import { Subjects, Publisher, PaymentCreatedEvent } from '@avitickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
