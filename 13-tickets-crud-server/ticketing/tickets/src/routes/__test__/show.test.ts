import request from 'supertest';
import { app } from '../../app';

it('returns a 404 if the ticket is not found', async () => {
  await request(app).get('/api/tickets/lkasdf230vca').send().expect(404);
});

it('returns the ticket if the ticket is found', async () => {
  // Option #1: Create a ticket in the database
  // Ticket.build({
  //   title: 'concert',
  //   price: 20,
  //   userId: 'asdf',
  // }).save();

  // Option #2: Create a ticket using the API
  const title = 'concert';
  const price = 20;

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
