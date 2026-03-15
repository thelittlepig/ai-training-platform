import { query } from '../db';
import { Course, CourseStatus } from '../../shared/types';

export const createCourse = async (
  title: string,
  description: string,
  coverImage: string,
  instructorId: string
): Promise<Course> => {
  const result = await query(
    'INSERT INTO courses (title, description, cover_image, instructor_id, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [title, description, coverImage, instructorId, 'draft']
  );
  return result.rows[0];
};

export const listCourses = async (status?: CourseStatus): Promise<Course[]> => {
  if (status) {
    const result = await query('SELECT * FROM courses WHERE status = $1 ORDER BY created_at DESC', [status]);
    return result.rows;
  }
  const result = await query('SELECT * FROM courses ORDER BY created_at DESC');
  return result.rows;
};

export const findCourseById = async (id: string): Promise<Course | null> => {
  const result = await query('SELECT * FROM courses WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const updateCourse = async (id: string, updates: Partial<Course>): Promise<void> => {
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (updates.title !== undefined) {
    fields.push(`title = $${paramIndex++}`);
    values.push(updates.title);
  }
  if (updates.description !== undefined) {
    fields.push(`description = $${paramIndex++}`);
    values.push(updates.description);
  }
  if (updates.cover_image !== undefined) {
    fields.push(`cover_image = $${paramIndex++}`);
    values.push(updates.cover_image);
  }
  if (updates.status !== undefined) {
    fields.push(`status = $${paramIndex++}`);
    values.push(updates.status);
  }

  if (fields.length === 0) return;

  values.push(id);
  await query(`UPDATE courses SET ${fields.join(', ')} WHERE id = $${paramIndex}`, values);
};

export const deleteCourse = async (id: string): Promise<void> => {
  await query('DELETE FROM courses WHERE id = $1', [id]);
};
