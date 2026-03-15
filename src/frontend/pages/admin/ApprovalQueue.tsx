import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { ApprovalRequest } from '../../../shared/types';

const ApprovalQueue: React.FC = () => {
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    try {
      const response = await api.get<ApprovalRequest[]>('/approvals');
      if (response.code === 200) {
        setApprovals(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch approvals', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await api.patch(`/approvals/${id}`, { status });
      alert(`审批${status === 'approved' ? '通过' : '拒绝'}`);
      fetchApprovals();
    } catch (error) {
      alert('操作失败');
    }
  };

  if (loading) return <div>加载中...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>审批队列</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>类型</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>用户 ID</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>状态</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>创建时间</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {approvals.map((approval) => (
            <tr key={approval.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{approval.type}</td>
              <td style={{ padding: '10px' }}>{approval.user_id}</td>
              <td style={{ padding: '10px' }}>{approval.status}</td>
              <td style={{ padding: '10px' }}>{new Date(approval.created_at).toLocaleString()}</td>
              <td style={{ padding: '10px' }}>
                {approval.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApproval(approval.id, 'approved')}
                      style={{ marginRight: '10px', padding: '5px 10px' }}
                    >
                      通过
                    </button>
                    <button
                      onClick={() => handleApproval(approval.id, 'rejected')}
                      style={{ padding: '5px 10px' }}
                    >
                      拒绝
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApprovalQueue;
