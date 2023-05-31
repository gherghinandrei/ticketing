import { Listener, OrderCreatedEvent, Subjects } from '@ghergtickets/common';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log('waiting this many milliseconds to process this job:', delay)
    await expirationQueue.add({
      orderId: data.id
    }, {
      delay: delay
    });

    msg.ack();
  }
}