import pool from '../db.js';
import pino from 'pino';

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

export const createOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { items } = req.body;

    // Calculate total amount (simplified - in real app would fetch prices from product service)
    const totalAmount = items.reduce((sum, item) => {
      // Mock price calculation - in real app would fetch from product catalog
      const itemPrice = 100; // placeholder price
      return sum + (itemPrice * item.quantity);
    }, 0);

    const result = await pool.query(
      `INSERT INTO orders (user_id, items, status, total_amount)
       VALUES ($1, $2, $3, $4)
       RETURNING id, user_id, items, status, total_amount, created_at, updated_at`,
      [userId, JSON.stringify(items), 'created', totalAmount]
    );

    const order = result.rows[0];

    logger.info({ orderId: order.id, userId }, 'Order created');

    res.status(201).json({
      success: true,
      data: {
        id: order.id,
        userId: order.user_id,
        items: order.items,
        status: order.status,
        totalAmount: parseFloat(order.total_amount),
        createdAt: order.created_at,
        updatedAt: order.updated_at
      }
    });
  } catch (error) {
    logger.error({ error, req: { id: req.id } }, 'Create order error');
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create order'
      }
    });
  }
};

export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const isAdmin = req.userRoles?.includes('admin');

    const query = isAdmin
      ? 'SELECT * FROM orders WHERE id = $1'
      : 'SELECT * FROM orders WHERE id = $1 AND user_id = $2';
    
    const params = isAdmin ? [id] : [id, userId];

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ORDER_NOT_FOUND',
          message: 'Order not found'
        }
      });
    }

    const order = result.rows[0];

    res.json({
      success: true,
      data: {
        id: order.id,
        userId: order.user_id,
        items: order.items,
        status: order.status,
        totalAmount: parseFloat(order.total_amount),
        createdAt: order.created_at,
        updatedAt: order.updated_at
      }
    });
  } catch (error) {
    logger.error({ error, req: { id: req.id } }, 'Get order error');
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get order'
      }
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const isAdmin = req.userRoles?.includes('admin');
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = req.query;
    const offset = (page - 1) * limit;

    // Build query
    let query = 'SELECT * FROM orders';
    let countQuery = 'SELECT COUNT(*) FROM orders';
    const params = [];
    let paramCount = 1;

    if (!isAdmin) {
      query += ` WHERE user_id = $${paramCount}`;
      countQuery += ` WHERE user_id = $${paramCount}`;
      params.push(userId);
      paramCount++;
    }

    // Validate sortBy
    const validSortColumns = ['created_at', 'total_amount', 'status'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const sortDirection = sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    query += ` ORDER BY ${sortColumn} ${sortDirection} LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const [result, countResult] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery, isAdmin ? [] : [userId])
    ]);

    const total = parseInt(countResult.rows[0].count, 10);

    res.json({
      success: true,
      data: {
        orders: result.rows.map(order => ({
          id: order.id,
          userId: order.user_id,
          items: order.items,
          status: order.status,
          totalAmount: parseFloat(order.total_amount),
          createdAt: order.created_at,
          updatedAt: order.updated_at
        })),
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    logger.error({ error, req: { id: req.id } }, 'Get orders error');
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get orders'
      }
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.userId;
    const isAdmin = req.userRoles?.includes('admin');

    // Check if order exists and user has permission
    const checkQuery = isAdmin
      ? 'SELECT * FROM orders WHERE id = $1'
      : 'SELECT * FROM orders WHERE id = $1 AND user_id = $2';
    
    const checkParams = isAdmin ? [id] : [id, userId];
    const checkResult = await pool.query(checkQuery, checkParams);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ORDER_NOT_FOUND',
          message: 'Order not found'
        }
      });
    }

    const order = checkResult.rows[0];

    // Only allow cancellation for non-admins, admins can change any status
    if (!isAdmin && status !== 'cancelled') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Only admins can change order status to non-cancelled'
        }
      });
    }

    // Prevent changing status of cancelled or completed orders (unless admin)
    if (!isAdmin && (order.status === 'cancelled' || order.status === 'completed')) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_STATUS_CHANGE',
          message: 'Cannot change status of cancelled or completed orders'
        }
      });
    }

    const result = await pool.query(
      `UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, user_id, items, status, total_amount, created_at, updated_at`,
      [status, id]
    );

    const updatedOrder = result.rows[0];

    logger.info({ orderId: id, status, userId }, 'Order status updated');

    res.json({
      success: true,
      data: {
        id: updatedOrder.id,
        userId: updatedOrder.user_id,
        items: updatedOrder.items,
        status: updatedOrder.status,
        totalAmount: parseFloat(updatedOrder.total_amount),
        createdAt: updatedOrder.created_at,
        updatedAt: updatedOrder.updated_at
      }
    });
  } catch (error) {
    logger.error({ error, req: { id: req.id } }, 'Update order status error');
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update order status'
      }
    });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const isAdmin = req.userRoles?.includes('admin');

    // Check if order exists and user has permission
    const checkQuery = isAdmin
      ? 'SELECT * FROM orders WHERE id = $1'
      : 'SELECT * FROM orders WHERE id = $1 AND user_id = $2';
    
    const checkParams = isAdmin ? [id] : [id, userId];
    const checkResult = await pool.query(checkQuery, checkParams);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ORDER_NOT_FOUND',
          message: 'Order not found'
        }
      });
    }

    const order = checkResult.rows[0];

    // Only allow deletion of created or cancelled orders
    if (!isAdmin && order.status !== 'created' && order.status !== 'cancelled') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_DELETION',
          message: 'Can only delete orders with status "created" or "cancelled"'
        }
      });
    }

    await pool.query('DELETE FROM orders WHERE id = $1', [id]);

    logger.info({ orderId: id, userId }, 'Order deleted');

    res.json({
      success: true,
      data: { message: 'Order deleted successfully' }
    });
  } catch (error) {
    logger.error({ error, req: { id: req.id } }, 'Delete order error');
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to delete order'
      }
    });
  }
};


