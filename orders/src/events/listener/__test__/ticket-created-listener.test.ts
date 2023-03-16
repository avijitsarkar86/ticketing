import { TicketCreatedEvent } from '@avitickets/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedListener } from '../ticket-created-listener';

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // create a fake data event
  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: 'test title',
    price: 123,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('should creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup();

  // call the 'onMessage' function with 'data' and 'msg' object
  await listener.onMessage(data, msg);

  // write assertion to make sure that a ticket has created
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket?.title).toEqual(data.title);
  expect(ticket?.price).toEqual(data.price);
});

it('should acks the message', async () => {
  const { listener, data, msg } = await setup();

  // call the 'onMessage' function with 'data' and 'msg' object
  await listener.onMessage(data, msg);

  // write assertion to make sure that 'ack' function is called
  expect(msg.ack).toHaveBeenCalled();
});
