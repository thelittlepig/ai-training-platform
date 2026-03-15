import React, { useState } from 'react';
import { api } from '../../utils/api';

const CourseEditor: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await api.post('/courses', {
        title,
        description,
        cover_image: '',
      });

      if (response.code === 201) {
        setMessage('课程创建成功');
        setTitle('');
        setDescription('');
      } else {
        setMessage('创建失败: ' + response.message);
      }
    } catch (error) {
      setMessage('创建失败');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>课程编辑器</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: '600px', marginTop: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label>课程标题</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>课程描述</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        {message && <div style={{ marginBottom: '10px', color: message.includes('成功') ? 'green' : 'red' }}>{message}</div>}
        <button type="submit" style={{ padding: '10px 20px' }}>
          创建课程
        </button>
      </form>
    </div>
  );
};

export default CourseEditor;
