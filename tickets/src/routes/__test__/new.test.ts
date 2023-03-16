import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

import { natsWrapper } from '../../nats-wrapper';

it('should listening to route /api/tickets for POST request', async () => {
  const response = await request(app).post('/api/tickets').send({});
  expect(response.status).not.toEqual(404);
});

it('should only be accessed if the user is signed in', async () => {
  await request(app).post('/api/tickets').send({}).expect(401);
});

it('should return a status code other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({});
  // console.log('response.status: ', response.status);
  expect(response.status).not.toEqual(401);
});

it('should return an error if invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      price: 10,
    })
    .expect(400);
});

it('should return an error if invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'sdafas asd f',
      price: -10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'sdafas asd f',
    })
    .expect(400);
});

it('should create a ticket with valid inputs', async () => {
  // add in a check to make sure data is created
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const title = 'valid title';
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price: 10.5,
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].id).toBeDefined();
  expect(tickets[0].price).toEqual(10.5);
  expect(tickets[0].title).toEqual(title);
});

it('should publish an event', async () => {
  const title = 'valid title';
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price: 10.5,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
