import React from 'react';
import { Enrollment } from '../../shared/types';

interface StudyHeatmapProps {
  enrollments: Enrollment[];
  userCreatedAt?: Date;
}

const StudyHeatmap: React.FC<StudyHeatmapProps> = ({ enrollments, userCreatedAt }) => {
  const today = new Date();
  const days: { date: Date; label: string; hasStudy: boolean; isBeforeJoin: boolean }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    d.setHours(0, 0, 0, 0);

    const isBeforeJoin = userCreatedAt
      ? d < new Date(new Date(userCreatedAt).setHours(0, 0, 0, 0))
      : false;

    const hasStudy = !isBeforeJoin && enrollments.some(e => {
      if (!e.study_time || e.study_time <= 0) return false;
      const enrollDate = new Date(e.enrolled_at);
      enrollDate.setHours(0, 0, 0, 0);
      return enrollDate.getTime() === d.getTime();
    });

    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    days.push({
      date: d,
      label: `周${weekdays[d.getDay()]}`,
      hasStudy,
      isBeforeJoin,
    });
  }

  return (
    <div>
      <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>最近 7 天学习记录</p>
      <div style={{ display: 'flex', gap: '8px' }}>
        {days.map((day, idx) => (
          <div key={idx} style={{ textAlign: 'center', flex: 1 }}>
            <div
              title={`${day.date.getMonth() + 1}/${day.date.getDate()}`}
              style={{
                height: '36px',
                borderRadius: '6px',
                backgroundColor: day.isBeforeJoin
                  ? '#1e293b'
                  : day.hasStudy
                    ? '#38bdf8'
                    : '#334155',
                marginBottom: '6px',
                border: day.isBeforeJoin ? '1px dashed #334155' : 'none',
              }}
            />
            <span style={{ fontSize: '11px', color: '#475569' }}>{day.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyHeatmap;
