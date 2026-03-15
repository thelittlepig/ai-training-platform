import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { enrollCourse, getMyEnrollments, approveEnrollment } from '../controllers/enrollments.controller';

const router = Router();

router.post('/', authenticate, enrollCourse);
router.get('/my', authenticate, getMyEnrollments);
router.patch('/:id', authenticate, approveEnrollment);

export default router;
