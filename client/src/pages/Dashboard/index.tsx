import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Typography, Space, Spin, Tag, List, Empty, Button } from 'antd';
import {
  BookOutlined,
  FolderOutlined,
  NodeIndexOutlined,
  HeartOutlined,
  PlusOutlined,
  ArrowRightOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import * as echarts from 'echarts';
import { getOverview, getTypeDistribution, getTagRanking, getActivityHeatmap } from '@/api/stats';
import { getResources } from '@/api/resource';
import { useUserStore } from '@/store/useUserStore';

const { Title, Text } = Typography;

const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
];

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<any>({});
  const [recentResources, setRecentResources] = useState<any[]>([]);

  const pieChartRef = useRef<HTMLDivElement>(null);
  const barChartRef = useRef<HTMLDivElement>(null);
  const heatmapChartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [overviewRes, typeRes, tagRes, heatmapRes, recentRes] = await Promise.allSettled([
        getOverview(),
        getTypeDistribution(),
        getTagRanking(),
        getActivityHeatmap(),
        getResources({ page: 1, pageSize: 5 }),
      ]);

      if (overviewRes.status === 'fulfilled' && overviewRes.value.data.code === 0) {
        setOverview(overviewRes.value.data.data);
      }
      if (recentRes.status === 'fulfilled' && recentRes.value.data.code === 0) {
        setRecentResources(recentRes.value.data.data.list);
      }

      // Pie chart
      if (typeRes.status === 'fulfilled' && typeRes.value.data.code === 0 && pieChartRef.current) {
        const typeData = typeRes.value.data.data;
        if (typeData.length > 0) {
          const chart = echarts.init(pieChartRef.current);
          chart.setOption({
            tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)', backgroundColor: 'rgba(255,255,255,0.95)', borderColor: '#eee', textStyle: { color: '#333' } },
            legend: { show: false },
            series: [{
              type: 'pie',
              radius: ['45%', '75%'],
              center: ['50%', '50%'],
              avoidLabelOverlap: false,
              itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 3 },
              label: { show: true, formatter: '{b}\n{d}%', fontSize: 11, color: '#666' },
              emphasis: { label: { show: true, fontSize: 13, fontWeight: 'bold' } },
              color: ['#667eea', '#f5576c', '#4facfe', '#43e97b', '#fa709a', '#fee140', '#a18cd1', '#fbc2eb'],
              data: typeData.map((t: any) => ({ value: t.count, name: t.label })),
            }],
          });
        }
      }

      // Bar chart
      if (tagRes.status === 'fulfilled' && tagRes.value.data.code === 0 && barChartRef.current) {
        const tagData = tagRes.value.data.data.slice(0, 10);
        if (tagData.length > 0) {
          const chart = echarts.init(barChartRef.current);
          chart.setOption({
            tooltip: { trigger: 'axis', backgroundColor: 'rgba(255,255,255,0.95)', borderColor: '#eee', textStyle: { color: '#333' } },
            grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
            xAxis: {
              type: 'category',
              data: tagData.map((t: any) => t.name),
              axisLabel: { fontSize: 11, color: '#8c8c8c' },
              axisLine: { lineStyle: { color: '#f0f0f0' } },
              axisTick: { show: false },
            },
            yAxis: {
              type: 'value',
              axisLabel: { fontSize: 11, color: '#bfbfbf' },
              splitLine: { lineStyle: { color: '#f5f5f5' } },
            },
            series: [{
              type: 'bar',
              data: tagData.map((t: any) => ({
                value: t.count,
                itemStyle: {
                  borderRadius: [6, 6, 0, 0],
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: t.color || '#667eea' },
                    { offset: 1, color: (t.color || '#667eea') + '80' },
                  ]),
                },
              })),
              barWidth: '50%',
            }],
          });
        }
      }

      // Heatmap
      if (heatmapRes.status === 'fulfilled' && heatmapRes.value.data.code === 0 && heatmapChartRef.current) {
        const heatmapData = heatmapRes.value.data.data;
        if (heatmapData.length > 0) {
          const chart = echarts.init(heatmapChartRef.current);
          const maxVal = Math.max(...heatmapData.map((d: any) => d[1]), 5);
          chart.setOption({
            tooltip: {
              formatter: (params: any) => `${params.value[0]}: ${params.value[1]} 个资源`,
              backgroundColor: 'rgba(255,255,255,0.95)',
              borderColor: '#eee',
              textStyle: { color: '#333' },
            },
            visualMap: {
              show: false,
              min: 0,
              max: maxVal,
              inRange: { color: ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'] },
            },
            calendar: {
              top: 20,
              left: 40,
              right: 20,
              cellSize: ['auto', 14],
              range: new Date().getFullYear().toString(),
              itemStyle: { borderWidth: 2, borderColor: '#fff', borderRadius: 3 },
              yearLabel: { show: false },
              dayLabel: { nameMap: 'ZH', firstDay: 1, fontSize: 10, color: '#bfbfbf' },
              monthLabel: { nameMap: 'ZH', fontSize: 11, color: '#8c8c8c' },
            },
            series: [{
              type: 'heatmap',
              coordinateSystem: 'calendar',
              data: heatmapData,
            }],
          });
          const resizeObserver = new ResizeObserver(() => chart.resize());
          resizeObserver.observe(heatmapChartRef.current);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const stats = [
    { label: '资源总数', value: overview.totalResources || 0, icon: <BookOutlined />, color: '#667eea', bg: '#f0f3ff', sub: `本周 +${overview.weeklyResources || 0}` },
    { label: '收藏夹', value: overview.totalCollections || 0, icon: <FolderOutlined />, color: '#f5576c', bg: '#fff0f3', sub: null },
    { label: '学习路线', value: overview.totalPaths || 0, icon: <NodeIndexOutlined />, color: '#4facfe', bg: '#f0f8ff', sub: null },
    { label: '获得点赞', value: overview.totalLikes || 0, icon: <HeartOutlined />, color: '#43e97b', bg: '#f0fff4', sub: null },
  ];

  return (
    <Spin spinning={loading}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Welcome */}
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <Title level={4} style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>
              你好，{user?.username} 👋
            </Title>
            <Text type="secondary" style={{ fontSize: 14 }}>这是你的学习数据概览</Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="btn-gradient"
            onClick={() => navigate('/resources/add')}
          >
            添加资源
          </Button>
        </div>

        {/* Stat Cards */}
        <Row gutter={[16, 16]}>
          {stats.map((stat, i) => (
            <Col xs={12} sm={6} key={i}>
              <Card className="stat-card" hoverable onClick={() => {
                if (i === 0) navigate('/resources');
                if (i === 1) navigate('/collections');
                if (i === 2) navigate('/paths');
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>{stat.label}</Text>
                    <div style={{ fontSize: 32, fontWeight: 800, color: '#262626', lineHeight: 1.2, marginTop: 4 }}>
                      {stat.value}
                    </div>
                    {stat.sub && (
                      <Text type="secondary" style={{ fontSize: 12 }}>{stat.sub}</Text>
                    )}
                  </div>
                  <div className="stat-icon" style={{ background: stat.bg, color: stat.color }}>
                    {stat.icon}
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Charts */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <Card className="chart-card" title="📊 资源类型分布" style={{ height: 340 }}>
              <div ref={pieChartRef} style={{ width: '100%', height: 260 }} />
            </Card>
          </Col>
          <Col xs={24} lg={16}>
            <Card className="chart-card" title="🏷️ 标签使用排行" style={{ height: 340 }}>
              <div ref={barChartRef} style={{ width: '100%', height: 260 }} />
            </Card>
          </Col>
        </Row>

        {/* Heatmap */}
        <Card className="chart-card" title="📅 学习活跃度" style={{ minHeight: 200 }}>
          <div ref={heatmapChartRef} style={{ width: '100%', height: 170 }} />
        </Card>

        {/* Recent */}
        <Card
          className="chart-card"
          title="最近添加"
          extra={<a onClick={() => navigate('/resources')} style={{ fontWeight: 600 }}>查看全部 <ArrowRightOutlined /></a>}
        >
          {recentResources.length > 0 ? (
            <List
              dataSource={recentResources}
              renderItem={(item: any) => (
                <List.Item
                  style={{ cursor: 'pointer', borderRadius: 8, padding: '12px 8px' }}
                  onClick={() => navigate('/resources')}
                >
                  <List.Item.Meta
                    title={
                      <a href={item.url || '#'} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600 }}>
                        {item.title}
                      </a>
                    }
                    description={
                      <Space size={4}>
                        {item.tags?.slice(0, 3).map((tag: any) => (
                          <Tag key={tag.id} color={tag.color} style={{ fontSize: 11 }}>{tag.name}</Tag>
                        ))}
                        <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
                          <EyeOutlined /> {item.viewCount}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <div className="empty-state-text">还没有资源，去添加第一个吧</div>
              <Button type="primary" className="btn-gradient" onClick={() => navigate('/resources/add')}>
                <PlusOutlined /> 添加资源
              </Button>
            </div>
          )}
        </Card>
      </Space>
    </Spin>
  );
}
