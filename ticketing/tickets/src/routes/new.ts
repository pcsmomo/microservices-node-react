import express, { Request, Response } from 'express';
import { body } from 'express-validator';

// Middleware
import { requireAuth, validateRequest } from '@dwktickets/common';

// Models
import { Ticket } from '../models/ticket';

// Event publisher
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';

const router = express.Router();

router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id, // it will be checked in requireAuth
      // we are confident so we can use ! to tell TS that we are sure that currentUser is defined
    });
    await ticket.save();
    new TicketCreatedPublisher(client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
