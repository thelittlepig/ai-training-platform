import { createCourse, listCourses, findCourseById, updateCourse, deleteCourse } from '../../src/backend/models/course.model';
import { createChapter, listChaptersByCourse } from '../../src/backend/models/chapter.model';

// Mock database
jest.mock('../../src/backend/db', () => ({
  query: jest.fn(),
}));

import { query } from '../../src/backend/db';

describe('Course Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a course', async () => {
    const mockCourse = {
      id: 'course-123',
      title: 'AI Basics',
      description: 'Learn AI fundamentals',
      cover_image: 'cover.jpg',
      instructor_id: 'user-123',
      status: 'draft',
      created_at: new Date(),
    };

    (query as jest.Mock).mockResolvedValue({ rows: [mockCourse] });

    const result = await createCourse('AI Basics', 'Learn AI fundamentals', 'cover.jpg', 'user-123');
    expect(result).toEqual(mockCourse);
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO courses'),
      ['AI Basics', 'Learn AI fundamentals', 'cover.jpg', 'user-123', 'draft']
    );
  });

  it('should list all published courses', async () => {
    const mockCourses = [
      { id: 'course-1', title: 'Course 1', status: 'published' },
      { id: 'course-2', title: 'Course 2', status: 'published' },
    ];

    (query as jest.Mock).mockResolvedValue({ rows: mockCourses });

    const result = await listCourses('published');
    expect(result).toEqual(mockCourses);
  });

  it('should find course by id', async () => {
    const mockCourse = { id: 'course-123', title: 'AI Basics' };
    (query as jest.Mock).mockResolvedValue({ rows: [mockCourse] });

    const result = await findCourseById('course-123');
    expect(result).toEqual(mockCourse);
  });

  it('should update course', async () => {
    (query as jest.Mock).mockResolvedValue({ rowCount: 1 });

    await updateCourse('course-123', { title: 'Updated Title', status: 'published' });
    expect(query).toHaveBeenCalled();
  });

  it('should delete course', async () => {
    (query as jest.Mock).mockResolvedValue({ rowCount: 1 });

    await deleteCourse('course-123');
    expect(query).toHaveBeenCalledWith('DELETE FROM courses WHERE id = $1', ['course-123']);
  });
});

describe('Chapter Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a chapter', async () => {
    const mockChapter = {
      id: 'chapter-123',
      course_id: 'course-123',
      title: 'Chapter 1',
      content: 'Content here',
      order: 1,
      created_at: new Date(),
    };

    (query as jest.Mock).mockResolvedValue({ rows: [mockChapter] });

    const result = await createChapter('course-123', 'Chapter 1', 'Content here', 1);
    expect(result).toEqual(mockChapter);
  });

  it('should list chapters by course', async () => {
    const mockChapters = [
      { id: 'chapter-1', title: 'Chapter 1', order: 1 },
      { id: 'chapter-2', title: 'Chapter 2', order: 2 },
    ];

    (query as jest.Mock).mockResolvedValue({ rows: mockChapters });

    const result = await listChaptersByCourse('course-123');
    expect(result).toEqual(mockChapters);
  });
});
