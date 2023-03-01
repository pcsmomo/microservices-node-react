import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';

// Models
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';

it('returns an error if the ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId })
    .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  // Create an order which means the ticket is reserved
  const order = Order.build({
    ticket,
    userId: 'laskdflkajsdf',
    status: OrderStatus.Created,
    expiresAt: new Date(), // This is not important for this test
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserves a ticket', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(response.body.ticket.id).toEqual(ticket.id);
  expect(response.body.status).toEqual(OrderStatus.Created);
  expect(response.body.expiresAt).toBeDefined();
  expect(response.body.userId).toBeDefined();
});

it.todo('emit an order created event');
