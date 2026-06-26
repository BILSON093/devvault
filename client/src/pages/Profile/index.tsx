import { useEffect, useState } from 'react';
import { Card, Avatar, Typography, Space, Statistic, Button, Tabs, message, Descriptions } from 'antd';
import {
  UserOutlined,
  EditOutlined,
  BookOutlined,
  TeamOutlined,
  NodeIndexOutlined,
} from '@ant-design/icons';
import { useUserStore } from '@/store/useUserStore';
import { updateMe } from '@/api/user';
import { getResources } from '@/api/resource';
import Resources from '@/pages/Resources';

const { Title, Text } = Typography;

export default function Profile() {
  const { user, setUser } = useUserStore();
  const [editing, setEditing] = useState(false);

  if (!user) return null;

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <Avatar size={80} src={user.avatar} icon={<UserOutlined />} />
          <div style={{ flex: 1 }}>
            <Title level={3} style={{ margin: 0 }}>{user.username}</Title>
            <Text type="secondary">{user.email}</Text>
            {user.bio && <div style={{ marginTop: 8 }}><Text>{user.bio}</Text></div>}
          </div>
          <Button icon={<EditOutlined />} onClick={() => setEditing(true)}>
            编辑资料
          </Button>
        </div>
      </Card>

      <Tabs
        defaultActiveKey="resources"
        items={[
          {
            key: 'resources',
            label: <Space><BookOutlined /> 我的资源</Space>,
            children: <Resources />,
          },
          {
            key: 'collections',
            label: <Space><TeamOutlined /> 收藏夹</Space>,
            children: <div>收藏夹内容...</div>,
          },
          {
            key: 'paths',
            label: <Space><NodeIndexOutlined /> 学习路线</Space>,
            children: <div>学习路线内容...</div>,
          },
        ]}
      />
    </Space>
  );
}
