import { OrderCreatedEvent, OrderStatus } from '@avitickets/common';
import mongoose, { mongo } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // create and save a ticket
  const ticket = Ticket.build({
    title: 'test title',
    price: 123,
    userId: 'sads',
  });

  await ticket.save();

  // create a fake event
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'sadfasffdg',
    expiresAt: 'asdfsaf',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, ticket, msg };
};

it('should the orderId of the ticket', async () => {
  const { listener, data, ticket, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket?.orderId).toBeDefined();
  expect(updatedTicket?.orderId).toEqual(data.id);
});

it('should acks the message', async () => {
  const { listener, data, ticket, msg } = await setup();

  await listener.onMessage(data, msg);

  await Ticket.findById(ticket.id);

  expect(msg.ack).toHaveBeenCalled();
});

it('should not acks the message if ticket id not found', async () => {
  const { listener, data, msg, ticket } = await setup();

  data.ticket.id = new mongoose.Types.ObjectId().toHexString();
  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});

it('should publish a ticket updated event', async () => {
  const { listener, ticket, data, msg } = await setup();
  console.log('ticketId: ', ticket.id);
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[2][1]
  );

  expect(data.id).toEqual(ticketUpdatedData.orderId);
});
