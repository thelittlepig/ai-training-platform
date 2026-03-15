import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import {
  createCourseHandler,
  listCoursesHandler,
  getCourseHandler,
  updateCourseHandler,
  deleteCourseHandler,
  createChapterHandler,
  updateChapterHandler,
  deleteChapterHandler,
} from '../controllers/courses.controller';

const router = Router();

// 课程路由
router.get('/', listCoursesHandler);
router.get('/:id', getCourseHandler);
router.post('/', authenticate, authorize('instructor', 'admin'), createCourseHandler);
router.patch('/:id', authenticate, authorize('instructor', 'admin'), updateCourseHandler);
router.delete('/:id', authenticate, authorize('instructor', 'admin'), deleteCourseHandler);

// 章节路由
router.post('/:id/chapters', authenticate, authorize('instructor', 'admin'), createChapterHandler);
router.patch('/:id/chapters/:chapterId', authenticate, authorize('instructor', 'admin'), updateChapterHandler);
router.delete('/:id/chapters/:chapterId', authenticate, authorize('instructor', 'admin'), deleteChapterHandler);

export default router;
