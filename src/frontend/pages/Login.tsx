import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      // 错误消息映射
      const errorMessage = err.message || '登录失败';

      if (errorMessage.includes('Invalid credentials')) {
        setError('邮箱或密码错误，请重试');
      } else if (errorMessage.includes('Account not activated')) {
        setError('账号尚未激活，请等待管理员审核');
      } else if (errorMessage.includes('Missing email or password')) {
        setError('请输入邮箱和密码');
      } else if (errorMessage.includes('无法连接到服务器')) {
        setError('无法连接到服务器，请检查网络连接');
      } else if (errorMessage.includes('服务器返回了非 JSON 格式')) {
        setError('服务器响应异常，请稍后重试');
      } else {
        setError(errorMessage);
      }
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
            登录
          </h1>
          <p style={{ color: '#94a3b8' }}>欢迎回到 AI 培训平台</p>
        </div>

        <form onSubmit={handleSubmit}>
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
              placeholder="••••••••"
              style={{ width: '100%', marginTop: '8px' }}
            />
          </div>

          {error && (
            <div className="error" style={{ marginBottom: '20px' }}>
              {error}
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
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          color: '#94a3b8',
        }}>
          还没有账号？{' '}
          <Link to="/register" style={{ color: '#38bdf8', fontWeight: '600' }}>
            立即注册
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

export default Login;
