import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, List, Button, Space, Typography, Tag, Modal, Form, Input, Switch, message, Empty, Dropdown } from 'antd';
import {
  PlusOutlined,
  FolderOutlined,
  LockOutlined,
  GlobalOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  ForkOutlined,
} from '@ant-design/icons';
import { getCollections, createCollection, deleteCollection } from '@/api/collection';

const { Text, Title } = Typography;

export default function Collections() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadCollections();
  }, [page]);

  async function loadCollections() {
    setLoading(true);
    try {
      const { data } = await getCollections(page, 12);
      if (data.code === 0) {
        setCollections(data.data.list);
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
      const { data } = await createCollection(values);
      if (data.code === 0) {
        message.success('收藏夹创建成功');
        setModalOpen(false);
        form.resetFields();
        loadCollections();
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || '创建失败');
    }
  }

  async function handleDelete(id: number) {
    try {
      const { data } = await deleteCollection(id);
      if (data.code === 0) {
        message.success('删除成功');
        loadCollections();
      }
    } catch {
      message.error('删除失败');
    }
  }

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4} style={{ margin: 0 }}>📂 我的收藏夹</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
          新建收藏夹
        </Button>
      </div>

      {collections.length > 0 ? (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }}
          loading={loading}
          dataSource={collections}
          pagination={{
            current: page,
            total,
            pageSize: 12,
            onChange: setPage,
            showTotal: (t) => `共 ${t} 个收藏夹`,
          }}
          renderItem={(item: any) => (
            <List.Item>
              <Card
                hoverable
                onClick={() => navigate(`/collections/${item.id}`)}
                actions={[
                  <Space key="count"><FolderOutlined /> {item.resourceCount || 0} 个资源</Space>,
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
                        if (key === 'edit') navigate(`/collections/${item.id}/edit`);
                        if (key === 'delete') handleDelete(item.id);
                      },
                    }}
                  >
                    <MoreOutlined onClick={(e) => e.stopPropagation()} />
                  </Dropdown>,
                ]}
              >
                <Card.Meta
                  avatar={<FolderOutlined style={{ fontSize: 32, color: '#faad14' }} />}
                  title={item.name}
                  description={
                    <Space direction="vertical" size={2}>
                      <Text type="secondary" ellipsis style={{ maxWidth: 200 }}>
                        {item.description || '暂无描述'}
                      </Text>
                      <Space>
                        <Tag color={item.isPublic ? 'green' : 'default'}>
                          {item.isPublic ? '公开' : '私有'}
                        </Tag>
                        {item.children?.length > 0 && (
                          <Tag>{item.children.length} 个子文件夹</Tag>
                        )}
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
          <Empty description="还没有收藏夹">
            <Button type="primary" onClick={() => setModalOpen(true)}>创建第一个收藏夹</Button>
          </Empty>
        </Card>
      )}

      {/* Create Modal */}
      <Modal
        title="新建收藏夹"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="创建"
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
            <Input placeholder="收藏夹名称" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={2} placeholder="描述（可选）" />
          </Form.Item>
          <Form.Item name="isPublic" label="公开" valuePropName="checked" initialValue={false}>
            <Switch checkedChildren="公开" unCheckedChildren="私有" />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}
