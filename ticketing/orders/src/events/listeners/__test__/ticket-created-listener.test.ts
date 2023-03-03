import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { TicketCreatedEvent } from '@dwktickets/common';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedListener } from '../ticket-created-listener';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // create a fake data event
  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: 'concert',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create a fake message object
  // we don't want to define the entire Message object, so we'll use a @ts-ignore
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return all of this stuff
  return { listener, data, msg };
};

it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a ticket was created!
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
  // call the onMessage function with the data object + message object
  // write assertions to make sure ack function is called
});
