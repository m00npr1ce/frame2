import { z } from 'zod';

export const createOrderSchema = z.object({
  items: z.array(
    z.object({
      product: z.string().min(1, 'Product name is required'),
      quantity: z.number().int().positive('Quantity must be positive')
    })
  ).min(1, 'At least one item is required'),
});

export const updateStatusSchema = z.object({
  status: z.enum(['created', 'in_progress', 'completed', 'cancelled'], {
    errorMap: () => ({ message: 'Invalid status. Must be one of: created, in_progress, completed, cancelled' })
  })
});

export const paginationSchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
  sortBy: z.enum(['created_at', 'total_amount', 'status']).optional().default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
}).refine(data => data.page > 0 && data.limit > 0 && data.limit <= 100, {
  message: 'Invalid pagination parameters'
});


