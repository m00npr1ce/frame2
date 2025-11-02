import express from 'express';
import { z } from 'zod';
import * as orderController from '../controllers/orderController.js';
import { authenticate } from '../middleware/auth.js';
import { createOrderSchema, updateStatusSchema, paginationSchema } from '../validators/order.js';

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

// All routes require authentication
router.use(authenticate);

router.post('/v1/orders', validate(createOrderSchema), orderController.createOrder);
router.get('/v1/orders', validateQuery(paginationSchema), orderController.getOrders);
router.get('/v1/orders/:id', orderController.getOrder);
router.put('/v1/orders/:id/status', validate(updateStatusSchema), orderController.updateOrderStatus);
router.delete('/v1/orders/:id', orderController.deleteOrder);

export default router;


