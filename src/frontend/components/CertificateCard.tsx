import React from 'react';
import { Enrollment, Course } from '../../shared/types';

interface CertificateCardProps {
  enrollment: Enrollment;
  course: Course;
}

const generateCertId = (courseId: string, userId: string): string => {
  const year = new Date().getFullYear();
  return `CERT-${courseId.slice(-4).toUpperCase()}-${userId.slice(-4).toUpperCase()}-${year}`;
};

const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const CertificateCard: React.FC<CertificateCardProps> = ({ enrollment, course }) => {
  if (enrollment.progress < 100) {
    return (
      <div style={{
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '24px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>📚</div>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>
          {course.title}
        </p>
        <p style={{ color: '#64748b', fontSize: '13px', marginTop: '8px' }}>
          还差 {100 - enrollment.progress}% 完成课程
        </p>
        <div style={{
          marginTop: '12px',
          height: '4px',
          backgroundColor: '#334155',
          borderRadius: '2px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${enrollment.progress}%`,
            backgroundColor: '#38bdf8',
            borderRadius: '2px',
          }} />
        </div>
      </div>
    );
  }

  const certId = generateCertId(enrollment.course_id, enrollment.user_id);
  const completedDate = formatDate(enrollment.completed_at || enrollment.enrolled_at);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      border: '1px solid #38bdf8',
      borderRadius: '12px',
      padding: '28px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(circle at 50% 0%, rgba(56,189,248,0.08) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />
      <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏆</div>
      <p style={{ fontSize: '12px', color: '#38bdf8', letterSpacing: '2px', marginBottom: '8px' }}>
        完课证书
      </p>
      <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#f1f5f9', marginBottom: '16px' }}>
        {course.title}
      </h3>
      <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>
        完成日期：{completedDate}
      </p>
      <p style={{ fontSize: '12px', color: '#475569', fontFamily: 'monospace' }}>
        证书编号：{certId}
      </p>
    </div>
  );
};

export default CertificateCard;

