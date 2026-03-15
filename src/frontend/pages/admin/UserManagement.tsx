import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { User } from '../../../shared/types';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get<User[]>('/users');
      if (response.code === 200) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api.patch(`/users/${userId}/role`, { role: newRole });
      alert('角色更新成功');
      fetchUsers();
    } catch (error) {
      alert('更新失败');
    }
  };

  if (loading) return <div>加载中...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>用户管理</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>姓名</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>邮箱</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>角色</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>状态</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{user.name}</td>
              <td style={{ padding: '10px' }}>{user.email}</td>
              <td style={{ padding: '10px' }}>{user.role}</td>
              <td style={{ padding: '10px' }}>{user.status}</td>
              <td style={{ padding: '10px' }}>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  style={{ padding: '5px' }}
                >
                  <option value="learner">学员</option>
                  <option value="instructor">讲师</option>
                  <option value="admin">管理员</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
