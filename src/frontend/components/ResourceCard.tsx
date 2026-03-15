import React from 'react';
import { motion } from 'framer-motion';
import { Resource } from '../../shared/types';

interface ResourceCardProps {
  resource: Resource;
  isLoggedIn: boolean;
  onDownload: (resource: Resource) => void;
}

const resourceTypeIcon: Record<string, string> = {
  video: '🎬',
  slides: '📊',
  handout: '📄',
  lab: '🧪',
  toolkit: '🛠️',
};

const resourceTypeLabel: Record<string, string> = {
  video: '视频',
  slides: '课件',
  handout: '讲义',
  lab: '实验',
  toolkit: '工具包',
};

const formatFileSize = (bytes: number): string => {
  if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(1)} GB`;
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
};

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, isLoggedIn, onDownload }) => {
  const icon = resource.resource_type ? resourceTypeIcon[resource.resource_type] : '📁';
  const typeLabel = resource.resource_type ? resourceTypeLabel[resource.resource_type] : '文件';

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.2)' }}
      transition={{ duration: 0.2 }}
      style={{
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '20px',
      }}
    >
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <div style={{
          fontSize: '32px',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          borderRadius: '8px',
          flexShrink: 0,
        }}>
          {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              fontSize: '11px',
              backgroundColor: '#334155',
              color: '#94a3b8',
              padding: '2px 6px',
              borderRadius: '4px',
            }}>
              {typeLabel}
            </span>
          </div>
          <h3 style={{
            fontSize: '15px',
            fontWeight: '600',
            color: '#f1f5f9',
            marginBottom: '6px',
            lineHeight: '1.4',
          }}>
            {resource.title}
          </h3>
          <p style={{
            fontSize: '13px',
            color: '#64748b',
            lineHeight: '1.5',
            marginBottom: '12px',
          }}>
            {resource.description}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#64748b' }}>
              <span>{formatFileSize(resource.file_size)}</span>
              {resource.download_count !== undefined && (
                <span>⬇ {resource.download_count} 次下载</span>
              )}
            </div>
            <button
              onClick={() => isLoggedIn ? onDownload(resource) : undefined}
              title={isLoggedIn ? '下载' : '请先登录'}
              style={{
                padding: '6px 14px',
                fontSize: '13px',
                backgroundColor: isLoggedIn ? '#38bdf8' : '#334155',
                color: isLoggedIn ? '#0f172a' : '#64748b',
                border: 'none',
                borderRadius: '6px',
                cursor: isLoggedIn ? 'pointer' : 'not-allowed',
                fontWeight: '500',
              }}
            >
              {isLoggedIn ? '下载' : '🔒 登录后下载'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResourceCard;
