import { createEnrollment, listEnrollmentsByUser, updateEnrollmentStatus } from '../../src/backend/models/enrollment.model';
import { createApprovalRequest, listPendingApprovals, updateApprovalStatus } from '../../src/backend/models/approval.model';

// Mock database
jest.mock('../../src/backend/db', () => ({
  query: jest.fn(),
}));

import { query } from '../../src/backend/db';

describe('Enrollment Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create an enrollment', async () => {
    const mockEnrollment = {
      id: 'enrollment-123',
      user_id: 'user-123',
      course_id: 'course-123',
      status: 'pending',
      progress: 0,
      enrolled_at: new Date(),
    };

    (query as jest.Mock).mockResolvedValue({ rows: [mockEnrollment] });

    const result = await createEnrollment('user-123', 'course-123');
    expect(result).toEqual(mockEnrollment);
  });

  it('should list enrollments by user', async () => {
    const mockEnrollments = [
      { id: 'enrollment-1', course_id: 'course-1', status: 'approved' },
      { id: 'enrollment-2', course_id: 'course-2', status: 'pending' },
    ];

    (query as jest.Mock).mockResolvedValue({ rows: mockEnrollments });

    const result = await listEnrollmentsByUser('user-123');
    expect(result).toEqual(mockEnrollments);
  });

  it('should update enrollment status', async () => {
    (query as jest.Mock).mockResolvedValue({ rowCount: 1 });

    await updateEnrollmentStatus('enrollment-123', 'approved');
    expect(query).toHaveBeenCalledWith(
      'UPDATE enrollments SET status = $1 WHERE id = $2',
      ['approved', 'enrollment-123']
    );
  });
});

describe('Approval Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create an approval request', async () => {
    const mockApproval = {
      id: 'approval-123',
      user_id: 'user-123',
      type: 'enrollment',
      ref_id: 'enrollment-123',
      status: 'pending',
      reviewed_by: null,
      reviewed_at: null,
      created_at: new Date(),
    };

    (query as jest.Mock).mockResolvedValue({ rows: [mockApproval] });

    const result = await createApprovalRequest('user-123', 'enrollment', 'enrollment-123');
    expect(result).toEqual(mockApproval);
  });

  it('should list pending approvals', async () => {
    const mockApprovals = [
      { id: 'approval-1', type: 'registration', status: 'pending' },
      { id: 'approval-2', type: 'enrollment', status: 'pending' },
    ];

    (query as jest.Mock).mockResolvedValue({ rows: mockApprovals });

    const result = await listPendingApprovals();
    expect(result).toEqual(mockApprovals);
  });

  it('should update approval status', async () => {
    (query as jest.Mock).mockResolvedValue({ rowCount: 1 });

    await updateApprovalStatus('approval-123', 'approved', 'admin-123');
    expect(query).toHaveBeenCalledWith(
      'UPDATE approval_requests SET status = $1, reviewed_by = $2, reviewed_at = CURRENT_TIMESTAMP WHERE id = $3',
      ['approved', 'admin-123', 'approval-123']
    );
  });
});
