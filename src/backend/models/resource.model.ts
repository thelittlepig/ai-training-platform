import { query } from '../db';
import { Resource } from '../../shared/types';

export const createResource = async (
  title: string,
  description: string,
  fileUrl: string,
  fileType: string,
  fileSize: number,
  uploadedBy: string,
  isPublic: boolean
): Promise<Resource> => {
  const result = await query(
    'INSERT INTO resources (title, description, file_url, file_type, file_size, uploaded_by, is_public) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [title, description, fileUrl, fileType, fileSize, uploadedBy, isPublic]
  );
  return result.rows[0];
};

export const listResources = async (): Promise<Resource[]> => {
  const result = await query('SELECT * FROM resources ORDER BY created_at DESC');
  return result.rows;
};

export const findResourceById = async (id: string): Promise<Resource | null> => {
  const result = await query('SELECT * FROM resources WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const deleteResource = async (id: string): Promise<void> => {
  await query('DELETE FROM resources WHERE id = $1', [id]);
};
