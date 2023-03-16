import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log('Publisher connected to NATS');

  const publisher = new TicketCreatedPublisher(stan);

  try {
    await publisher.publish({
      id: '1a2b3c',
      title: 'concert',
      price: 20,
    });
  } catch (err) {
    console.error(err);
  }

  // information to publish
  // const data = JSON.stringify({
  //   id: '123',
  //   title: 'some ticket title',
  //   price: 15,
  // });

  // // console.log(data);

  // stan.publish('ticket:created', data, () => {
  //   console.log('Event published');
  // });
});
