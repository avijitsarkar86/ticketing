import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from '@avitickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
