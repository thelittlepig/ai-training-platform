import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { Resource } from '../../shared/types';
import { useAuth } from '../hooks/useAuth';
import ResourceCard from '../components/ResourceCard';
import FadeIn from '../components/FadeIn';

const TYPES = [
  { key: 'all', label: '全部' },
  { key: 'video', label: '视频' },
  { key: 'slides', label: '课件' },
  { key: 'handout', label: '讲义' },
  { key: 'lab', label: '实验' },
  { key: 'toolkit', label: '工具包' },
];

const ResourceLibrary: React.FC = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState('all');
  const [toast, setToast] = useState('');

  useEffect(() => {
    api.get<Resource[]>('/resources').then(res => {
      if (res.code === 200) setResources(res.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleDownload = (resource: Resource) => {
    if (!user) {
      setToast('请先登录后再下载');
      setTimeout(() => setToast(''), 3000);
      return;
    }
    api.post('/downloads', { resource_id: resource.id }).catch(console.error);
    window.open(resource.file_url, '_blank');
  };

  const filtered = activeType === 'all'
    ? resources
    : resources.filter(r => r.resource_type === activeType);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>加载中...</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', padding: '60px 0' }}>
      {toast && (
        <div style={{
          position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px',
          padding: '12px 24px', color: '#f1f5f9', fontSize: '14px', zIndex: 999,
        }}>{toast}</div>
      )}
      <div className="container">
        <FadeIn>
          <h1 style={{ fontSize: '40px', fontWeight: '700', textAlign: 'center', marginBottom: '48px' }}>资源库</h1>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '48px', flexWrap: 'wrap' }}>
            {TYPES.map(t => (
              <button key={t.key} onClick={() => setActiveType(t.key)} style={{
                padding: '8px 20px', borderRadius: '20px', border: 'none',
                fontSize: '14px', fontWeight: '500', cursor: 'pointer',
                backgroundColor: activeType === t.key ? '#38bdf8' : '#1e293b',
                color: activeType === t.key ? '#0f172a' : '#94a3b8',
                transition: 'all 0.2s',
              }}>
                {t.label}
              </button>
            ))}
          </div>
        </FadeIn>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map((resource, i) => (
            <FadeIn key={resource.id} delay={i * 0.04}>
              <ResourceCard resource={resource} isLoggedIn={!!user} onDownload={handleDownload} />
            </FadeIn>
          ))}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: '#64748b', padding: '60px 0' }}>该类型暂无资源</div>
        )}
      </div>
    </div>
  );
};

export default ResourceLibrary;
