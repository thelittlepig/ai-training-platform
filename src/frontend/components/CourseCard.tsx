import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Course } from '../../shared/types';

interface CourseCardProps {
  course: Course;
}

const difficultyLabel: Record<string, string> = {
  beginner: '入门',
  intermediate: '中级',
  advanced: '进阶',
};

const difficultyColor: Record<string, string> = {
  beginner: '#22c55e',
  intermediate: '#f59e0b',
  advanced: '#ef4444',
};

const categoryLabel: Record<string, string> = {
  'ai-basics': 'AI 基础',
  'teacher-training': '师资培训',
  'llm': '大模型应用',
  'ai-product': 'AI 产品',
};

const categoryColor: Record<string, string> = {
  'ai-basics': '#38bdf8',
  'teacher-training': '#a78bfa',
  'llm': '#fb923c',
  'ai-product': '#34d399',
};

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Link to={`/courses/${course.id}`} style={{ textDecoration: 'none' }}>
      <motion.div
        whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(56, 189, 248, 0.15)' }}
        transition={{ duration: 0.25 }}
        style={{
          backgroundColor: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '12px',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
      >
        <div style={{
          width: '100%',
          height: '160px',
          background: course.cover_image
            ? `url(${course.cover_image}) center/cover`
            : 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
          position: 'relative',
        }}>
          {course.category && (
            <span style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              backgroundColor: categoryColor[course.category] || '#38bdf8',
              color: '#0f172a',
              fontSize: '12px',
              fontWeight: '600',
              padding: '3px 8px',
              borderRadius: '4px',
            }}>
              {categoryLabel[course.category] || course.category}
            </span>
          )}
        </div>
        <div style={{ padding: '16px' }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#f1f5f9',
            marginBottom: '8px',
            lineHeight: '1.4',
          }}>
            {course.title}
          </h3>
          <p style={{
            fontSize: '13px',
            color: '#94a3b8',
            lineHeight: '1.5',
            marginBottom: '12px',
            overflow: 'hidden',
          }}>
            {course.description}
          </p>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            {course.difficulty && (
              <span style={{
                fontSize: '12px',
                color: difficultyColor[course.difficulty] || '#94a3b8',
                fontWeight: '500',
              }}>
                ● {difficultyLabel[course.difficulty] || course.difficulty}
              </span>
            )}
            {course.duration_hours && (
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                ⏱ {course.duration_hours} 课时
              </span>
            )}
            {course.student_count && (
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                👥 {course.student_count.toLocaleString()} 人
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default CourseCard;
