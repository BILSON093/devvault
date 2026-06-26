import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, List, Tag, Space, Typography, Input, Select, message, Empty } from 'antd';
import { SearchOutlined, EyeOutlined, HeartOutlined } from '@ant-design/icons';
import { search } from '@/api/search';

const { Text, Title } = Typography;

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState(searchParams.get('q') || '');
  const [typeFilter, setTypeFilter] = useState<string | undefined>();

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setKeyword(q);
      doSearch(q, typeFilter, 1);
    }
  }, [searchParams]);

  async function doSearch(q: string, type?: string, p = page) {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const { data } = await search({ q, type, page: p, pageSize: 20 });
      if (data.code === 0) {
        setResults(data.data.list);
        setTotal(data.data.total);
        setPage(p);
      }
    } catch (err) {
      message.error('搜索失败');
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(value: string) {
    setSearchParams({ q: value });
  }

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Title level={4} style={{ margin: 0 }}>🔍 搜索</Title>

      <Space wrap>
        <Input.Search
          placeholder="搜索资源..."
          style={{ width: 400 }}
          size="large"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onSearch={handleSearch}
          prefix={<SearchOutlined />}
          allowClear
        />
        <Select
          placeholder="类型"
          style={{ width: 140 }}
          size="large"
          allowClear
          value={typeFilter}
          onChange={(v) => { setTypeFilter(v); doSearch(keyword, v, 1); }}
          options={[
            { value: 'article', label: '文章' },
            { value: 'video', label: '视频' },
            { value: 'repository', label: '仓库' },
            { value: 'snippet', label: '代码片段' },
            { value: 'note', label: '笔记' },
            { value: 'documentation', label: '文档' },
          ]}
        />
      </Space>

      {total > 0 && (
        <Text type="secondary">找到 {total} 个结果</Text>
      )}

      {results.length > 0 ? (
        <List
          loading={loading}
          dataSource={results}
          pagination={{
            current: page,
            total,
            pageSize: 20,
            onChange: (p) => doSearch(keyword, typeFilter, p),
          }}
          renderItem={(item: any) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <a href={item.url || '#'} target="_blank" rel="noopener noreferrer">
                    {item.title}
                  </a>
                }
                description={
                  <Space direction="vertical" size={4}>
                    <Text type="secondary">{item.description}</Text>
                    <Space>
                      {item.tags?.map((tag: any) => (
                        <Tag key={tag.id} color={tag.color}>{tag.name}</Tag>
                      ))}
                      <Text type="secondary"><EyeOutlined /> {item.viewCount}</Text>
                      <Text type="secondary"><HeartOutlined /> {item._count?.likes || 0}</Text>
                    </Space>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        !loading && keyword && <Card><Empty description="没有找到相关资源" /></Card>
      )}
    </Space>
  );
}
