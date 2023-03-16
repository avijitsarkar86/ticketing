import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async () => {
  // creat an instance of a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 123,
    userId: 'eawrq3423',
  });
  // save the ticket to the database
  await ticket.save();

  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // make two separate changes to the fetched tickets
  firstInstance?.set({ price: 10 });
  secondInstance?.set({ price: 20 });

  // save the first fetched ticket
  await firstInstance?.save();

  // save the second fetched ticket and expect an error
  try {
    await secondInstance?.save();
  } catch (err) {
    return;
  }

  throw new Error('test should not reach this point');
});

it('should increment the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'test',
    price: 10,
    userId: 'qwe2342432dasd',
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);
});
