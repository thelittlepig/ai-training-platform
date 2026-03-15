import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../utils/api';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        inviteCode: inviteCode || undefined,
      });
      if (response.code === 201) {
        if (response.message.includes('activated')) {
          setMessage('注册成功，账号已激活！即将跳转到登录页面...');
        } else {
          setMessage('注册成功，等待管理员审批');
        }
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError('注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      padding: '20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '8px',
            background: 'linear-gradient(135deg, #38bdf8 0%, #7dd3fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            注册
          </h1>
          <p style={{ color: '#94a3b8' }}>加入 AI 培训平台，开启学习之旅</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="name">姓名</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="请输入您的姓名"
              style={{ width: '100%', marginTop: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="email">邮箱地址</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              style={{ width: '100%', marginTop: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="password">密码</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="至少 6 位字符"
              minLength={6}
              style={{ width: '100%', marginTop: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="inviteCode">邀请码（可选）</label>
            <input
              id="inviteCode"
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="如有邀请码，可直接激活账号"
              style={{ width: '100%', marginTop: '8px' }}
            />
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              使用邀请码注册可立即激活账号，无需等待审批
            </p>
          </div>

          {error && (
            <div className="error" style={{ marginBottom: '20px' }}>
              {error}
            </div>
          )}

          {message && (
            <div className="success" style={{ marginBottom: '20px' }}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              fontWeight: '600',
            }}
          >
            {loading ? '注册中...' : '注册'}
          </button>
        </form>

        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          color: '#94a3b8',
        }}>
          已有账号？{' '}
          <Link to="/login" style={{ color: '#38bdf8', fontWeight: '600' }}>
            立即登录
          </Link>
        </div>

        <div style={{
          marginTop: '24px',
          textAlign: 'center',
        }}>
          <Link to="/" style={{ color: '#64748b', fontSize: '14px' }}>
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
