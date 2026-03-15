import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div style={{ padding: '20px' }}>
      <h1>管理后台</h1>
      <p>欢迎, {user?.name}</p>
      <div style={{ marginTop: '30px' }}>
        <h2>快捷入口</h2>
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
          {user?.role === 'admin' && (
            <>
              <Link to="/admin/users" style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', textDecoration: 'none' }}>
                用户管理
              </Link>
              <Link to="/admin/approvals" style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', textDecoration: 'none' }}>
                审批队列
              </Link>
            </>
          )}
          <Link to="/admin/courses" style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', textDecoration: 'none' }}>
            课程管理
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
