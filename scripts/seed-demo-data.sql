-- 演示课程数据
-- 课程 1: AI 基础入门
INSERT INTO courses (id, title, description, cover_image, instructor_id, status, created_at)
VALUES (
  'course-demo-001',
  'AI 基础入门',
  '从零开始学习人工智能的基础概念、核心算法和应用场景。适合初学者，无需编程基础。',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
  'admin-001',
  'published',
  NOW()
);

-- 课程 2: 大语言模型开发实战
INSERT INTO courses (id, title, description, cover_image, instructor_id, status, created_at)
VALUES (
  'course-demo-002',
  '大语言模型开发实战',
  '深入学习 GPT、Claude 等大语言模型的原理与应用开发，掌握 Prompt Engineering 和 RAG 技术。',
  'https://images.unsplash.com/photo-1676277791608-ac5c30f5c43a?w=800',
  'admin-001',
  'published',
  NOW()
);

-- 课程 3: AI 产品设计与落地
INSERT INTO courses (id, title, description, cover_image, instructor_id, status, created_at)
VALUES (
  'course-demo-003',
  'AI 产品设计与落地',
  '学习如何将 AI 技术转化为实际产品，包括需求分析、原型设计、技术选型和商业化路径。',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
  'admin-001',
  'published',
  NOW()
);

-- 演示资源数据
-- 资源 1: AI 技术白皮书
INSERT INTO resources (id, title, description, file_url, file_type, file_size, uploaded_by, is_public, created_at)
VALUES (
  'resource-demo-001',
  'AI 技术白皮书 2026',
  '最新的人工智能技术趋势报告，涵盖大模型、多模态、Agent 等前沿方向。',
  '/files/ai-whitepaper-2026.pdf',
  'pdf',
  2048000,
  'admin-001',
  true,
  NOW()
);

-- 资源 2: Prompt Engineering 指南
INSERT INTO resources (id, title, description, file_url, file_type, file_size, uploaded_by, is_public, created_at)
VALUES (
  'resource-demo-002',
  'Prompt Engineering 完整指南',
  '从基础到高级的 Prompt 设计技巧，包含 100+ 实战案例和最佳实践。',
  '/files/prompt-engineering-guide.pdf',
  'pdf',
  1536000,
  'admin-001',
  true,
  NOW()
);

-- 资源 3: RAG 系统架构图
INSERT INTO resources (id, title, description, file_url, file_type, file_size, uploaded_by, is_public, created_at)
VALUES (
  'resource-demo-003',
  'RAG 系统架构设计',
  '检索增强生成（RAG）系统的完整架构图和实现方案，包含向量数据库选型。',
  '/files/rag-architecture.png',
  'image',
  512000,
  'admin-001',
  true,
  NOW()
);

-- 资源 4: LangChain 开发教程
INSERT INTO resources (id, title, description, file_url, file_type, file_size, uploaded_by, is_public, created_at)
VALUES (
  'resource-demo-004',
  'LangChain 开发实战教程',
  '使用 LangChain 框架构建 AI 应用的完整教程，包含代码示例和项目模板。',
  '/files/langchain-tutorial.pdf',
  'pdf',
  3072000,
  'admin-001',
  true,
  NOW()
);

-- 资源 5: AI Agent 设计模式
INSERT INTO resources (id, title, description, file_url, file_type, file_size, uploaded_by, is_public, created_at)
VALUES (
  'resource-demo-005',
  'AI Agent 设计模式与实践',
  '深入解析 ReAct、Plan-and-Execute、Multi-Agent 等主流 Agent 设计模式。',
  '/files/ai-agent-patterns.pdf',
  'pdf',
  2560000,
  'admin-001',
  true,
  NOW()
);

-- 资源 6: 向量数据库对比
INSERT INTO resources (id, title, description, file_url, file_type, file_size, uploaded_by, is_public, created_at)
VALUES (
  'resource-demo-006',
  '向量数据库技术选型指南',
  'Pinecone、Weaviate、Milvus、Qdrant 等主流向量数据库的性能对比和选型建议。',
  '/files/vector-db-comparison.pdf',
  'pdf',
  1024000,
  'admin-001',
  true,
  NOW()
);

-- 资源 7: Fine-tuning 实战
INSERT INTO resources (id, title, description, file_url, file_type, file_size, uploaded_by, is_public, created_at)
VALUES (
  'resource-demo-007',
  '大模型 Fine-tuning 实战',
  '从数据准备到模型部署的完整 Fine-tuning 流程，包含 LoRA、QLoRA 等高效方法。',
  '/files/fine-tuning-guide.pdf',
  'pdf',
  4096000,
  'admin-001',
  true,
  NOW()
);

-- 资源 8: AI 产品案例集
INSERT INTO resources (id, title, description, file_url, file_type, file_size, uploaded_by, is_public, created_at)
VALUES (
  'resource-demo-008',
  'AI 产品成功案例集',
  '20+ 成功的 AI 产品案例分析，涵盖教育、医疗、金融、电商等多个行业。',
  '/files/ai-product-cases.pdf',
  'pdf',
  5120000,
  'admin-001',
  true,
  NOW()
);
