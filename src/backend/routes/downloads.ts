import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { createDownload, getMyDownloads } from '../controllers/downloads.controller';

const router = Router();

router.post('/', authenticate, createDownload);
router.get('/my', authenticate, getMyDownloads);

export default router;
