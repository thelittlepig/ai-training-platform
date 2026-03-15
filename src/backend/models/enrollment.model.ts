import { query } from '../db';
import { Enrollment, EnrollmentStatus } from '../../shared/types';

export const createEnrollment = async (userId: string, courseId: string, enrollmentInfo?: any): Promise<Enrollment> => {
  const result = await query(
    'INSERT INTO enrollments (user_id, course_id, status, progress, enrollment_info) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [userId, courseId, 'pending', 0, enrollmentInfo || null]
  );
  return result.rows[0];
};

export const listEnrollmentsByUser = async (userId: string): Promise<Enrollment[]> => {
  const result = await query('SELECT * FROM enrollments WHERE user_id = $1 ORDER BY enrolled_at DESC', [userId]);
  return result.rows;
};

export const listEnrollmentsByCourse = async (courseId: string): Promise<Enrollment[]> => {
  const result = await query('SELECT * FROM enrollments WHERE course_id = $1 ORDER BY enrolled_at DESC', [courseId]);
  return result.rows;
};

export const findEnrollmentById = async (id: string): Promise<Enrollment | null> => {
  const result = await query('SELECT * FROM enrollments WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const updateEnrollmentStatus = async (id: string, status: EnrollmentStatus): Promise<void> => {
  await query('UPDATE enrollments SET status = $1 WHERE id = $2', [status, id]);
};

export const updateEnrollmentProgress = async (id: string, progress: number): Promise<void> => {
  await query('UPDATE enrollments SET progress = $1 WHERE id = $2', [progress, id]);
};
