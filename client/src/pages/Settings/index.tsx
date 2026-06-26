import { useState } from 'react';
import { Card, Form, Input, Button, Typography, Space, message, Divider, Switch, Avatar } from 'antd';
import { UserOutlined, SaveOutlined } from '@ant-design/icons';
import { useUserStore } from '@/store/useUserStore';
import { useThemeStore } from '@/store/useThemeStore';
import { updateMe } from '@/api/user';

const { Title, Text } = Typography;

export default function Settings() {
  const { user, setUser } = useUserStore();
  const { isDark, toggleTheme } = useThemeStore();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  async function handleSave(values: any) {
    setLoading(true);
    try {
      const { data } = await updateMe(values);
      if (data.code === 0) {
        setUser(data.data);
        message.success('保存成功');
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || '保存失败');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%', maxWidth: 600 }}>
      <Title level={4}>⚙️ 设置</Title>

      <Card title="个人信息">
        <Form
          form={form}
          layout="vertical"
          initialValues={{ username: user?.username, bio: user?.bio }}
          onFinish={handleSave}
        >
          <Form.Item label="头像">
            <Space>
              <Avatar size={64} src={user?.avatar} icon={<UserOutlined />} />
              <Button type="link">更换头像</Button>
            </Space>
          </Form.Item>
          <Form.Item name="username" label="用户名" rules={[{ required: true, min: 2 }]}>
            <Input />
          </Form.Item>
          <Form.Item name="bio" label="个人简介">
            <Input.TextArea rows={3} placeholder="介绍一下自己..." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
              保存
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="外观">
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Text>暗色模式</Text>
          <Switch checked={isDark} onChange={toggleTheme} />
        </Space>
      </Card>

      <Card title="账号">
        <Space direction="vertical">
          <Text type="secondary">邮箱：{user?.email}</Text>
          <Divider />
          <Button danger>退出登录</Button>
        </Space>
      </Card>
    </Space>
  );
}
