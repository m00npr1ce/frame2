import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import pino from 'pino';
import pinoHttp from 'pino-http';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import yaml from 'js-yaml';

dotenv.config();

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const app = express();
const PORT = process.env.PORT || 3000;

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const USERS_SERVICE_URL = process.env.USERS_SERVICE_URL || 'http://localhost:3001';
const ORDERS_SERVICE_URL = process.env.ORDERS_SERVICE_URL || 'http://localhost:3002';

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Swagger UI setup
try {
  // Try container path first, then local development path
  const openApiPath = process.env.NODE_ENV === 'production' 
    ? '/app/docs/openapi.yaml'
    : join(__dirname, '../../docs/openapi.yaml');
  const openApiContent = readFileSync(openApiPath, 'utf8');
  const openApiSpec = yaml.load(openApiContent);
  
  // Swagger UI options
  const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Construction Company API Documentation',
    customfavIcon: '/favicon.ico'
  };
  
  app.use('/api-docs', swaggerUi.serve);
  app.get('/api-docs', swaggerUi.setup(openApiSpec, swaggerOptions));
  
  // JSON endpoint for OpenAPI spec
  app.get('/api-docs.json', (req, res) => {
    res.json(openApiSpec);
  });
  
  logger.info('Swagger UI available at /api-docs');
} catch (error) {
  logger.warn({ error }, 'Failed to load OpenAPI specification, Swagger UI will not be available');
}

// Informational root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      service: 'Construction Company API Gateway',
      documentation: '/api-docs',
      status: 'online'
    }
  });
});

// Request ID middleware
app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] || uuidv4();
  res.setHeader('X-Request-ID', req.id);
  next();
});

// Logging middleware
app.use(pinoHttp({ logger }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP, please try again later.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// JWT verification middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'No token provided'
      }
    });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired token'
      }
    });
  }
};

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

// Public routes (no auth required)
app.use('/users/v1/register', createProxyMiddleware({
  target: USERS_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/users': '' },
  timeout: 30000,
  proxyTimeout: 30000,
  onProxyReq: (proxyReq, req) => {
    if (req.id) {
      proxyReq.setHeader('X-Request-ID', req.id);
    }
  },
  onError: (err, req, res) => {
    logger.error({ err, req: { id: req.id } }, 'Proxy error');
    if (!res.headersSent) {
      res.status(502).json({
        success: false,
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Users service is unavailable'
        }
      });
    }
  }
}));

app.use('/users/v1/login', createProxyMiddleware({
  target: USERS_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/users': '' },
  timeout: 30000,
  proxyTimeout: 30000,
  onProxyReq: (proxyReq, req) => {
    if (req.id) {
      proxyReq.setHeader('X-Request-ID', req.id);
    }
  },
  onError: (err, req, res) => {
    logger.error({ err, req: { id: req.id } }, 'Proxy error');
    if (!res.headersSent) {
      res.status(502).json({
        success: false,
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Users service is unavailable'
        }
      });
    }
  }
}));

// Protected routes - Users Service
app.use('/users', verifyToken, createProxyMiddleware({
  target: USERS_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/users': '' },
  timeout: 30000,
  proxyTimeout: 30000,
  onProxyReq: (proxyReq, req) => {
    if (req.id) {
      proxyReq.setHeader('X-Request-ID', req.id);
    }
    if (req.user) {
      proxyReq.setHeader('X-User-ID', req.user.userId);
      proxyReq.setHeader('X-User-Roles', JSON.stringify(req.user.roles || []));
    }
  },
  onError: (err, req, res) => {
    logger.error({ err, req: { id: req.id } }, 'Proxy error');
    if (!res.headersSent) {
      res.status(502).json({
        success: false,
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Users service is unavailable'
        }
      });
    }
  }
}));

// Protected routes - Orders Service
app.use('/orders', verifyToken, createProxyMiddleware({
  target: ORDERS_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/orders': '' },
  timeout: 30000,
  proxyTimeout: 30000,
  onProxyReq: (proxyReq, req) => {
    if (req.id) {
      proxyReq.setHeader('X-Request-ID', req.id);
    }
    if (req.user) {
      proxyReq.setHeader('X-User-ID', req.user.userId);
      proxyReq.setHeader('X-User-Roles', JSON.stringify(req.user.roles || []));
    }
  },
  onError: (err, req, res) => {
    logger.error({ err, req: { id: req.id } }, 'Proxy error');
    if (!res.headersSent) {
      res.status(502).json({
        success: false,
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Orders service is unavailable'
        }
      });
    }
  }
}));

// Error handling
app.use((err, req, res, next) => {
  logger.error({ err, req: { id: req.id } }, 'Unhandled error');
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found'
    }
  });
});

app.listen(PORT, () => {
  logger.info({ port: PORT }, 'API Gateway started');
});

