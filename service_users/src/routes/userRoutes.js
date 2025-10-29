import express from 'express';
import { z } from 'zod';
import * as userController from '../controllers/userController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { registerSchema, loginSchema, updateProfileSchema, paginationSchema } from '../validators/user.js';

const router = express.Router();

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
          }
        });
      }
      next(error);
    }
  };
};

const validateQuery = (schema) => {
  return (req, res, next) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
          }
        });
      }
      next(error);
    }
  };
};

// Public routes
router.post('/v1/register', validate(registerSchema), userController.register);
router.post('/v1/login', validate(loginSchema), userController.login);

// Protected routes
router.get('/v1/profile', authenticate, userController.getProfile);
router.put('/v1/profile', authenticate, validate(updateProfileSchema), userController.updateProfile);
router.get('/v1/users', authenticate, requireAdmin, validateQuery(paginationSchema), userController.getUsers);

export default router;


