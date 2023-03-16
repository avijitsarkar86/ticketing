import { randomBytes } from 'crypto';
import nats, { Message, Stan } from 'node-nats-streaming';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

// random string used to generate client id, to support multiple instance
// of the listener running on the server at the same time
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed');
    process.exit();
  });

  new TicketCreatedListener(stan).listen();

  // const options = stan.subscriptionOptions().setManualAckMode(true);

  // queue-group: used to receive message in only one instance at a time
  // from a specific publisher
  // const subscription = stan.subscribe(
  //   'ticket:created',
  //   'some-queue-group',
  //   options
  // );

  // subscription.on('message', (msg: Message) => {
  //   const data = msg.getData();

  //   if (typeof data === 'string') {
  //     console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
  //   }

  //   // to notify message has been received and processed
  //   msg.ack();
  // });
});

// graceful shutdown of service
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
