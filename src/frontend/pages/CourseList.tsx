import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCourses } from '../hooks/useCourses';
import CourseCard from '../components/CourseCard';
import FadeIn from '../components/FadeIn';

const CATEGORIES = [
  { key: 'all', label: '全部' },
  { key: 'ai-basics', label: 'AI 基础' },
  { key: 'teacher-training', label: '师资培训' },
  { key: 'llm', label: '大模型应用' },
  { key: 'ai-product', label: 'AI 产品' },
];

const CourseList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const { data: courses, isLoading, error } = useCourses('published');

  if (isLoading) return <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>加载中...</div>;
  if (error) return <div style={{ padding: '40px', textAlign: 'center', color: '#f87171' }}>加载失败</div>;

  const filtered = activeCategory === 'all'
    ? courses || []
    : (courses || []).filter(c => (c as any).category === activeCategory);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', padding: '60px 0' }}>
      <div className="container">
        <FadeIn>
          <h1 style={{ fontSize: '40px', fontWeight: '700', textAlign: 'center', marginBottom: '48px' }}>探索课程</h1>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '48px', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '20px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  backgroundColor: activeCategory === cat.key ? '#38bdf8' : '#1e293b',
                  color: activeCategory === cat.key ? '#0f172a' : '#94a3b8',
                  transition: 'all 0.2s',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </FadeIn>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {filtered.map((course, i) => (
            <FadeIn key={course.id} delay={i * 0.05}>
              <CourseCard course={course} />
            </FadeIn>
          ))}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: '#64748b', padding: '60px 0' }}>该分类暂无课程</div>
        )}
      </div>
    </div>
  );
};

export default CourseList;
