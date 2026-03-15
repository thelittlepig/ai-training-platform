// 内存数据库模拟
const users: any[] = [];
const courses: any[] = [];
const chapters: any[] = [];
const resources: any[] = [];
const enrollments: any[] = [];
const approvals: any[] = [];

export const memoryDb = {
  users,
  courses,
  chapters,
  resources,
  enrollments,
  approvals,
};

// 模拟 query 函数
export const query = async (text: string, params?: any[]) => {
  console.log('Query:', text, params);

  // 简单的 INSERT 处理
  if (text.includes('INSERT INTO users')) {
    const user = {
      id: `user-${Date.now()}`,
      name: params![0],
      email: params![1],
      password_hash: params![2],
      role: params![3],
      status: params![4],
      created_at: new Date(),
    };
    users.push(user);
    return { rows: [user], rowCount: 1 };
  }

  if (text.includes('SELECT') && text.includes('FROM users WHERE email')) {
    const user = users.find(u => u.email === params![0]);
    return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
  }

  if (text.includes('SELECT') && text.includes('FROM users WHERE id')) {
    const user = users.find(u => u.id === params![0]);
    return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
  }

  if (text.includes('SELECT') && text.includes('FROM users') && text.includes('ORDER BY')) {
    return { rows: users, rowCount: users.length };
  }

  // 课程相关
  if (text.includes('INSERT INTO courses')) {
    const course = {
      id: `course-${Date.now()}`,
      title: params![0],
      description: params![1],
      cover_image: params![2],
      instructor_id: params![3],
      status: params![4],
      created_at: new Date(),
    };
    courses.push(course);
    return { rows: [course], rowCount: 1 };
  }

  if (text.includes('SELECT') && text.includes('FROM courses')) {
    if (text.includes('WHERE status')) {
      const filtered = courses.filter(c => c.status === params![0]);
      return { rows: filtered, rowCount: filtered.length };
    }
    return { rows: courses, rowCount: courses.length };
  }

  // 默认返回
  return { rows: [], rowCount: 0 };
};

export const pool = {
  query,
  on: () => {},
};
