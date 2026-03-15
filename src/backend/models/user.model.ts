import { query } from '../db';
import { User, UserRole } from '../../shared/types';
import bcrypt from 'bcrypt';

export const createUser = async (
  name: string,
  email: string,
  password: string,
  inviteCode?: string
): Promise<User> => {
  const passwordHash = await bcrypt.hash(password, 10);

  // 如果提供了有效的邀请码，直接激活账号
  const status = inviteCode === 'cll123' ? 'active' : 'pending';

  const result = await query(
    'INSERT INTO users (name, email, password_hash, role, status) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, status, created_at',
    [name, email, passwordHash, 'learner', status]
  );
  return result.rows[0];
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const result = await query('SELECT id, name, email, password_hash, role, status, created_at FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
};

export const findUserById = async (id: string): Promise<User | null> => {
  const result = await query('SELECT id, name, email, role, status, created_at FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const verifyPassword = async (email: string, password: string): Promise<User | null> => {
  const result = await query('SELECT id, name, email, password_hash, role, status, created_at FROM users WHERE email = $1', [email]);
  const user = result.rows[0];
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) return null;

  delete user.password_hash;
  return user;
};

export const listUsers = async (): Promise<User[]> => {
  const result = await query('SELECT id, name, email, role, status, created_at FROM users ORDER BY created_at DESC');
  return result.rows;
};

export const updateUserRole = async (id: string, role: UserRole): Promise<void> => {
  await query('UPDATE users SET role = $1 WHERE id = $2', [role, id]);
};

export const updateUserStatus = async (id: string, status: string): Promise<void> => {
  await query('UPDATE users SET status = $1 WHERE id = $2', [status, id]);
};
