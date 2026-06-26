import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, List, Tag, Space, Typography, Button, Steps, Descriptions, message, Empty, Spin, Popconfirm, Select, Progress } from 'antd';
import {
  ArrowLeftOutlined,
  ForkOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { getPathById, forkPath, updatePathItem, removePathItem } from '@/api/path';

const { Title, Text, Paragraph } = Typography;

const statusMap: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  not_started: { label: '未开始', color: 'default', icon: <ClockCircleOutlined /> },
  in_progress: { label: '进行中', color: 'processing', icon: <LoadingOutlined /> },
  completed: { label: '已完成', color: 'success', icon: <CheckCircleOutlined /> },
};

export default function PathDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pathData, setPathData] = useState<any>(null);

  useEffect(() => {
    if (id) loadPath(parseInt(id));
  }, [id]);

  async function loadPath(pathId: number) {
    setLoading(true);
    try {
      const { data } = await getPathById(pathId);
      if (data.code === 0) setPathData(data.data);
    } catch (err) {
      message.error('加载失败');
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(itemId: number, status: string) {
    try {
      await updatePathItem(parseInt(id!), itemId, { status });
      loadPath(parseInt(id!));
    } catch {
      message.error('更新失败');
    }
  }

  async function handleRemoveItem(itemId: number) {
    try {
      await removePathItem(parseInt(id!), itemId);
      message.success('已移除');
      loadPath(parseInt(id!));
    } catch {
      message.error('移除失败');
    }
  }

  async function handleFork() {
    try {
      const { data } = await forkPath(parseInt(id!));
      if (data.code === 0) {
        message.success('Fork 成功');
        navigate('/paths');
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Fork 失败');
    }
  }

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  if (!pathData) return <Empty description="学习路线不存在" />;

  const { progress } = pathData;

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/paths')}>
        返回路线列表
      </Button>

      <Card>
        <Descriptions title={pathData.title} column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="描述">{pathData.description || '暂无'}</Descriptions.Item>
          <Descriptions.Item label="可见性">
            <Tag color={pathData.isPublic ? 'green' : 'default'}>
              {pathData.isPublic ? '公开' : '私有'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="进度">
            <Space>
              <Progress
                percent={progress?.percentage || 0}
                size="small"
                style={{ width: 120 }}
              />
              <Text type="secondary">{progress?.completed || 0}/{progress?.total || 0}</Text>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Fork 数">{pathData.forkCount || 0}</Descriptions.Item>
        </Descriptions>
        {pathData.isPublic && (
          <Button icon={<ForkOutlined />} onClick={handleFork} style={{ marginTop: 12 }}>
            Fork 这条路线
          </Button>
        )}
      </Card>

      <Card title={`路线资源 (${pathData.items?.length || 0})`}>
        {pathData.items?.length > 0 ? (
          <List
            dataSource={pathData.items}
            renderItem={(item: any) => {
              const status = statusMap[item.status] || statusMap.not_started;
              return (
                <List.Item
                  actions={[
                    <Select
                      key="status"
                      value={item.status}
                      style={{ width: 120 }}
                      onChange={(v) => handleStatusChange(item.id, v)}
                      options={[
                        { value: 'not_started', label: '未开始' },
                        { value: 'in_progress', label: '进行中' },
                        { value: 'completed', label: '已完成' },
                      ]}
                    />,
                    <Popconfirm key="remove" title="确定移除？" onConfirm={() => handleRemoveItem(item.id)}>
                      <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        <Tag icon={status.icon} color={status.color}>{status.label}</Tag>
                        <a href={item.resource?.url || '#'} target="_blank" rel="noopener noreferrer">
                          {item.resource?.title || `资源 #${item.resourceId}`}
                        </a>
                      </Space>
                    }
                    description={
                      <Space>
                        {item.resource?.tags?.map((tag: any) => (
                          <Tag key={tag.id} color={tag.color}>{tag.name}</Tag>
                        ))}
                      </Space>
                    }
                  />
                </List.Item>
              );
            }}
          />
        ) : (
          <Empty description="路线中还没有资源" />
        )}
      </Card>
    </Space>
  );
}
