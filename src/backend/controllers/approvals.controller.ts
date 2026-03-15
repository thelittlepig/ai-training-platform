import { Request, Response } from 'express';
import { listPendingApprovals, updateApprovalStatus } from '../models/approval.model';
import { updateUserStatus } from '../models/user.model';
import { updateEnrollmentStatus } from '../models/enrollment.model';

export const listApprovals = async (req: Request, res: Response) => {
  try {
    const approvals = await listPendingApprovals();

    return res.json({
      code: 200,
      message: 'OK',
      data: approvals,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: 'Internal server error',
      data: null,
    });
  }
};

export const processApproval = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const approvalId = req.params.id;
    const reviewerId = (req as any).user.id;

    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        code: 400,
        message: 'Invalid status',
        data: null,
      });
    }

    // 先获取审批信息
    const { findApprovalById } = await import('../models/approval.model');
    const approval = await findApprovalById(approvalId);

    if (!approval) {
      return res.status(404).json({
        code: 404,
        message: 'Approval not found',
        data: null,
      });
    }

    // 更新审批状态
    await updateApprovalStatus(approvalId, status, reviewerId);

    // 如果审批通过，更新相关记录
    if (status === 'approved') {
      if (approval.type === 'registration') {
        // 更新用户状态为 active
        await updateUserStatus(approval.user_id, 'active');
      } else if (approval.type === 'enrollment' && approval.ref_id) {
        // 更新报名状态为 approved
        await updateEnrollmentStatus(approval.ref_id, 'approved');
      }
    }

    return res.json({
      code: 200,
      message: `Approval ${status}`,
      data: null,
    });
  } catch (error) {
    console.error('Process approval error:', error);
    return res.status(500).json({
      code: 500,
      message: 'Internal server error',
      data: null,
    });
  }
};
