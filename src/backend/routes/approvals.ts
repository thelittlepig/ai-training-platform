import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { listApprovals, processApproval } from '../controllers/approvals.controller';

const router = Router();

router.get('/', authenticate, authorize('admin'), listApprovals);
router.patch('/:id', authenticate, authorize('admin'), processApproval);

export default router;
