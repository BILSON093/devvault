import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, List, Tag, Space, Button, Input, Select, Typography, message, Empty } from 'antd';
import {
  PlusOutlined,
  EyeOutlined,
  HeartOutlined,
  MessageOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
  GithubOutlined,
  CodeOutlined,
  EditOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import { getResources, deleteResource } from '@/api/resource';

const { Text, Paragraph } = Typography;
const { Option } = Select;

const typeIcons: Record<string, React.ReactNode> = {
  article: <FileTextOutlined />,
  video: <PlayCircleOutlined />,
  repository: <GithubOutlined />,
  snippet: <CodeOutlined />,
  note: <EditOutlined />,
  documentation: <FileTextOutlined />,
};

const typeLabels: Record<string, string> = {
  article: '文章', video: '视频', repository: '仓库', snippet: '代码片段',
  note: '笔记', documentation: '文档', qa: '问答', other: '其他',
};

const coverGradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
];

export default function Resources() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [keyword, setKeyword] = useState('');

  useEffect(() => { loadResources(); }, [page, typeFilter]);

  async function loadResources() {
    setLoading(true);
    try {
      const { data } = await getResources({ page, pageSize: 12, type: typeFilter, keyword: keyword || undefined });
      if (data.code === 0) { setResources(data.data.list); setTotal(data.data.total); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  function handleSearch() { setPage(1); loadResources(); }

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h4 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>资源库</h4>
          <p style={{ color: '#8c8c8c', margin: 0 }}>管理你的所有学习资源</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} className="btn-gradient" onClick={() => navigate('/resources/add')}>
          添加资源
        </Button>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Input.Search
          placeholder="搜索资源..."
          style={{ width: 280 }}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onSearch={handleSearch}
          allowClear
          size="large"
        />
        <Select
          placeholder="类型"
          style={{ width: 140 }}
          allowClear
          size="large"
          value={typeFilter}
          onChange={(v) => { setTypeFilter(v); setPage(1); }}
        >
          {Object.entries(typeLabels).map(([key, label]) => (
            <Option key={key} value={key}>{label}</Option>
          ))}
        </Select>
      </div>

      {resources.length > 0 ? (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3 }}
          loading={loading}
          dataSource={resources}
          pagination={{
            current: page, total, pageSize: 12, onChange: setPage,
            showTotal: (t) => `共 ${t} 个资源`, showSizeChanger: false,
            style: { marginTop: 16 },
          }}
          renderItem={(item: any, index: number) => (
            <List.Item>
              <Card
                className="resource-card"
                hoverable
                cover={
                  item.coverUrl ? (
                    <div style={{ height: 150, overflow: 'hidden' }}>
                      <img src={item.coverUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div
                      className="resource-cover-placeholder"
                      style={{ background: coverGradients[index % coverGradients.length] }}
                    >
                      {typeIcons[item.type] || <FileTextOutlined />}
                    </div>
                  )
                }
                actions={[
                  <Space key="v"><EyeOutlined /> {item.viewCount}</Space>,
                  <Space key="l"><HeartOutlined /> {item._count?.likes || 0}</Space>,
                  <Space key="c"><MessageOutlined /> {item._count?.comments || 0}</Space>,
                  item.url ? <a key="link" href={item.url} target="_blank" rel="noopener noreferrer"><LinkOutlined /></a> : null,
                ].filter(Boolean)}
              >
                <Card.Meta
                  title={
                    <a href={item.url || '#'} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, fontWeight: 600 }}>
                      {item.title}
                    </a>
                  }
                  description={
                    <Space direction="vertical" size={4} style={{ width: '100%' }}>
                      <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ marginBottom: 0, fontSize: 12 }}>
                        {item.description}
                      </Paragraph>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {item.tags?.slice(0, 3).map((tag: any) => (
                          <Tag key={tag.id} color={tag.color} style={{ fontSize: 11 }}>{tag.name}</Tag>
                        ))}
                        {item.source && <Tag style={{ fontSize: 11 }}>{item.source}</Tag>}
                      </div>
                    </Space>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <Card>
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <div className="empty-state-text">还没有资源</div>
            <Button type="primary" className="btn-gradient" onClick={() => navigate('/resources/add')}>
              <PlusOutlined /> 添加第一个资源
            </Button>
          </div>
        </Card>
      )}
    </Space>
  );
}
