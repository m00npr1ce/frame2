import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import * as userController from '../controllers/userController.js';
import pool from '../db.js';
import bcrypt from 'bcrypt';

// Mock database
jest.mock('../db.js', () => ({
  query: jest.fn()
}));

describe('User Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      userId: 'test-user-id',
      id: 'test-request-id'
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };

      pool.query
        .mockResolvedValueOnce({ rows: [] }) // Check existing user
        .mockResolvedValueOnce({
          rows: [{
            id: 'user-id',
            email: 'test@example.com',
            name: 'Test User',
            roles: ['user'],
            created_at: new Date(),
            updated_at: new Date()
          }]
        });

      await userController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            user: expect.objectContaining({
              email: 'test@example.com'
            })
          })
        })
      );
    });

    it('should return error if user already exists', async () => {
      req.body = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Test User'
      };

      pool.query.mockResolvedValueOnce({
        rows: [{ id: 'existing-user-id' }]
      });

      await userController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'USER_EXISTS'
          })
        })
      );
    });
  });

  describe('login', () => {
    it('should login user with valid credentials', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'password123'
      };

      // Mock bcrypt compare
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      pool.query.mockResolvedValueOnce({
        rows: [{
          id: 'user-id',
          email: 'test@example.com',
          password_hash: 'hashed-password',
          name: 'Test User',
          roles: ['user']
        }]
      });

      await userController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            user: expect.objectContaining({
              email: 'test@example.com'
            }),
            token: expect.any(String)
          })
        })
      );
    });

    it('should return error with invalid credentials', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      pool.query.mockResolvedValueOnce({ rows: [] });

      await userController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'INVALID_CREDENTIALS'
          })
        })
      );
    });
  });
});

