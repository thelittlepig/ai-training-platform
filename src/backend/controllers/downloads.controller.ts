import { Request, Response } from 'express';
import { query } from '../db';

export const createDownload = async (req: Request, res: Response) => {
  try {
    const { resource_id } = req.body;
    const userId = (req as any).user.id;
    if (!resource_id) {
      return res.status(400).json({ code: 400, message: 'resource_id is required', data: null });
    }
    const result = await query(
      'INSERT INTO downloads (user_id, resource_id) VALUES ($1, $2) RETURNING *',
      [userId, resource_id]
    );
    return res.status(201).json({ code: 201, message: 'Download recorded', data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ code: 500, message: 'Internal server error', data: null });
  }
};

export const getMyDownloads = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const result = await query('SELECT * FROM downloads WHERE user_id = $1', [userId]);
    return res.json({ code: 200, message: 'OK', data: result.rows });
  } catch (error) {
    return res.status(500).json({ code: 500, message: 'Internal server error', data: null });
  }
};
