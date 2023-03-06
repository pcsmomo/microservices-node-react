import { OrderCreatedEvent, OrderStatus } from '@dwktickets/common';
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Order, OrderDoc } from '../../../models/order';

const setup = async () => {
  // Create an instance of the listener
  const Listener = new OrderCreatedListener(natsWrapper.client);

  // Create a fake data event
  const data: OrderCreatedEvent['data'] = {
    id: global.generateId(),
    version: 0,
    expiresAt: 'alskdjf',
    userId: 'alskdjf',
    status: OrderStatus.Created,
    ticket: {
      id: 'alskdjf',
      price: 10,
    },
  };

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { Listener, data, msg };
};

it('replicates the order info', async () => {
  const { Listener, data, msg } = await setup();

  await Listener.onMessage(data, msg);

  const order = (await Order.findById(data.id)) as OrderDoc;

  expect(order.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
  const { Listener, data, msg } = await setup();

  await Listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
