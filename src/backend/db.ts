import dotenv from 'dotenv';

dotenv.config();

// 内存数据库
const users: any[] = [];
const courses: any[] = [];
const chapters: any[] = [];
const resources: any[] = [];
const enrollments: any[] = [];
const approvals: any[] = [];
const downloads: any[] = [];

// 初始化默认管理员账号
import bcrypt from 'bcrypt';
const initAdmin = async () => {
  const adminPassword = await bcrypt.hash('admin123', 10);
  users.push({
    id: 'admin-001',
    name: '系统管理员',
    email: 'admin@example.com',
    password_hash: adminPassword,
    role: 'admin',
    status: 'active',
    created_at: new Date(),
  });
  console.log('Default admin created: admin@example.com / admin123');
};

// 初始化演示数据
const initDemoData = () => {
  // 演示课程（8门）
  courses.push(
    {
      id: 'course-demo-001',
      title: 'AI 基础入门',
      description: '从零开始学习人工智能的基础概念、核心算法和应用场景。适合初学者，无需编程基础。',
      cover_image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
      instructor_id: 'admin-001',
      status: 'published',
      created_at: new Date(),
      category: 'ai-basics',
      difficulty: 'beginner',
      duration_hours: 12,
      student_count: 1280,
      tags: ['理论', '入门'],
    },
    {
      id: 'course-demo-002',
      title: 'Python 与机器学习实战',
      description: '通过 Python 实战掌握机器学习核心算法，包括监督学习、无监督学习和模型评估。',
      cover_image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
      instructor_id: 'admin-001',
      status: 'published',
      created_at: new Date(),
      category: 'ai-basics',
      difficulty: 'beginner',
      duration_hours: 20,
      student_count: 960,
      tags: ['实践', '入门'],
    },
    {
      id: 'course-demo-003',
      title: 'AI 赋能课堂教学设计',
      description: '面向高校教师，学习如何将 AI 工具融入课堂教学，提升教学效果和学生参与度。',
      cover_image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
      instructor_id: 'admin-001',
      status: 'published',
      created_at: new Date(),
      category: 'teacher-training',
      difficulty: 'intermediate',
      duration_hours: 16,
      student_count: 540,
      tags: ['师资', '教法'],
    },
    {
      id: 'course-demo-004',
      title: '智慧课堂工具应用实训',
      description: '实操训练主流智慧课堂工具，掌握 AI 辅助备课、出题、批改等核心功能。',
      cover_image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800',
      instructor_id: 'admin-001',
      status: 'published',
      created_at: new Date(),
      category: 'teacher-training',
      difficulty: 'intermediate',
      duration_hours: 10,
      student_count: 380,
      tags: ['师资', '工具'],
    },
    {
      id: 'course-demo-005',
      title: '大语言模型开发实战',
      description: '深入学习 GPT、Claude 等大语言模型的原理与应用开发，掌握 Prompt Engineering 和 RAG 技术。',
      cover_image: 'https://images.unsplash.com/photo-1676277791608-ac5c30f5c43a?w=800',
      instructor_id: 'admin-001',
      status: 'published',
      created_at: new Date(),
      category: 'llm',
      difficulty: 'advanced',
      duration_hours: 24,
      student_count: 720,
      tags: ['开发', '进阶'],
    },
    {
      id: 'course-demo-006',
      title: 'RAG 与知识库构建',
      description: '系统学习检索增强生成技术，构建企业级知识库系统，掌握向量数据库和语义检索。',
      cover_image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
      instructor_id: 'admin-001',
      status: 'published',
      created_at: new Date(),
      category: 'llm',
      difficulty: 'advanced',
      duration_hours: 18,
      student_count: 430,
      tags: ['架构', '进阶'],
    },
    {
      id: 'course-demo-007',
      title: 'AI 产品设计与落地',
      description: '学习如何将 AI 技术转化为实际产品，包括需求分析、原型设计、技术选型和商业化路径。',
      cover_image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
      instructor_id: 'admin-001',
      status: 'published',
      created_at: new Date(),
      category: 'ai-product',
      difficulty: 'intermediate',
      duration_hours: 14,
      student_count: 610,
      tags: ['产品', '设计'],
    },
    {
      id: 'course-demo-008',
      title: '企业 AI 转型实践',
      description: '面向企业管理者和技术负责人，系统学习企业 AI 转型路径、组织变革和落地策略。',
      cover_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      instructor_id: 'admin-001',
      status: 'published',
      created_at: new Date(),
      category: 'ai-product',
      difficulty: 'intermediate',
      duration_hours: 8,
      student_count: 290,
      tags: ['企业', '案例'],
    }
  );

  // 演示资源（12个，覆盖5种类型）
  resources.push(
    // 视频类 (3)
    {
      id: 'resource-demo-001',
      title: 'AI 技术前沿讲座录播',
      description: '科大讯飞 AI 研究院专家讲座，深度解析大模型、多模态等前沿方向。',
      file_url: '/files/ai-lecture-recording.mp4',
      file_type: 'video',
      file_size: 524288000,
      uploaded_by: 'admin-001',
      is_public: true,
      created_at: new Date(),
      resource_type: 'video',
      download_count: 342,
    },
    {
      id: 'resource-demo-002',
      title: 'Prompt Engineering 精华课程片段',
      description: '从大语言模型开发实战课程中精选的 Prompt 设计核心内容。',
      file_url: '/files/prompt-engineering-clip.mp4',
      file_type: 'video',
      file_size: 209715200,
      uploaded_by: 'admin-001',
      is_public: true,
      created_at: new Date(),
      resource_type: 'video',
      download_count: 218,
    },
    {
      id: 'resource-demo-003',
      title: 'RAG 系统架构演示视频',
      description: '手把手演示如何构建企业级 RAG 知识库系统，含完整代码讲解。',
      file_url: '/files/rag-demo-video.mp4',
      file_type: 'video',
      file_size: 314572800,
      uploaded_by: 'admin-001',
      is_public: true,
      created_at: new Date(),
      resource_type: 'video',
      download_count: 156,
    },
    // 课件类 (3)
    {
      id: 'resource-demo-004',
      title: 'AI 基础入门课件',
      description: 'AI 基础入门课程完整 PPT 课件，含动画演示和课堂练习题。',
      file_url: '/files/ai-basics-slides.pptx',
      file_type: 'ppt',
      file_size: 15728640,
      uploaded_by: 'admin-001',
      is_public: true,
      created_at: new Date(),
      resource_type: 'slides',
      download_count: 489,
    },
    {
      id: 'resource-demo-005',
      title: '大语言模型开发实战课件',
      description: 'LLM 开发课程教学幻灯片，涵盖模型原理、API 调用和实战案例。',
      file_url: '/files/llm-dev-slides.pptx',
      file_type: 'ppt',
      file_size: 20971520,
      uploaded_by: 'admin-001',
      is_public: true,
      created_at: new Date(),
      resource_type: 'slides',
      download_count: 367,
    },
    {
      id: 'resource-demo-006',
      title: 'AI 产品设计方法论课件',
      description: 'AI 产品从 0 到 1 的设计方法论，含用户研究、原型设计和上线策略。',
      file_url: '/files/ai-product-design-slides.pptx',
      file_type: 'ppt',
      file_size: 12582912,
      uploaded_by: 'admin-001',
      is_public: true,
      created_at: new Date(),
      resource_type: 'slides',
      download_count: 291,
    },
    // 讲义类 (3)
    {
      id: 'resource-demo-007',
      title: 'AI 技术白皮书 2026',
      description: '最新的人工智能技术趋势报告，涵盖大模型、多模态、Agent 等前沿方向。',
      file_url: '/files/ai-whitepaper-2026.pdf',
      file_type: 'pdf',
      file_size: 2048000,
      uploaded_by: 'admin-001',
      is_public: true,
      created_at: new Date(),
      resource_type: 'handout',
      download_count: 623,
    },
    {
      id: 'resource-demo-008',
      title: 'Prompt Engineering 完整指南',
      description: '从基础到高级的 Prompt 设计技巧，包含 100+ 实战案例和最佳实践。',
      file_url: '/files/prompt-engineering-guide.pdf',
      file_type: 'pdf',
      file_size: 1536000,
      uploaded_by: 'admin-001',
      is_public: true,
      created_at: new Date(),
      resource_type: 'handout',
      download_count: 541,
    },
    {
      id: 'resource-demo-009',
      title: '机器学习算法学习手册',
      description: '常用机器学习算法原理、公式推导和 Python 实现，适合系统复习。',
      file_url: '/files/ml-algorithms-handbook.pdf',
      file_type: 'pdf',
      file_size: 3145728,
      uploaded_by: 'admin-001',
      is_public: true,
      created_at: new Date(),
      resource_type: 'handout',
      download_count: 412,
    },
    // 实验类 (2)
    {
      id: 'resource-demo-010',
      title: 'LLM API 调用实验包',
      description: 'Jupyter Notebook 实验包，包含 OpenAI、Claude API 调用和 Prompt 优化实验。',
      file_url: '/files/llm-api-lab.zip',
      file_type: 'notebook',
      file_size: 5242880,
      uploaded_by: 'admin-001',
      is_public: true,
      created_at: new Date(),
      resource_type: 'lab',
      download_count: 278,
    },
    {
      id: 'resource-demo-011',
      title: 'RAG 系统搭建实验',
      description: 'Jupyter Notebook 实验包，从零搭建 RAG 系统，含向量数据库配置和检索优化。',
      file_url: '/files/rag-system-lab.zip',
      file_type: 'notebook',
      file_size: 8388608,
      uploaded_by: 'admin-001',
      is_public: true,
      created_at: new Date(),
      resource_type: 'lab',
      download_count: 195,
    },
    // 工具包类 (1)
    {
      id: 'resource-demo-012',
      title: 'AI 开发环境工具包',
      description: '一键配置 AI 开发环境的代码模板与配置文件，含 Python 环境、常用库和示例项目。',
      file_url: '/files/ai-dev-toolkit.zip',
      file_type: 'zip',
      file_size: 52428800,
      uploaded_by: 'admin-001',
      is_public: true,
      created_at: new Date(),
      resource_type: 'toolkit',
      download_count: 334,
    }
  );

  console.log(`Demo data initialized: ${courses.length} courses, ${resources.length} resources`);
};

initAdmin();
initDemoData();

console.log('Using in-memory database for demo');

export const query = async (text: string, params?: any[]): Promise<any> => {
  console.log('Query:', text.substring(0, 50), params);

  // INSERT INTO users
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

  // SELECT FROM users WHERE email
  if (text.includes('SELECT') && text.includes('FROM users WHERE email')) {
    const user = users.find(u => u.email === params![0]);
    return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
  }

  // SELECT FROM users WHERE id
  if (text.includes('SELECT') && text.includes('FROM users WHERE id')) {
    const user = users.find(u => u.id === params![0]);
    return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
  }

  // SELECT FROM users ORDER BY
  if (text.includes('SELECT') && text.includes('FROM users') && text.includes('ORDER BY')) {
    return { rows: users, rowCount: users.length };
  }

  // UPDATE users SET role
  if (text.includes('UPDATE users SET role')) {
    const user = users.find(u => u.id === params![1]);
    if (user) user.role = params![0];
    return { rowCount: 1 };
  }

  // UPDATE users SET status
  if (text.includes('UPDATE users SET status')) {
    const user = users.find(u => u.id === params![1]);
    if (user) user.status = params![0];
    return { rowCount: 1 };
  }

  // INSERT INTO courses
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

  // SELECT FROM courses
  if (text.includes('SELECT') && text.includes('FROM courses')) {
    if (text.includes('WHERE status')) {
      const filtered = courses.filter(c => c.status === params![0]);
      return { rows: filtered, rowCount: filtered.length };
    }
    if (text.includes('WHERE id')) {
      const course = courses.find(c => c.id === params![0]);
      return { rows: course ? [course] : [], rowCount: course ? 1 : 0 };
    }
    return { rows: courses, rowCount: courses.length };
  }

  // INSERT INTO chapters
  if (text.includes('INSERT INTO chapters')) {
    const chapter = {
      id: `chapter-${Date.now()}`,
      course_id: params![0],
      title: params![1],
      content: params![2],
      order: params![3],
      created_at: new Date(),
    };
    chapters.push(chapter);
    return { rows: [chapter], rowCount: 1 };
  }

  // SELECT FROM chapters
  if (text.includes('SELECT') && text.includes('FROM chapters WHERE course_id')) {
    const filtered = chapters.filter(c => c.course_id === params![0]);
    return { rows: filtered, rowCount: filtered.length };
  }

  // INSERT INTO resources
  if (text.includes('INSERT INTO resources')) {
    const resource = {
      id: `resource-${Date.now()}`,
      title: params![0],
      description: params![1],
      file_url: params![2],
      file_type: params![3],
      file_size: params![4],
      uploaded_by: params![5],
      is_public: params![6],
      created_at: new Date(),
    };
    resources.push(resource);
    return { rows: [resource], rowCount: 1 };
  }

  // SELECT FROM resources
  if (text.includes('SELECT') && text.includes('FROM resources')) {
    if (text.includes('WHERE id')) {
      const resource = resources.find(r => r.id === params![0]);
      return { rows: resource ? [resource] : [], rowCount: resource ? 1 : 0 };
    }
    return { rows: resources, rowCount: resources.length };
  }

  // INSERT INTO enrollments
  if (text.includes('INSERT INTO enrollments')) {
    const enrollment = {
      id: `enrollment-${Date.now()}`,
      user_id: params![0],
      course_id: params![1],
      status: params![2],
      progress: params![3],
      enrolled_at: new Date(),
      enrollment_info: params![4] || null,
      study_time: 0,
      completed_at: null,
    };
    enrollments.push(enrollment);
    return { rows: [enrollment], rowCount: 1 };
  }

  // SELECT FROM enrollments
  if (text.includes('SELECT') && text.includes('FROM enrollments WHERE user_id')) {
    const filtered = enrollments.filter(e => e.user_id === params![0]);
    return { rows: filtered, rowCount: filtered.length };
  }

  // INSERT INTO approval_requests
  if (text.includes('INSERT INTO approval_requests')) {
    const approval = {
      id: `approval-${Date.now()}`,
      user_id: params![0],
      type: params![1],
      ref_id: params![2],
      status: params![3],
      reviewed_by: null,
      reviewed_at: null,
      created_at: new Date(),
    };
    approvals.push(approval);
    return { rows: [approval], rowCount: 1 };
  }

  // SELECT FROM approval_requests
  if (text.includes('SELECT') && text.includes('FROM approval_requests WHERE status')) {
    const filtered = approvals.filter(a => a.status === params![0]);
    return { rows: filtered, rowCount: filtered.length };
  }

  // UPDATE approval_requests
  if (text.includes('UPDATE approval_requests SET status')) {
    const approval = approvals.find(a => a.id === params![2]);
    if (approval) {
      approval.status = params![0];
      approval.reviewed_by = params![1];
      approval.reviewed_at = new Date();
    }
    return { rowCount: 1 };
  }

  // UPDATE enrollments SET status
  if (text.includes('UPDATE enrollments SET status')) {
    const enrollment = enrollments.find(e => e.id === params![1]);
    if (enrollment) enrollment.status = params![0];
    return { rowCount: 1 };
  }

  // DELETE operations
  if (text.includes('DELETE FROM courses')) {
    const index = courses.findIndex(c => c.id === params![0]);
    if (index > -1) courses.splice(index, 1);
    return { rowCount: 1 };
  }

  if (text.includes('DELETE FROM resources')) {
    const index = resources.findIndex(r => r.id === params![0]);
    if (index > -1) resources.splice(index, 1);
    return { rowCount: 1 };
  }

  // INSERT INTO downloads
  if (text.includes('INSERT INTO downloads')) {
    const download = {
      id: `download-${Date.now()}`,
      user_id: params![0],
      resource_id: params![1],
      downloaded_at: new Date(),
    };
    downloads.push(download);
    return { rows: [download], rowCount: 1 };
  }

  // SELECT FROM downloads WHERE user_id
  if (text.includes('SELECT') && text.includes('FROM downloads WHERE user_id')) {
    const filtered = downloads.filter(d => d.user_id === params![0]);
    return { rows: filtered, rowCount: filtered.length };
  }

  // 默认返回
  return { rows: [], rowCount: 0 };
};

export const pool = {
  query,
  on: () => {},
};

// 数据库连接测试
export const testConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // 测试基本查询功能
    const result = await query('SELECT * FROM users ORDER BY created_at', []);
    return {
      success: true,
      message: `Database connection OK. ${result.rowCount} users found.`
    };
  } catch (error) {
    return {
      success: false,
      message: `Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};
