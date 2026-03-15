import { Request, Response } from 'express';
import { createCourse, listCourses, findCourseById, updateCourse, deleteCourse } from '../models/course.model';
import { createChapter, listChaptersByCourse, updateChapter, deleteChapter } from '../models/chapter.model';

export const createCourseHandler = async (req: Request, res: Response) => {
  try {
    const { title, description, cover_image } = req.body;
    const instructorId = (req as any).user.id;

    if (!title) {
      return res.status(400).json({
        code: 400,
        message: 'Title is required',
        data: null,
      });
    }

    const course = await createCourse(title, description || '', cover_image || '', instructorId);

    return res.status(201).json({
      code: 201,
      message: 'Course created',
      data: course,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: 'Internal server error',
      data: null,
    });
  }
};

export const listCoursesHandler = async (req: Request, res: Response) => {
  try {
    const status = req.query.status as any;
    const courses = await listCourses(status);

    return res.json({
      code: 200,
      message: 'OK',
      data: courses,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: 'Internal server error',
      data: null,
    });
  }
};

export const getCourseHandler = async (req: Request, res: Response) => {
  try {
    const course = await findCourseById(req.params.id);

    if (!course) {
      return res.status(404).json({
        code: 404,
        message: 'Course not found',
        data: null,
      });
    }

    const chapters = await listChaptersByCourse(course.id);

    return res.json({
      code: 200,
      message: 'OK',
      data: { ...course, chapters },
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: 'Internal server error',
      data: null,
    });
  }
};

export const updateCourseHandler = async (req: Request, res: Response) => {
  try {
    const { title, description, cover_image, status } = req.body;
    await updateCourse(req.params.id, { title, description, cover_image, status });

    return res.json({
      code: 200,
      message: 'Course updated',
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: 'Internal server error',
      data: null,
    });
  }
};

export const deleteCourseHandler = async (req: Request, res: Response) => {
  try {
    await deleteCourse(req.params.id);

    return res.json({
      code: 200,
      message: 'Course deleted',
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: 'Internal server error',
      data: null,
    });
  }
};

export const createChapterHandler = async (req: Request, res: Response) => {
  try {
    const { title, content, order } = req.body;
    const courseId = req.params.id;

    if (!title || order === undefined) {
      return res.status(400).json({
        code: 400,
        message: 'Title and order are required',
        data: null,
      });
    }

    const chapter = await createChapter(courseId, title, content || '', order);

    return res.status(201).json({
      code: 201,
      message: 'Chapter created',
      data: chapter,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: 'Internal server error',
      data: null,
    });
  }
};

export const updateChapterHandler = async (req: Request, res: Response) => {
  try {
    const { title, content, order } = req.body;
    await updateChapter(req.params.chapterId, { title, content, order });

    return res.json({
      code: 200,
      message: 'Chapter updated',
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: 'Internal server error',
      data: null,
    });
  }
};

export const deleteChapterHandler = async (req: Request, res: Response) => {
  try {
    await deleteChapter(req.params.chapterId);

    return res.json({
      code: 200,
      message: 'Chapter deleted',
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: 'Internal server error',
      data: null,
    });
  }
};
