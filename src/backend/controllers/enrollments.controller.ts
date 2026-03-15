import { Request, Response } from 'express';
import { createEnrollment, listEnrollmentsByUser, updateEnrollmentStatus } from '../models/enrollment.model';
import { createApprovalRequest } from '../models/approval.model';

export const enrollCourse = async (req: Request, res: Response) => {
  try {
    const { course_id, enrollment_info } = req.body;
    const userId = (req as any).user.id;

    if (!course_id) {
      return res.status(400).json({
        code: 400,
        message: 'Course ID is required',
        data: null,
      });
    }

    const enrollment = await createEnrollment(userId, course_id, enrollment_info || null);
    await createApprovalRequest(userId, 'enrollment', enrollment.id);

    return res.status(201).json({
      code: 201,
      message: 'Enrollment request submitted',
      data: enrollment,
    });
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(409).json({
        code: 409,
        message: 'Already enrolled in this course',
        data: null,
      });
    }
    return res.status(500).json({
      code: 500,
      message: 'Internal server error',
      data: null,
    });
  }
};

export const getMyEnrollments = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const enrollments = await listEnrollmentsByUser(userId);

    return res.json({
      code: 200,
      message: 'OK',
      data: enrollments,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: 'Internal server error',
      data: null,
    });
  }
};

export const approveEnrollment = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const enrollmentId = req.params.id;

    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        code: 400,
        message: 'Invalid status',
        data: null,
      });
    }

    await updateEnrollmentStatus(enrollmentId, status);

    return res.json({
      code: 200,
      message: `Enrollment ${status}`,
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
