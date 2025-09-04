const { Pool } = require('pg');
require('dotenv').config();

// Database configuration
const config = {
  development: {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  },
  test: {
    connectionString: process.env.DATABASE_TEST_URL,
    ssl: false,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
  production: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  }
};

// Create pool based on environment
const pool = new Pool(config[process.env.NODE_ENV || 'development']);

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
  process.exit(-1);
});

// Helper function to run queries
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('📊 Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('❌ Query error:', error);
    throw error;
  }
};

// Helper function to get a single row
const getRow = async (text, params) => {
  const res = await query(text, params);
  return res.rows[0];
};

// Helper function to get multiple rows
const getRows = async (text, params) => {
  const res = await query(text, params);
  return res.rows;
};

module.exports = {
  pool,
  query,
  getRow,
  getRows
};
