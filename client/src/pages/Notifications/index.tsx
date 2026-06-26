import { useEffect, useState } from 'react';
import { Card, List, Button, Space, Typography, Tag, message, Empty, Badge } from 'antd';
import {
  BellOutlined,
  CheckOutlined,
  UserAddOutlined,
  HeartOutlined,
  MessageOutlined,
  ForkOutlined,
} from '@ant-design/icons';
import { getNotifications, markAllRead, markRead } from '@/api/notification';
import { useNotificationStore } from '@/store/useNotificationStore';

const { Title, Text } = Typography;

const typeIcons: Record<string, React.ReactNode> = {
  follow: <UserAddOutlined style={{ color: '#1677ff' }} />,
  like: <HeartOutlined style={{ color: '#eb2f96' }} />,
  comment: <MessageOutlined style={{ color: '#52c41a' }} />,
  fork: <ForkOutlined style={{ color: '#faad14' }} />,
  system: <BellOutlined style={{ color: '#666' }} />,
};

const typeLabels: Record<string, string> = {
  follow: '关注',
  like: '点赞',
  comment: '评论',
  fork: 'Fork',
  system: '系统',
};

export default function Notifications() {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const setStoreUnreadCount = useNotificationStore((s) => s.setUnreadCount);

  useEffect(() => {
    loadNotifications();
  }, [page]);

  async function loadNotifications() {
    setLoading(true);
    try {
      const { data } = await getNotifications(page, 20);
      if (data.code === 0) {
        setNotifications(data.data.list);
        setTotal(data.data.total);
        setUnreadCount(data.data.unreadCount);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAllRead() {
    try {
      await markAllRead();
      setUnreadCount(0);
      setStoreUnreadCount(0);
      loadNotifications();
      message.success('已全部标记为已读');
    } catch {
      message.error('操作失败');
    }
  }

  async function handleMarkRead(id: number) {
    try {
      await markRead(id);
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setStoreUnreadCount(Math.max(0, unreadCount - 1));
      loadNotifications();
    } catch {}
  }

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <Title level={4} style={{ margin: 0 }}>🔔 通知</Title>
          {unreadCount > 0 && <Badge count={unreadCount} />}
        </Space>
        {unreadCount > 0 && (
          <Button icon={<CheckOutlined />} onClick={handleMarkAllRead}>
            全部已读
          </Button>
        )}
      </div>

      {notifications.length > 0 ? (
        <List
          loading={loading}
          dataSource={notifications}
          pagination={{
            current: page,
            total,
            pageSize: 20,
            onChange: setPage,
          }}
          renderItem={(item: any) => (
            <List.Item
              style={{ background: item.isRead ? 'transparent' : '#f6ffed', padding: '12px 16px', borderRadius: 8 }}
              actions={
                !item.isRead
                  ? [<Button key="read" type="link" onClick={() => handleMarkRead(item.id)}>标为已读</Button>]
                  : []
              }
            >
              <List.Item.Meta
                avatar={typeIcons[item.type] || <BellOutlined />}
                title={
                  <Space>
                    {item.sender?.username && <Text strong>{item.sender.username}</Text>}
                    <Text>{item.content}</Text>
                    {!item.isRead && <Badge status="processing" />}
                  </Space>
                }
                description={
                  <Space>
                    <Tag>{typeLabels[item.type] || item.type}</Tag>
                    <Text type="secondary">{new Date(item.createdAt).toLocaleString()}</Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <Card>
          <Empty description="暂无通知" />
        </Card>
      )}
    </Space>
  );
}
