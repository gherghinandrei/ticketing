import { PaymentCreatedEvent, Publisher, Subjects } from '@ghergtickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}



