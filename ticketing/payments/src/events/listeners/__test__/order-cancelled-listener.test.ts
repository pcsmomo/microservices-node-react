import { Message } from 'node-nats-streaming';
import { OrderStatus, OrderCancelledEvent } from '@dwktickets/common';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Order, OrderDoc } from '../../../models/order';

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  // Create and save an order
  const order = Order.build({
    id: global.generateId(),
    version: 0,
    userId: 'alskdjf',
    price: 10,
    status: OrderStatus.Created,
  });
  await order.save();

  // Create a fake data event
  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: 'alskdjf',
    },
  };

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, data, msg };
};

it('updates the status of the order', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(data.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
