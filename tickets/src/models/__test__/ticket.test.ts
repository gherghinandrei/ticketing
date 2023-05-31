import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async () => {
  // create an instance of a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123'
  });

  // save the ticket to the databse
  await ticket.save();

  // fetch the ticket twice
  const firstInsance = await Ticket.findById(ticket.id);
  const secondInsance = await Ticket.findById(ticket.id);
  
  // make two separate changes to the ticket we fetched
  firstInsance!.set({ price: 10 });
  secondInsance!.set({ price: 15 });
  
  // save the first fetched ticket
  await firstInsance!.save();

  // save the second fetched ticket and expect an error
  try{
    await secondInsance!.save();
  } catch(err) {
    return;
  }

  throw new Error('Should not reach this point');

});


it('increments the version number on multiple saves',async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: '123'
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});