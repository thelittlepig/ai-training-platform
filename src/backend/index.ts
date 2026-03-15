import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import coursesRouter from './routes/courses';
import resourcesRouter from './routes/resources';
import enrollmentsRouter from './routes/enrollments';
import approvalsRouter from './routes/approvals';
import usersRouter from './routes/users';
import downloadsRouter from './routes/downloads';
import { testConnection } from './db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS 配置
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// 路由
app.use('/api/auth', authRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/resources', resourcesRouter);
app.use('/api/enrollments', enrollmentsRouter);
app.use('/api/approvals', approvalsRouter);
app.use('/api/users', usersRouter);
app.use('/api/downloads', downloadsRouter);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 启动服务器前测试数据库连接
const startServer = async () => {
  const dbTest = await testConnection();
  console.log(dbTest.message);

  if (!dbTest.success) {
    console.error('Failed to connect to database. Server will not start.');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();

export default app;
