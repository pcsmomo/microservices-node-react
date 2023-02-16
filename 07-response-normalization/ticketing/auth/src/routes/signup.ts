import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User signup API
 * /api/users/signup:
 *   post:
 *     summary: Signup a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The signed up user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 *
 */
router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // This is javascript land (not ts)
      const error = new Error('Invalid email or password');
      error.reasons = errors.array();
      throw error;
    }

    console.log('Creating a user...');
    throw new Error('Error connecting to database');

    res.send({});
  }
);

export { router as signupRouter };

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: user email
 *         password:
 *           type: string
 *           description: user password
 *       example:
 *         email: test@test.com
 *         password: 12345678
 */
