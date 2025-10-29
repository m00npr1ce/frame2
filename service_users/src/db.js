import pg from 'pg';
import pino from 'pino';
import bcrypt from 'bcrypt';

const { Pool } = pg;
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'users_db',
  password: process.env.DB_PASSWORD || 'users_password',
  database: process.env.DB_NAME || 'users_db',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Create test accounts if they don't exist
const createTestAccounts = async () => {
  const testAccounts = [
    {
      email: 'user1@example.com',
      password: 'password123',
      name: 'User One',
      roles: ['user']
    },
    {
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Admin User',
      roles: ['user', 'admin']
    },
    {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      roles: ['user']
    }
  ];

  for (const account of testAccounts) {
    try {
      // Check if user already exists
      const existing = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [account.email]
      );

      if (existing.rows.length === 0) {
        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(account.password, saltRounds);

        // Create user
        await pool.query(
          `INSERT INTO users (email, password_hash, name, roles)
           VALUES ($1, $2, $3, $4::TEXT[])`,
          [account.email, passwordHash, account.name, account.roles]
        );

        logger.info({ email: account.email }, 'Test account created');
      } else {
        logger.debug({ email: account.email }, 'Test account already exists');
      }
    } catch (error) {
      logger.error({ error, email: account.email }, 'Failed to create test account');
      // Don't throw - continue with other accounts
    }
  }
};

// Initialize database schema
export const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        roles TEXT[] DEFAULT ARRAY['user']::TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_roles ON users USING GIN(roles);
    `);
    
    logger.info('Database schema initialized');

    // Create test accounts if they don't exist
    await createTestAccounts();
  } catch (error) {
    logger.error({ error }, 'Failed to initialize database');
    throw error;
  }
};

export default pool;


