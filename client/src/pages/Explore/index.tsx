import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, List, Tag, Space, Typography, Button, Segmented, message, Empty } from 'antd';
import {
  NodeIndexOutlined,
  ForkOutlined,
  GlobalOutlined,
  FireOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { getExplore, forkPath } from '@/api/path';

const { Title, Text } = Typography;

export default function Explore() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paths, setPaths] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    loadPaths();
  }, [page, sort]);

  async function loadPaths() {
    setLoading(true);
    try {
      const { data } = await getExplore(page, 12, sort);
      if (data.code === 0) {
        setPaths(data.data.list);
        setTotal(data.data.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleFork(pathId: number) {
    try {
      const { data } = await forkPath(pathId);
      if (data.code === 0) {
        message.success('Fork 成功，已添加到你的路线');
        loadPaths();
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Fork 失败');
    }
  }

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4} style={{ margin: 0 }}>🧭 探索广场</Title>
        <Segmented
          value={sort}
          onChange={(v) => { setSort(v as string); setPage(1); }}
          options={[
            { label: <Space><ClockCircleOutlined /> 最新</Space>, value: 'newest' },
            { label: <Space><FireOutlined /> 最热</Space>, value: 'popular' },
          ]}
        />
      </div>

      {paths.length > 0 ? (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3 }}
          loading={loading}
          dataSource={paths}
          pagination={{
            current: page,
            total,
            pageSize: 12,
            onChange: setPage,
            showTotal: (t) => `共 ${t} 条公开路线`,
          }}
          renderItem={(item: any) => (
            <List.Item>
              <Card
                hoverable
                onClick={() => navigate(`/paths/${item.id}`)}
                actions={[
                  <Space key="items"><NodeIndexOutlined /> {item._count?.items || 0} 个资源</Space>,
                  <Button
                    key="fork"
                    type="text"
                    icon={<ForkOutlined />}
                    onClick={(e) => { e.stopPropagation(); handleFork(item.id); }}
                  >
                    Fork ({item.forkCount || 0})
                  </Button>,
                ]}
              >
                <Card.Meta
                  title={item.title}
                  description={
                    <Space direction="vertical" size={4}>
                      <Text type="secondary" ellipsis>{item.description || '暂无描述'}</Text>
                      <Space>
                        <Tag icon={<GlobalOutlined />} color="green">公开</Tag>
                        <Text type="secondary" style={{ fontSize: 12 }}>by {item.user?.username}</Text>
                      </Space>
                    </Space>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <Card>
          <Empty description="暂无公开的学习路线" />
        </Card>
      )}
    </Space>
  );
}
