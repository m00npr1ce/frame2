import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import * as orderController from '../controllers/orderController.js';
import pool from '../db.js';

// Mock database
jest.mock('../db.js', () => ({
  query: jest.fn()
}));

describe('Order Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
      userId: 'test-user-id',
      userRoles: ['user'],
      id: 'test-request-id'
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('createOrder', () => {
    it('should create an order successfully', async () => {
      req.body = {
        items: [
          { product: 'Concrete Mix', quantity: 10 },
          { product: 'Steel Bars', quantity: 5 }
        ]
      };

      pool.query.mockResolvedValueOnce({
        rows: [{
          id: 'order-id',
          user_id: 'test-user-id',
          items: req.body.items,
          status: 'created',
          total_amount: '1500.00',
          created_at: new Date(),
          updated_at: new Date()
        }]
      });

      await orderController.createOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            id: 'order-id',
            userId: 'test-user-id',
            status: 'created'
          })
        })
      );
    });
  });

  describe('getOrder', () => {
    it('should return order for authorized user', async () => {
      req.params.id = 'order-id';

      pool.query.mockResolvedValueOnce({
        rows: [{
          id: 'order-id',
          user_id: 'test-user-id',
          items: [],
          status: 'created',
          total_amount: '1000.00',
          created_at: new Date(),
          updated_at: new Date()
        }]
      });

      await orderController.getOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            id: 'order-id'
          })
        })
      );
    });

    it('should return 404 if order not found', async () => {
      req.params.id = 'non-existent-id';

      pool.query.mockResolvedValueOnce({ rows: [] });

      await orderController.getOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'ORDER_NOT_FOUND'
          })
        })
      );
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status successfully', async () => {
      req.params.id = 'order-id';
      req.body = { status: 'in_progress' };

      pool.query
        .mockResolvedValueOnce({
          rows: [{
            id: 'order-id',
            user_id: 'test-user-id',
            status: 'created'
          }]
        })
        .mockResolvedValueOnce({
          rows: [{
            id: 'order-id',
            user_id: 'test-user-id',
            items: [],
            status: 'in_progress',
            total_amount: '1000.00',
            created_at: new Date(),
            updated_at: new Date()
          }]
        });

      req.userRoles = ['admin'];

      await orderController.updateOrderStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            status: 'in_progress'
          })
        })
      );
    });
  });
});


