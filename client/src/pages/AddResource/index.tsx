import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, Form, Input, Select, Switch, Button, Space, Tag, Image,
  Typography, Divider, Spin, message, Alert,
} from 'antd';
import {
  LinkOutlined,
  FileTextOutlined,
  CodeOutlined,
  PlayCircleOutlined,
  GithubOutlined,
  EditOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { createResource } from '@/api/resource';
import { parseUrl, ParsedResult } from '@/api/parse';
import { getTags } from '@/api/tag';
import MDEditor from '@uiw/react-md-editor';

const { Text, Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const resourceTypes = [
  { value: 'article', label: '文章', icon: <FileTextOutlined /> },
  { value: 'video', label: '视频', icon: <PlayCircleOutlined /> },
  { value: 'repository', label: '仓库', icon: <GithubOutlined /> },
  { value: 'snippet', label: '代码片段', icon: <CodeOutlined /> },
  { value: 'note', label: '笔记', icon: <EditOutlined /> },
  { value: 'documentation', label: '文档', icon: <FileTextOutlined /> },
  { value: 'qa', label: '问答', icon: <FileTextOutlined /> },
  { value: 'other', label: '其他', icon: <FileTextOutlined /> },
];

export default function AddResource() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState(false);
  const [parsedResult, setParsedResult] = useState<ParsedResult | null>(null);
  const [allTags, setAllTags] = useState<any[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [noteContent, setNoteContent] = useState('');
  const [resourceType, setResourceType] = useState('article');

  useEffect(() => { loadTags(); }, []);

  async function loadTags() {
    try {
      const { data } = await getTags(100);
      if (data.code === 0) setAllTags(data.data);
    } catch {}
  }

  let parseTimeout: ReturnType<typeof setTimeout>;
  function handleUrlChange(url: string) {
    clearTimeout(parseTimeout);
    setParsed(false);
    setParsedResult(null);
    if (!url || !url.startsWith('http')) return;

    parseTimeout = setTimeout(async () => {
      setParsing(true);
      try {
        const { data } = await parseUrl(url);
        if (data.code === 0) {
          const result = data.data;
          setParsedResult(result);
          setParsed(true);
          form.setFieldsValue({ title: result.title, description: result.description, type: result.type });
          setResourceType(result.type);
          const suggestedTagIds = allTags.filter((t) => result.suggestedTags.includes(t.name)).map((t) => t.id);
          setSelectedTags(suggestedTagIds);
        }
      } catch {
        message.warning('链接解析失败，请手动填写');
      } finally {
        setParsing(false);
      }
    }, 800);
  }

  async function onFinish(values: any) {
    setLoading(true);
    try {
      const { data } = await createResource({
        ...values,
        content: resourceType === 'note' ? noteContent : values.content,
        tagIds: selectedTags,
        isPublic: values.isPublic ?? true,
      });
      if (data.code === 0) {
        message.success('资源创建成功');
        navigate('/resources');
      } else {
        message.error(data.message);
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || '创建失败');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div className="page-header">
        <Title level={4} style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>添加资源</Title>
        <Text type="secondary">粘贴链接自动解析，或手动填写</Text>
      </div>

      <Card style={{ borderRadius: 12 }}>
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ type: 'article', isPublic: true }} size="large">
          {/* URL Input */}
          <Form.Item label={<Text strong>链接</Text>}>
            <Input
              prefix={<LinkOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="粘贴链接后自动解析..."
              onChange={(e) => handleUrlChange(e.target.value)}
              suffix={parsing ? <LoadingOutlined spin style={{ color: '#667eea' }} /> : parsed ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : null}
              style={{ borderRadius: 10, height: 48 }}
            />
          </Form.Item>

          {/* Parsed Preview */}
          {parsedResult && (
            <Alert
              type="success"
              showIcon
              message={
                <Space>
                  <Text strong>自动解析成功</Text>
                  {parsedResult.source && <Tag color="blue">{parsedResult.source}</Tag>}
                  <Tag>{parsedResult.type}</Tag>
                </Space>
              }
              description={
                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                  {parsedResult.cover && (
                    <Image src={parsedResult.cover} width={200} style={{ borderRadius: 8 }} />
                  )}
                </Space>
              }
              style={{ marginBottom: 24, borderRadius: 10 }}
              closable
            />
          )}

          {/* Title */}
          <Form.Item name="title" label={<Text strong>标题</Text>} rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="资源标题" style={{ borderRadius: 10 }} />
          </Form.Item>

          {/* Description */}
          <Form.Item name="description" label={<Text strong>描述</Text>}>
            <TextArea rows={2} placeholder="资源描述" style={{ borderRadius: 10 }} />
          </Form.Item>

          {/* Type */}
          <Form.Item name="type" label={<Text strong>类型</Text>}>
            <Select value={resourceType} onChange={(v) => setResourceType(v)} style={{ borderRadius: 10 }}>
              {resourceTypes.map((t) => (
                <Option key={t.value} value={t.value}>
                  <Space>{t.icon} {t.label}</Space>
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Tags */}
          <Form.Item label={<Text strong>标签</Text>}>
            <Select
              mode="multiple"
              placeholder="选择标签"
              value={selectedTags}
              onChange={setSelectedTags}
              optionFilterProp="children"
              showSearch
              style={{ borderRadius: 10 }}
            >
              {allTags.map((tag) => (
                <Option key={tag.id} value={tag.id}>
                  <Tag color={tag.color} style={{ margin: 0 }}>{tag.name}</Tag>
                </Option>
              ))}
            </Select>
            {parsedResult?.suggestedTags && parsedResult.suggestedTags.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>建议：</Text>
                {parsedResult.suggestedTags.map((tagName) => {
                  const foundTag = allTags.find((t) => t.name === tagName);
                  return (
                    <Tag
                      key={tagName}
                      style={{ cursor: 'pointer', marginLeft: 4 }}
                      color={foundTag?.color}
                      onClick={() => {
                        if (foundTag && !selectedTags.includes(foundTag.id)) {
                          setSelectedTags([...selectedTags, foundTag.id]);
                        }
                      }}
                    >
                      + {tagName}
                    </Tag>
                  );
                })}
              </div>
            )}
          </Form.Item>

          {/* Note content */}
          {resourceType === 'note' && (
            <Form.Item label={<Text strong>笔记内容</Text>}>
              <div data-color-mode="light">
                <MDEditor value={noteContent} onChange={(v) => setNoteContent(v || '')} height={300} />
              </div>
            </Form.Item>
          )}

          {/* URL */}
          <Form.Item name="url" label={<Text strong>链接</Text>}>
            <Input prefix={<LinkOutlined style={{ color: '#bfbfbf' }} />} placeholder="https://..." style={{ borderRadius: 10 }} />
          </Form.Item>

          {/* Code language */}
          {resourceType === 'snippet' && (
            <Form.Item name="language" label={<Text strong>编程语言</Text>}>
              <Select placeholder="选择语言" allowClear style={{ borderRadius: 10 }}>
                {['JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust', 'C', 'C++', 'PHP', 'Ruby', 'SQL', 'Shell'].map((lang) => (
                  <Option key={lang} value={lang}>{lang}</Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {/* Visibility */}
          <Form.Item name="isPublic" label={<Text strong>可见性</Text>} valuePropName="checked">
            <Switch checkedChildren="公开" unCheckedChildren="私有" />
          </Form.Item>

          <Divider />

          {/* Submit */}
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading} className="btn-gradient" style={{ height: 44, borderRadius: 10, fontWeight: 600 }}>
                💾 保存资源
              </Button>
              <Button onClick={() => navigate('/resources')} style={{ height: 44, borderRadius: 10 }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
