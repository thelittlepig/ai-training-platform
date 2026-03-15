import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourse } from '../hooks/useCourses';
import { api } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import EnrollmentModal from '../components/EnrollmentModal';
import FadeIn from '../components/FadeIn';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: course, isLoading } = useCourse(id!);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  const handleEnrollClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowModal(true);
  };

  const handleEnrollSubmit = async (info: any) => {
    await api.post('/enrollments', { course_id: id, enrollment_info: info });
    setEnrolled(true);
  };

  if (isLoading) return <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>加载中...</div>;
  if (!course) return <div style={{ padding: '40px', textAlign: 'center', color: '#f87171' }}>课程不存在</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', padding: '60px 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <FadeIn>
          <div style={{
            height: '320px',
            background: course.cover_image ? `url(${course.cover_image}) center/cover` : 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
            borderRadius: '16px',
            marginBottom: '40px',
          }} />
          <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '16px' }}>{course.title}</h1>
          <p style={{ fontSize: '16px', color: '#94a3b8', lineHeight: '1.7', marginBottom: '32px' }}>{course.description}</p>
          {enrolled ? (
            <div style={{ padding: '16px 24px', backgroundColor: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '8px', color: '#38bdf8', marginBottom: '32px' }}>
              ✅ 报名申请已提交，等待审批
            </div>
          ) : (
            <button onClick={handleEnrollClick} style={{ padding: '14px 40px', fontSize: '16px', fontWeight: '600', marginBottom: '32px' }}>
              申请报名
            </button>
          )}
        </FadeIn>

        <FadeIn delay={0.2}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>课程章节</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(course as any).chapters?.map((chapter: any, i: number) => (
              <div key={chapter.id} style={{
                backgroundColor: '#1e293b', border: '1px solid #334155',
                borderRadius: '10px', padding: '16px 20px',
                display: 'flex', alignItems: 'center', gap: '16px',
              }}>
                <span style={{ fontSize: '13px', color: '#38bdf8', fontWeight: '600', minWidth: '24px' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{ fontSize: '15px', color: '#f1f5f9' }}>{chapter.title}</span>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>

      {showModal && (
        <EnrollmentModal
          courseId={id!}
          courseName={course.title}
          onClose={() => setShowModal(false)}
          onSubmit={handleEnrollSubmit}
        />
      )}
    </div>
  );
};

export default CourseDetail;
