import { OrderCreatedEvent, Publisher, Subjects } from '@ghergtickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}