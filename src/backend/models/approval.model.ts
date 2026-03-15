import { query } from '../db';
import { ApprovalRequest, ApprovalType, ApprovalStatus } from '../../shared/types';

export const createApprovalRequest = async (
  userId: string,
  type: ApprovalType,
  refId?: string
): Promise<ApprovalRequest> => {
  const result = await query(
    'INSERT INTO approval_requests (user_id, type, ref_id, status) VALUES ($1, $2, $3, $4) RETURNING *',
    [userId, type, refId || null, 'pending']
  );
  return result.rows[0];
};

export const listPendingApprovals = async (): Promise<ApprovalRequest[]> => {
  const result = await query(
    'SELECT * FROM approval_requests WHERE status = $1 ORDER BY created_at ASC',
    ['pending']
  );
  return result.rows;
};

export const findApprovalById = async (id: string): Promise<ApprovalRequest | null> => {
  const result = await query('SELECT * FROM approval_requests WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const updateApprovalStatus = async (
  id: string,
  status: ApprovalStatus,
  reviewedBy: string
): Promise<void> => {
  await query(
    'UPDATE approval_requests SET status = $1, reviewed_by = $2, reviewed_at = CURRENT_TIMESTAMP WHERE id = $3',
    [status, reviewedBy, id]
  );
};
