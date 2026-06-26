import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Form, Input, Button, Typography, message, Space } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { register } from '@/api/user';
import { useUserStore } from '@/store/useUserStore';
import { useNotificationStore } from '@/store/useNotificationStore';

const { Text } = Typography;

export default function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setTokens } = useUserStore();
  const { connect } = useNotificationStore();

  const onFinish = async (values: { username: string; email: string; password: string }) => {
    setLoading(true);
    try {
      const { data } = await register(values);
      if (data.code === 0) {
        const { user, accessToken, refreshToken } = data.data;
        setTokens(accessToken, refreshToken);
        setUser(user);
        connect(accessToken);
        message.success('注册成功');
        navigate('/');
      } else {
        message.error(data.message);
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Card className="login-card" bordered={false}>
        <div className="login-title">
          <h2>📚 DevVault</h2>
          <p>创建你的账号</p>
        </div>

        <div style={{ height: 24 }} />

        <Form layout="vertical" onFinish={onFinish} size="large" requiredMark={false}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }, { min: 2, message: '至少2个字符' }]}
          >
            <Input prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '邮箱格式不正确' }]}
          >
            <Input prefix={<MailOutlined style={{ color: '#bfbfbf' }} />} placeholder="邮箱地址" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }, { min: 6, message: '至少6个字符' }]}
          >
            <Input.Password prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} placeholder="密码" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 12 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="btn-gradient"
              style={{ height: 46, fontSize: 16, fontWeight: 700, borderRadius: 10 }}
            >
              注册
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: 13 }}>已有账号？ </Text>
          <Link to="/login" style={{ fontWeight: 600 }}>去登录</Link>
        </div>
      </Card>
    </div>
  );
}
