import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import {
  createResourceHandler,
  listResourcesHandler,
  getResourceHandler,
  deleteResourceHandler,
  downloadResourceHandler,
} from '../controllers/resources.controller';

const router = Router();

router.get('/', listResourcesHandler);
router.get('/:id', getResourceHandler);
router.post('/', authenticate, authorize('instructor', 'admin'), createResourceHandler);
router.delete('/:id', authenticate, authorize('instructor', 'admin'), deleteResourceHandler);
router.get('/:id/download', authenticate, downloadResourceHandler);

export default router;
