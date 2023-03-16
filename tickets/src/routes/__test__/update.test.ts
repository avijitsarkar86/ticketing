import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

import { natsWrapper } from '../../nats-wrapper';

const createTicket = (cookie?: null | string[]) => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', cookie || global.signin())
    .send({
      title: 'new ticket title',
      price: 10,
    });
};

it('should return 404 if the given id does not exists', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'sadfas',
      price: 10,
    })
    .expect(404);
});

it('should return 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'sadfas',
      price: 10,
    })
    .expect(401);
});

it('should return 401 if the user does not own the ticket', async () => {
  const response = await createTicket();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'asdfasdf asd f',
      price: 10,
    })
    .expect(401);
});

it('should return 400 if user provides an invalid title or price', async () => {
  const cookie = global.signin();
  const response = await createTicket(cookie);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      price: 10,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 10,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'valid title',
      price: -10,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'valid title',
    })
    .expect(400);
});

it('should update the ticket provided valid input', async () => {
  const cookie = global.signin();
  const response = await createTicket(cookie);

  const title = 'updated ticket title';
  const price = 100.59;

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title,
      price,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});

it('should publish an event after update', async () => {
  const cookie = global.signin();
  const response = await createTicket(cookie);

  const title = 'updated ticket title';
  const price = 100.59;

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title,
      price,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('should rejects update if ticket is already reserved', async () => {
  const cookie = global.signin();
  const response = await createTicket(cookie);

  const ticket = await Ticket.findById(response.body.id);
  ticket?.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket?.save();

  const title = 'updated ticket title';
  const price = 100.59;

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title,
      price,
    })
    .expect(400);
});
