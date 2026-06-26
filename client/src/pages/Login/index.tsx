import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Form, Input, Button, Typography, message, Space } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { login } from '@/api/user';
import { useUserStore } from '@/store/useUserStore';
import { useNotificationStore } from '@/store/useNotificationStore';

const { Text } = Typography;

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setTokens } = useUserStore();
  const { connect } = useNotificationStore();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const { data } = await login(values);
      if (data.code === 0) {
        const { user, accessToken, refreshToken } = data.data;
        setTokens(accessToken, refreshToken);
        setUser(user);
        connect(accessToken);
        message.success('登录成功');
        navigate('/');
      } else {
        message.error(data.message);
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Card className="login-card" bordered={false}>
        <div className="login-title">
          <h2>📚 DevVault</h2>
          <p>开发者学习资源平台</p>
        </div>

        <div style={{ height: 24 }} />

        <Form layout="vertical" onFinish={onFinish} size="large" requiredMark={false}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '邮箱格式不正确' },
            ]}
          >
            <Input prefix={<MailOutlined style={{ color: '#bfbfbf' }} />} placeholder="邮箱地址" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
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
              登录
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: 13 }}>还没有账号？ </Text>
          <Link to="/register" style={{ fontWeight: 600 }}>立即注册</Link>
        </div>
      </Card>
    </div>
  );
}
