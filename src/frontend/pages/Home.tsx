import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import FadeIn from '../components/FadeIn';

const STATS = [
  { value: '3000+', label: '培训学员' },
  { value: '50+', label: '精品课程' },
  { value: '20+', label: '合作高校' },
  { value: '98%', label: '学员好评' },
];

const AUDIENCES = [
  {
    icon: '🎓',
    title: '高校师生',
    desc: '产教融合课程、AI 教学工具实训、师资能力提升',
    filter: 'teacher-training',
  },
  {
    icon: '🏢',
    title: '企业员工',
    desc: '技能提升培训、岗位 AI 认证、团队定制方案',
    filter: 'ai-product',
  },
  {
    icon: '👤',
    title: '个人学员',
    desc: '自主学习路径、完课证书、职业发展指导',
    filter: 'ai-basics',
  },
];

const FEATURED_COURSES = [
  {
    id: 'course-demo-001',
    title: 'AI 基础入门',
    tags: ['理论', '入门'],
    students: 1280,
    cover: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
  },
  {
    id: 'course-demo-005',
    title: '大语言模型开发实战',
    tags: ['开发', '进阶'],
    students: 720,
    cover: 'https://images.unsplash.com/photo-1676277791608-ac5c30f5c43a?w=800',
  },
  {
    id: 'course-demo-003',
    title: 'AI 赋能课堂教学设计',
    tags: ['师资', '教法'],
    students: 540,
    cover: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
  },
];

const PARTNERS_UNIVERSITIES = ['清华大学', '北京大学', '浙江大学', '复旦大学', '中国科技大学'];
const PARTNERS_ENTERPRISE = ['科大讯飞', '华为', '阿里云', '腾讯云', '百度智能云'];

const Home: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0f172a' }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#1e293b', borderBottom: '1px solid #334155',
        padding: '16px 0', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ fontSize: '20px', fontWeight: 'bold', color: '#38bdf8', textDecoration: 'none' }}>
            讯飞 AI 培训平台
          </Link>
          <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <Link to="/courses">课程列表</Link>
            <Link to="/resources">资源库</Link>
            {user ? (
              <>
                <Link to="/my-learning">我的学习</Link>
                {(user.role === 'admin' || user.role === 'instructor') && (
                  <Link to="/admin/dashboard">管理后台</Link>
                )}
                <span style={{ color: '#cbd5e1' }}>欢迎, {user.name}</span>
                <button onClick={logout} style={{ padding: '8px 16px' }}>退出</button>
              </>
            ) : (
              <>
                <Link to="/login">登录</Link>
                <Link to="/register"><button style={{ padding: '8px 16px' }}>注册</button></Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main style={{ flex: 1 }}>
        {/* 区块1 - Hero */}
        <section style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          padding: '120px 0', textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)', width: '800px', height: '800px',
            background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <FadeIn delay={0.1}>
              <h1 style={{
                fontSize: '64px', fontWeight: '700', marginBottom: '16px',
                background: 'linear-gradient(135deg, #38bdf8 0%, #7dd3fc 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em', lineHeight: '1.1',
              }}>
                讯飞 AI 培训平台 · 产教融合
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p style={{ fontSize: '20px', color: '#94a3b8', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px', lineHeight: '1.6' }}>
                汇聚 AI 核心技术，赋能高校师资，助力教育数字化转型
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <Link to="/courses">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    style={{ padding: '14px 36px', fontSize: '16px', fontWeight: '600' }}>
                    浏览课程
                  </motion.button>
                </Link>
                <Link to="/courses?category=teacher-training">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    style={{ padding: '14px 36px', fontSize: '16px', fontWeight: '600', background: 'transparent', border: '2px solid #38bdf8', color: '#38bdf8', boxShadow: 'none' }}>
                    了解产教融合
                  </motion.button>
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* 区块2 - 数据带 */}
        <section style={{ backgroundColor: '#1e293b', padding: '48px 0', borderTop: '1px solid #334155', borderBottom: '1px solid #334155' }}>
          <div className="container">
            <FadeIn>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', textAlign: 'center' }}>
                {STATS.map((stat, i) => (
                  <div key={i}>
                    <div style={{ fontSize: '40px', fontWeight: '700', color: '#38bdf8', marginBottom: '8px' }}>{stat.value}</div>
                    <div style={{ fontSize: '14px', color: '#64748b' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* 区块3 - 三类受众 */}
        <section style={{ padding: '80px 0', backgroundColor: '#0f172a' }}>
          <div className="container">
            <FadeIn>
              <h2 style={{ textAlign: 'center', fontSize: '40px', fontWeight: '700', marginBottom: '16px' }}>服务三类受众</h2>
              <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '56px' }}>无论您是高校师生、企业员工还是个人学员，都能找到适合的学习路径</p>
            </FadeIn>
            <div className="grid grid-cols-3">
              {AUDIENCES.map((a, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <motion.div
                    className="card"
                    whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(56,189,248,0.15)' }}
                    transition={{ duration: 0.3 }}
                    style={{ textAlign: 'center', padding: '40px', cursor: 'pointer' }}
                    onClick={() => navigate(`/courses?category=${a.filter}`)}
                  >
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>{a.icon}</div>
                    <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '12px', color: '#38bdf8' }}>{a.title}</h3>
                    <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6' }}>{a.desc}</p>
                  </motion.div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* 区块4 - 精选课程 */}
        <section style={{ padding: '80px 0', backgroundColor: '#1e293b' }}>
          <div className="container">
            <FadeIn>
              <h2 style={{ textAlign: 'center', fontSize: '40px', fontWeight: '700', marginBottom: '56px' }}>精选课程</h2>
            </FadeIn>
            <div className="grid grid-cols-3">
              {FEATURED_COURSES.map((c, i) => (
                <FadeIn key={c.id} delay={i * 0.1}>
                  <Link to={`/courses/${c.id}`} style={{ textDecoration: 'none' }}>
                    <motion.div className="card" whileHover={{ y: -6 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
                      <div style={{ height: '160px', background: `url(${c.cover}) center/cover`, backgroundColor: '#0f172a' }} />
                      <div style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                          {c.tags.map(t => (
                            <span key={t} style={{ fontSize: '11px', backgroundColor: '#334155', color: '#94a3b8', padding: '2px 8px', borderRadius: '4px' }}>{t}</span>
                          ))}
                        </div>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#f1f5f9', marginBottom: '8px' }}>{c.title}</h3>
                        <p style={{ fontSize: '12px', color: '#64748b' }}>👥 {c.students.toLocaleString()} 人学习</p>
                      </div>
                    </motion.div>
                  </Link>
                </FadeIn>
              ))}
            </div>
            <FadeIn>
              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <Link to="/courses" style={{ color: '#38bdf8', fontSize: '15px' }}>查看全部课程 →</Link>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* 区块5 - 合作伙伴 */}
        <section style={{ padding: '80px 0', backgroundColor: '#0f172a' }}>
          <div className="container">
            <FadeIn>
              <h2 style={{ textAlign: 'center', fontSize: '40px', fontWeight: '700', marginBottom: '48px' }}>携手共建 AI 教育生态</h2>
              <div style={{ marginBottom: '24px' }}>
                <p style={{ textAlign: 'center', fontSize: '13px', color: '#475569', marginBottom: '16px' }}>合作高校</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
                  {PARTNERS_UNIVERSITIES.map(p => (
                    <span key={p} style={{ fontSize: '15px', color: '#64748b', fontWeight: '500' }}>{p}</span>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ textAlign: 'center', fontSize: '13px', color: '#475569', marginBottom: '16px' }}>合作企业</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
                  {PARTNERS_ENTERPRISE.map(p => (
                    <span key={p} style={{ fontSize: '15px', color: '#64748b', fontWeight: '500' }}>{p}</span>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* 区块6 - 底部CTA */}
        <section style={{ padding: '80px 0', backgroundColor: '#1e293b', textAlign: 'center' }}>
          <div className="container">
            <FadeIn>
              <h2 style={{ fontSize: '40px', fontWeight: '700', marginBottom: '16px' }}>立即加入，开启 AI 学习之旅</h2>
              <p style={{ color: '#64748b', marginBottom: '32px' }}>持有邀请码可直接激活账号</p>
              <Link to="/register">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  style={{ padding: '14px 48px', fontSize: '16px', fontWeight: '600' }}>
                  免费注册
                </motion.button>
              </Link>
            </FadeIn>
          </div>
        </section>
      </main>

      <footer style={{ backgroundColor: '#1e293b', borderTop: '1px solid #334155', padding: '24px 0', textAlign: 'center', color: '#64748b' }}>
        <div className="container">
          <p>© 2026 讯飞 AI 培训平台 · 产教融合. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

