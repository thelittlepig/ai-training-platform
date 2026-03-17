import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

// PostgreSQL 连接池
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// 测试数据库连接
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// 查询函数
export const query = async (text: string, params?: any[]): Promise<any> => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text: text.substring(0, 50), duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
};

// 数据库连接测试
export const testConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const result = await query('SELECT NOW()');
    return {
      success: true,
      message: `Database connected. Server time: ${result.rows[0].now}`,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Database connection failed: ${error.message}`,
    };
  }
};
