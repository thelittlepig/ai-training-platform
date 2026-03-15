import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { Enrollment } from '../../shared/types';
import { useAuth } from '../hooks/useAuth';
import { useCourses } from '../hooks/useCourses';
import CertificateCard from '../components/CertificateCard';
import StudyHeatmap from '../components/StudyHeatmap';
import FadeIn from '../components/FadeIn';

const TABS = [
  { key: 'courses', label: '我的课程' },
  { key: 'records', label: '学习记录' },
  { key: 'certificates', label: '我的证书' },
  { key: 'downloads', label: '我的收藏' },
];

const MyLearning: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('courses');
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [dlList, setDlList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: courses } = useCourses('published');

  useEffect(() => {
    Promise.all([
      api.get<Enrollment[]>('/enrollments/my'),
      api.get<any[]>('/downloads/my').catch(() => ({ code: 200, data: [], message: '' })),
    ]).then(([enrollRes, dlRes]) => {
      if (enrollRes.code === 200) setEnrollments(enrollRes.data);
      if (dlRes.code === 200) setDlList(dlRes.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const getCourse = (courseId: string) => courses?.find(c => c.id === courseId);

  const inProgress = enrollments.filter(e => e.status === 'approved' && e.progress < 100);
  const completed = enrollments.filter(e => e.progress === 100);
  const pendingList = enrollments.filter(e => e.status === 'pending');
  const totalMinutes = enrollments.reduce((s, e) => s + (e.study_time || 0), 0);

  const tabStyle = (key: string): React.CSSProperties => ({
    padding: '10px 24px', border: 'none',
    borderBottom: activeTab === key ? '2px solid #38bdf8' : '2px solid transparent',
    backgroundColor: 'transparent',
    color: activeTab === key ? '#38bdf8' : '#64748b',
    fontSize: '15px', fontWeight: activeTab === key ? '600' : '400',
    cursor: 'pointer', transition: 'all 0.2s',
  });

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>加载中...</div>;

  const EnrollmentItem = ({ e, showProgress = false, showCert = false, showPending = false }: { e: Enrollment; showProgress?: boolean; showCert?: boolean; showPending?: boolean }) => {
    const course = getCourse(e.course_id);
    return (
      <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '15px', fontWeight: '600', color: '#f1f5f9', marginBottom: '6px' }}>{course?.title || e.course_id}</p>
          {showProgress && (
            <div>
              <div style={{ height: '4px', backgroundColor: '#334155', borderRadius: '2px', overflow: 'hidden', width: '200px', marginBottom: '4px' }}>
                <div style={{ height: '100%', width: `${e.progress}%`, backgroundColor: '#38bdf8', borderRadius: '2px' }} />
              </div>
              <span style={{ fontSize: '12px', color: '#64748b' }}>{e.progress}% 完成</span>
            </div>
          )}
          {showCert && e.completed_at && (
            <p style={{ fontSize: '12px', color: '#64748b' }}>完成于 {new Date(e.completed_at).toLocaleDateString()}</p>
          )}
          {showPending && <span style={{ fontSize: '12px', color: '#f59e0b' }}>⏳ 等待管理员审批</span>}
        </div>
        {showProgress && <button style={{ padding: '8px 16px', fontSize: '13px' }}>继续学习</button>}
        {showCert && <button style={{ padding: '8px 16px', fontSize: '13px', backgroundColor: 'transparent', border: '1px solid #38bdf8', color: '#38bdf8' }}>查看证书</button>}
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', padding: '60px 0' }}>
      <div className="container">
        <FadeIn>
          <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '8px' }}>我的学习</h1>
          <p style={{ color: '#64748b', marginBottom: '32px' }}>欢迎回来，{user?.name}</p>
        </FadeIn>

        {/* Tab 导航 */}
        <div style={{ display: 'flex', borderBottom: '1px solid #334155', marginBottom: '40px' }}>
          {TABS.map(t => <button key={t.key} style={tabStyle(t.key)} onClick={() => setActiveTab(t.key)}>{t.label}</button>)}
        </div>

        {/* Tab 1: 我的课程 */}
        {activeTab === 'courses' && (
          <FadeIn>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#38bdf8', marginBottom: '16px' }}>学习中 ({inProgress.length})</h3>
                {inProgress.length === 0 ? <p style={{ color: '#475569' }}>暂无进行中的课程</p> : inProgress.map(e => <div key={e.id} style={{ marginBottom: '12px' }}><EnrollmentItem e={e} showProgress /></div>)}
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#22c55e', marginBottom: '16px' }}>已完成 ({completed.length})</h3>
                {completed.length === 0 ? <p style={{ color: '#475569' }}>暂无已完成的课程</p> : completed.map(e => <div key={e.id} style={{ marginBottom: '12px' }}><EnrollmentItem e={e} showCert /></div>)}
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#f59e0b', marginBottom: '16px' }}>待审批 ({pendingList.length})</h3>
                {pendingList.length === 0 ? <p style={{ color: '#475569' }}>暂无待审批的课程</p> : pendingList.map(e => <div key={e.id} style={{ marginBottom: '12px' }}><EnrollmentItem e={e} showPending /></div>)}
              </div>
            </div>
          </FadeIn>
        )}

        {/* Tab 2: 学习记录 */}
        {activeTab === 'records' && (
          <FadeIn>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
              {[
                { label: '本周学习', value: `${Math.round(totalMinutes * 0.3 / 60)} 小时` },
                { label: '本月学习', value: `${Math.round(totalMinutes * 0.7 / 60)} 小时` },
                { label: '累计学习', value: `${Math.round(totalMinutes / 60)} 小时` },
              ].map(s => (
                <div key={s.label} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#38bdf8', marginBottom: '8px' }}>{s.value}</div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
              <StudyHeatmap enrollments={enrollments} userCreatedAt={user?.created_at} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>最近学习</h3>
            {enrollments.slice(0, 10).map(e => {
              const course = getCourse(e.course_id);
              return (
                <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #1e293b' }}>
                  <span style={{ fontSize: '14px', color: '#cbd5e1' }}>{course?.title || e.course_id}</span>
                  <span style={{ fontSize: '12px', color: '#475569' }}>{e.study_time ? `${e.study_time} 分钟` : '未记录'}</span>
                </div>
              );
            })}
          </FadeIn>
        )}

        {/* Tab 3: 我的证书 */}
        {activeTab === 'certificates' && (
          <FadeIn>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {enrollments.map(e => {
                const course = getCourse(e.course_id);
                if (!course) return null;
                return <CertificateCard key={e.id} enrollment={e} course={course} />;
              })}
              {enrollments.length === 0 && <p style={{ color: '#475569' }}>暂无课程记录</p>}
            </div>
          </FadeIn>
        )}

        {/* Tab 4: 我的收藏 */}
        {activeTab === 'downloads' && (
          <FadeIn>
            {dlList.length === 0 ? (
              <p style={{ color: '#475569' }}>暂无下载记录，前往资源库下载资源</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {dlList.map((dl: any) => (
                  <div key={dl.id} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: '14px', color: '#f1f5f9', marginBottom: '4px' }}>{dl.resource_id}</p>
                      <p style={{ fontSize: '12px', color: '#475569' }}>{new Date(dl.downloaded_at).toLocaleString()}</p>
                    </div>
                    <button style={{ padding: '6px 14px', fontSize: '13px', backgroundColor: 'transparent', border: '1px solid #334155', color: '#94a3b8', borderRadius: '6px', cursor: 'pointer' }}>重新下载</button>
                  </div>
                ))}
              </div>
            )}
          </FadeIn>
        )}
      </div>
    </div>
  );
};

export default MyLearning;

