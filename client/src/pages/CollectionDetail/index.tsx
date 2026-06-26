import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, List, Tag, Space, Typography, Button, Descriptions, message, Empty, Spin, Popconfirm } from 'antd';
import {
  ArrowLeftOutlined,
  FolderOutlined,
  GlobalOutlined,
  LockOutlined,
  ForkOutlined,
  EyeOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import { getCollectionById, forkCollection, removeResourceFromCollection } from '@/api/collection';

const { Title, Text } = Typography;

export default function CollectionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [collection, setCollection] = useState<any>(null);

  useEffect(() => {
    if (id) loadCollection(parseInt(id));
  }, [id]);

  async function loadCollection(collectionId: number) {
    setLoading(true);
    try {
      const { data } = await getCollectionById(collectionId);
      if (data.code === 0) setCollection(data.data);
    } catch (err) {
      message.error('加载失败');
    } finally {
      setLoading(false);
    }
  }

  async function handleFork() {
    try {
      const { data } = await forkCollection(parseInt(id!));
      if (data.code === 0) {
        message.success('Fork 成功');
        navigate('/collections');
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Fork 失败');
    }
  }

  async function handleRemoveResource(resourceId: number) {
    try {
      const { data } = await removeResourceFromCollection(parseInt(id!), resourceId);
      if (data.code === 0) {
        message.success('已移除');
        loadCollection(parseInt(id!));
      }
    } catch {
      message.error('移除失败');
    }
  }

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  if (!collection) return <Empty description="收藏夹不存在" />;

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/collections')}>
        返回收藏夹列表
      </Button>

      <Card>
        <Descriptions title={collection.name} column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="描述">{collection.description || '暂无'}</Descriptions.Item>
          <Descriptions.Item label="可见性">
            {collection.isPublic ? <Tag icon={<GlobalOutlined />} color="green">公开</Tag> : <Tag icon={<LockOutlined />}>私有</Tag>}
          </Descriptions.Item>
          <Descriptions.Item label="资源数">{collection.resourceCount || 0}</Descriptions.Item>
          <Descriptions.Item label="创建者">{collection.user?.username}</Descriptions.Item>
        </Descriptions>
        {collection.isPublic && (
          <Button icon={<ForkOutlined />} onClick={handleFork} style={{ marginTop: 12 }}>
            Fork 这个收藏夹
          </Button>
        )}
      </Card>

      <Card title={`资源列表 (${collection.resources?.length || 0})`}>
        {collection.resources?.length > 0 ? (
          <List
            dataSource={collection.resources}
            renderItem={(item: any) => (
              <List.Item
                actions={[
                  <Popconfirm key="remove" title="确定移除？" onConfirm={() => handleRemoveResource(item.id)}>
                    <Button type="text" danger>移除</Button>
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <a href={item.url || '#'} target="_blank" rel="noopener noreferrer">
                      {item.title}
                    </a>
                  }
                  description={
                    <Space>
                      {item.tags?.map((tag: any) => (
                        <Tag key={tag.id} color={tag.color}>{tag.name}</Tag>
                      ))}
                      <Text type="secondary"><EyeOutlined /> {item.viewCount}</Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty description="收藏夹里还没有资源" />
        )}
      </Card>
    </Space>
  );
}
