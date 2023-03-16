import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { BadRequestError, validateRequest } from '@avitickets/common';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 to 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // ======= validation code moved to the validateRequest middleware
    // ======= to overcome code duplication

    // const errors = validationResult(req);

    // if (!errors.isEmpty()) {
    //   throw new RequestValidationError(errors.array());
    // }
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email already in use');
    }

    const user = User.build({ email, password });
    await user.save();

    // Generate jwt
    const userJWT = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY! // '!' added to ignore typescript error, already checked in index.ts file
    );

    // Store jwt in session
    req.session = {
      jwt: userJWT,
    };

    // console.log('req.session: ', req.session);

    res.status(201).send(user);
  }
);

export { router as signUpRouter };
