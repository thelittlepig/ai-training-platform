import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function runMigrations() {
  try {
    console.log('🚀 开始执行数据库迁移...');

    // 1. 创建表结构
    console.log('📋 创建数据表...');
    const schemaFile = path.join(__dirname, '../src/backend/schema.sql');
    const schemaSql = fs.readFileSync(schemaFile, 'utf-8');
    await pool.query(schemaSql);
    console.log('✅ 数据表创建完成');

    // 2. 创建默认管理员
    console.log('👤 创建管理员账号...');
    const adminCheck = await pool.query('SELECT id FROM users WHERE email = $1', [
      'admin@example.com',
    ]);

    if (adminCheck.rows.length === 0) {
      const adminPassword = await bcryptjs.hash('admin123', 10);
      await pool.query(
        'INSERT INTO users (id, name, email, password_hash, role, status) VALUES ($1, $2, $3, $4, $5, $6)',
        ['admin-001', '系统管理员', 'admin@example.com', adminPassword, 'admin', 'active']
      );
      console.log('✅ 管理员账号创建成功: admin@example.com / admin123');
    } else {
      console.log('ℹ️  管理员账号已存在');
    }

    // 3. 插入演示数据（可选）
    const seedFile = path.join(__dirname, 'seed-demo-data.sql');
    if (fs.existsSync(seedFile)) {
      console.log('🌱 插入演示数据...');
      const seedSql = fs.readFileSync(seedFile, 'utf-8');
      await pool.query(seedSql);
      console.log('✅ 演示数据插入完成');
    }

    console.log('🎉 数据库迁移完成！');
    process.exit(0);
  } catch (error) {
    console.error('❌ 迁移失败:', error);
    process.exit(1);
  }
}

runMigrations();
