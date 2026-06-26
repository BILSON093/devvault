import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, List, Button, Space, Typography, Tag, Progress, Modal, Form, Input, Switch, message, Empty, Dropdown } from 'antd';
import {
  PlusOutlined,
  NodeIndexOutlined,
  GlobalOutlined,
  LockOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  ForkOutlined,
} from '@ant-design/icons';
import { getPaths, createPath, deletePath } from '@/api/path';

const { Title, Text } = Typography;

export default function LearningPaths() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paths, setPaths] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadPaths();
  }, [page]);

  async function loadPaths() {
    setLoading(true);
    try {
      const { data } = await getPaths(page, 12);
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

  async function handleCreate(values: any) {
    try {
      const { data } = await createPath(values);
      if (data.code === 0) {
        message.success('学习路线创建成功');
        setModalOpen(false);
        form.resetFields();
        loadPaths();
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || '创建失败');
    }
  }

  async function handleDelete(id: number) {
    try {
      const { data } = await deletePath(id);
      if (data.code === 0) {
        message.success('删除成功');
        loadPaths();
      }
    } catch {
      message.error('删除失败');
    }
  }

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4} style={{ margin: 0 }}>🗺️ 我的学习路线</Title>
        <Space>
          <Button onClick={() => navigate('/explore')}>探索广场</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
            新建路线
          </Button>
        </Space>
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
            showTotal: (t) => `共 ${t} 条路线`,
          }}
          renderItem={(item: any) => {
            const totalItems = item._count?.items || 0;
            return (
              <List.Item>
                <Card
                  hoverable
                  onClick={() => navigate(`/paths/${item.id}`)}
                  actions={[
                    <Space key="items"><NodeIndexOutlined /> {totalItems} 个资源</Space>,
                    <Space key="fork"><ForkOutlined /> {item.forkCount || 0}</Space>,
                    item.isPublic ? <GlobalOutlined key="public" /> : <LockOutlined key="private" />,
                    <Dropdown
                      key="more"
                      menu={{
                        items: [
                          { key: 'edit', icon: <EditOutlined />, label: '编辑' },
                          { key: 'delete', icon: <DeleteOutlined />, label: '删除', danger: true },
                        ],
                        onClick: ({ key, domEvent }) => {
                          domEvent.stopPropagation();
                          if (key === 'delete') handleDelete(item.id);
                        },
                      }}
                    >
                      <MoreOutlined onClick={(e) => e.stopPropagation()} />
                    </Dropdown>,
                  ]}
                >
                  <Card.Meta
                    title={item.title}
                    description={
                      <Space direction="vertical" size={4} style={{ width: '100%' }}>
                        <Text type="secondary" ellipsis>{item.description || '暂无描述'}</Text>
                        <Space>
                          <Tag color={item.isPublic ? 'green' : 'default'}>
                            {item.isPublic ? '公开' : '私有'}
                          </Tag>
                          {item.forkFrom && <Tag color="blue">Fork</Tag>}
                        </Space>
                      </Space>
                    }
                  />
                </Card>
              </List.Item>
            );
          }}
        />
      ) : (
        <Card>
          <Empty description="还没有学习路线">
            <Space>
              <Button type="primary" onClick={() => setModalOpen(true)}>创建路线</Button>
              <Button onClick={() => navigate('/explore')}>去探索广场看看</Button>
            </Space>
          </Empty>
        </Card>
      )}

      {/* Create Modal */}
      <Modal
        title="新建学习路线"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="创建"
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="如：React 进阶学习路线" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} placeholder="路线描述（可选）" />
          </Form.Item>
          <Form.Item name="isPublic" label="公开" valuePropName="checked" initialValue={false}>
            <Switch checkedChildren="公开" unCheckedChildren="私有" />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}
