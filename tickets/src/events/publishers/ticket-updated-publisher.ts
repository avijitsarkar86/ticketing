import { Publisher, Subjects, TicketUpdatedEvent } from '@avitickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
