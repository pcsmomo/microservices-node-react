import express from 'express';

// Middlewares
// import { currentUser } from '@dwktickets/common';
import { currentUser } from '@dwktickets/common/build/middlewares';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
