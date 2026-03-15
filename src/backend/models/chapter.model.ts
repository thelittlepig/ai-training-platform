import { query } from '../db';
import { Chapter } from '../../shared/types';

export const createChapter = async (
  courseId: string,
  title: string,
  content: string,
  order: number
): Promise<Chapter> => {
  const result = await query(
    'INSERT INTO chapters (course_id, title, content, "order") VALUES ($1, $2, $3, $4) RETURNING *',
    [courseId, title, content, order]
  );
  return result.rows[0];
};

export const listChaptersByCourse = async (courseId: string): Promise<Chapter[]> => {
  const result = await query('SELECT * FROM chapters WHERE course_id = $1 ORDER BY "order" ASC', [courseId]);
  return result.rows;
};

export const findChapterById = async (id: string): Promise<Chapter | null> => {
  const result = await query('SELECT * FROM chapters WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const updateChapter = async (id: string, updates: Partial<Chapter>): Promise<void> => {
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (updates.title !== undefined) {
    fields.push(`title = $${paramIndex++}`);
    values.push(updates.title);
  }
  if (updates.content !== undefined) {
    fields.push(`content = $${paramIndex++}`);
    values.push(updates.content);
  }
  if (updates.order !== undefined) {
    fields.push(`"order" = $${paramIndex++}`);
    values.push(updates.order);
  }

  if (fields.length === 0) return;

  values.push(id);
  await query(`UPDATE chapters SET ${fields.join(', ')} WHERE id = $${paramIndex}`, values);
};

export const deleteChapter = async (id: string): Promise<void> => {
  await query('DELETE FROM chapters WHERE id = $1', [id]);
};
