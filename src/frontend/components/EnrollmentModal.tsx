import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

interface EnrollmentInfo {
  phone: string;
  organization: string;
  position: string;
  tech_level: 'beginner' | 'intermediate' | 'advanced';
  identity: 'student' | 'teacher' | 'enterprise' | 'iflytek' | 'individual';
  learning_goal?: string;
  wechat?: string;
  backup_email?: string;
}

interface EnrollmentModalProps {
  courseId: string;
  courseName: string;
  onClose: () => void;
  onSubmit: (info: EnrollmentInfo) => Promise<void>;
}

const EnrollmentModal: React.FC<EnrollmentModalProps> = ({ courseId: _courseId, courseName, onClose, onSubmit }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState<EnrollmentInfo>({
    phone: '',
    organization: '',
    position: '',
    tech_level: 'beginner',
    identity: 'individual',
    learning_goal: '',
    wechat: '',
    backup_email: '',
  });

  const updateField = (field: keyof EnrollmentInfo, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const validateStep1 = (): boolean => {
    if (!form.phone || !/^1[3-9]\d{9}$/.test(form.phone)) {
      setError('请输入有效的11位手机号');
      return false;
    }
    if (!form.organization.trim()) {
      setError('请填写单位/学校');
      return false;
    }
    if (!form.position.trim()) {
      setError('请填写职位/专业');
      return false;
    }
    setError('');
    return true;
  };

  const handleNext = () => { if (validateStep1()) setStep(2); };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (e: any) {
      setError(e.message || '提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', backgroundColor: '#0f172a',
    border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '16px',
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          backgroundColor: '#1e293b', border: '1px solid #334155',
          borderRadius: '16px', padding: '32px', width: '100%',
          maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#f1f5f9', marginBottom: '4px' }}>申请报名</h2>
            <p style={{ fontSize: '13px', color: '#64748b' }}>{courseName}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          {[1, 2].map(s => (
            <div key={s} style={{
              flex: 1, height: '3px', borderRadius: '2px',
              backgroundColor: s <= step ? '#38bdf8' : '#334155', transition: 'background-color 0.3s',
            }} />
          ))}
        </div>
        <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '20px' }}>
          步骤 {step} / 2 — {step === 1 ? '基础信息' : '学习背景'}
        </p>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#f87171', marginBottom: '16px',
          }}>{error}</div>
        )}

        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>姓名 *</label>
              <input style={{ ...inputStyle, opacity: 0.6 }} value={user?.name || ''} readOnly placeholder="从账号预填" />
            </div>
            <div>
              <label style={labelStyle}>手机号 *</label>
              <input style={inputStyle} value={form.phone} onChange={e => updateField('phone', e.target.value)} placeholder="请输入11位手机号" maxLength={11} />
            </div>
            <div>
              <label style={labelStyle}>单位/学校 *</label>
              <input style={inputStyle} value={form.organization} onChange={e => updateField('organization', e.target.value)} placeholder="请输入单位或学校名称" />
            </div>
            <div>
              <label style={labelStyle}>职位/专业 *</label>
              <input style={inputStyle} value={form.position} onChange={e => updateField('position', e.target.value)} placeholder="请输入职位或专业" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>技术基础 *</label>
              {(['beginner', 'intermediate', 'advanced'] as const).map(level => (
                <label key={level} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer' }}>
                  <input type="radio" name="tech_level" value={level} checked={form.tech_level === level} onChange={() => updateField('tech_level', level)} />
                  <span style={{ fontSize: '14px', color: '#cbd5e1' }}>
                    {level === 'beginner' ? '零基础' : level === 'intermediate' ? '有一定基础' : '进阶学习者'}
                  </span>
                </label>
              ))}
            </div>
            <div>
              <label style={labelStyle}>身份标识 *</label>
              {(['student', 'teacher', 'enterprise', 'iflytek', 'individual'] as const).map(id => (
                <label key={id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer' }}>
                  <input type="radio" name="identity" value={id} checked={form.identity === id} onChange={() => updateField('identity', id)} />
                  <span style={{ fontSize: '14px', color: '#cbd5e1' }}>
                    {id === 'student' ? '高校学生' : id === 'teacher' ? '高校教师' : id === 'enterprise' ? '企业员工' : id === 'iflytek' ? '讯飞员工' : '个人学员'}
                  </span>
                </label>
              ))}
            </div>
            <div>
              <label style={labelStyle}>学习目标（选填，100字以内）</label>
              <textarea style={{ ...inputStyle, height: '80px', resize: 'none' }} value={form.learning_goal} onChange={e => updateField('learning_goal', e.target.value)} placeholder="请描述您的学习目标" maxLength={100} />
            </div>
            <div>
              <label style={labelStyle}>微信号（选填）</label>
              <input style={inputStyle} value={form.wechat} onChange={e => updateField('wechat', e.target.value)} placeholder="方便讲师联系" />
            </div>
            <div>
              <label style={labelStyle}>备用邮箱（选填）</label>
              <input style={inputStyle} type="email" value={form.backup_email} onChange={e => updateField('backup_email', e.target.value)} placeholder="接收课程通知" />
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          {step === 2 && (
            <button onClick={() => { setStep(1); setError(''); }} style={{
              flex: 1, padding: '12px', backgroundColor: '#334155', color: '#cbd5e1',
              border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer',
            }}>上一步</button>
          )}
          <button onClick={step === 1 ? handleNext : handleSubmit} disabled={loading} style={{
            flex: 2, padding: '12px', backgroundColor: '#38bdf8', color: '#0f172a',
            border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
          }}>
            {loading ? '提交中...' : step === 1 ? '下一步' : '提交报名'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default EnrollmentModal;
