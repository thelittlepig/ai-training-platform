import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { listUsers, findUserById, updateUserRole } from '../models/user.model';

const router = Router();

router.get('/me', authenticate, async (req, res) => {
  const user = await findUserById((req as any).user.id);
  res.json({ code: 200, message: 'OK', data: user });
});

router.get('/', authenticate, authorize('admin'), async (_req, res) => {
  const users = await listUsers();
  res.json({ code: 200, message: 'OK', data: users });
});

router.patch('/:id/role', authenticate, authorize('admin'), async (req, res) => {
  await updateUserRole(req.params.id, req.body.role);
  res.json({ code: 200, message: 'Updated', data: null });
});

export default router;
