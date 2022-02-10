import express from 'express';
import * as authController from '../controller/auth.js';
import { body } from 'express-validator';
import { validate } from '../middleware/validator.js';

import { isAuth } from '../middleware/auth.js';
const router = express.Router();

const validateCredential = [
  body('password')
    .trim()
    .isLength({ min: 5 })
    .withMessage('password should be at least 5 characters'),
  validate,
];

const validateSignup = [
  ...validateCredential,
  body('password').notEmpty().withMessage('password is missing'),
  body('email').isEmail().normalizeEmail().withMessage('invalid email'),

  validate,
];

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/me', isAuth, authController.me);

export default router;
