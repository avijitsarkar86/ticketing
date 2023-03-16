import { Publisher, Subjects, TicketCreatedEvent } from '@avitickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
