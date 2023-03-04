import { OrderCreatedEvent, OrderStatus } from '@dwktickets/common';
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: 'alskdjf',
  });
  await ticket.save();

  // Create a fake data event
  const data: OrderCreatedEvent['data'] = {
    id: global.generateId(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'alskdjf',
    expiresAt: 'alskdjf',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it('sets the userId of the ticket', async () => {
  const { listener, data, msg, ticket } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  // expect(natsWrapper.client.publish).toHaveBeenCalled();

  // @ts-ignore
  // console.log(natsWrapper.client.publish.mock.calls);
  // this.client.publish(this.subject, JSON.stringify(data), callback) on common/src/events/base-publisher.ts
  // [
  //   [
  //     'ticket:updated',
  //     '{"id":"64031aaa3e9d2ce1a4e42986","version":1,"title":"concert","price":99,"userId":"alskdjf","orderId":"64031aaa3e9d2ce1a4e42988"}',
  //     [Function (anonymous)]
  //   ]
  // ]

  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(ticketUpdatedData.orderId).toEqual(data.id);
});
