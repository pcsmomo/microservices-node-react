import request from 'supertest';
import { OrderStatus } from '@dwktickets/common';
import { app } from '../../app';
import { Order } from '../../models/order';
import { stripe } from '../../stripe';

// comment this line if you want to use real stripe api
// and set the real the line in test/setup.ts and change __mocks__/stripe.ts to stripe.ts.old
jest.mock('../../stripe');

it('returns a 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'alskdjf',
      orderId: global.generateId(),
    })
    .expect(404);
});

it('returns a 401 when purchasing an order that does not belong to the user', async () => {
  const order = Order.build({
    id: global.generateId(),
    userId: global.generateId(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'alskdjf',
      orderId: order.id,
    })
    .expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = global.generateId();
  const order = Order.build({
    id: global.generateId(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      orderId: order.id,
      token: 'alskdjf',
    })
    .expect(400);
});

it('returns a 201 with valid inputs (using mock stripe api)', async () => {
  const userId = global.generateId();
  const order = Order.build({
    id: global.generateId(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201);

  // uncomment this line if you want to use mock stripe api
  // console.log((stripe.charges.create as jest.Mock).mock.calls);
  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.source).toEqual('tok_visa');
  expect(chargeOptions.amount).toEqual(20 * 100);
  expect(chargeOptions.currency).toEqual('aud');
});

it.skip('returns a 201 with valid inputs (using real stripe api)', async () => {
  // it is using the real stripe api
  // so you need to set the STRIPE_KEY env variable in src/test/setup.ts
  // it would be slower than using mock stripe api but it is more realistic
  const userId = global.generateId();
  const price = Math.floor(Math.random() * 1000);
  const order = Order.build({
    id: global.generateId(),
    userId,
    version: 0,
    price: price,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find(charge => {
    return charge.amount === price * 100;
  });

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual('aud');
});
