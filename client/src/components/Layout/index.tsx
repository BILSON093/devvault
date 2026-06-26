import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Input, Badge, Dropdown, Avatar, Space, Switch, theme } from 'antd';
import {
  DashboardOutlined,
  BookOutlined,
  FolderOutlined,
  NodeIndexOutlined,
  CompassOutlined,
  PlusOutlined,
  BellOutlined,
  SearchOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  SunOutlined,
  MoonOutlined,
} from '@ant-design/icons';
import { useUserStore } from '@/store/useUserStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useNotificationStore } from '@/store/useNotificationStore';

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: '/', icon: <DashboardOutlined />, label: '仪表盘' },
  { key: '/resources', icon: <BookOutlined />, label: '资源库' },
  { key: '/resources/add', icon: <PlusOutlined />, label: '添加资源' },
  { key: '/collections', icon: <FolderOutlined />, label: '收藏夹' },
  { key: '/paths', icon: <NodeIndexOutlined />, label: '学习路线' },
  { key: '/explore', icon: <CompassOutlined />, label: '探索广场' },
];

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUserStore();
  const { isDark, toggleTheme } = useThemeStore();
  const { unreadCount } = useNotificationStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: '个人主页' },
    { key: 'settings', icon: <SettingOutlined />, label: '设置' },
    { type: 'divider' as const },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true },
  ];

  const handleUserMenu = ({ key }: { key: string }) => {
    if (key === 'profile') navigate('/profile');
    else if (key === 'settings') navigate('/settings');
    else if (key === 'logout') handleLogout();
  };

  const selectedKey = menuItems.find((item) => {
    if (item.key === '/') return location.pathname === '/';
    return location.pathname.startsWith(item.key);
  })?.key || '/';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="light"
        width={220}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 10,
        }}
      >
        <div className="sidebar-logo">
          {collapsed ? (
            <span className="sidebar-logo-collapsed">DV</span>
          ) : (
            <h2>📚 DevVault</h2>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 0, marginTop: 8, fontWeight: 500 }}
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 220, transition: 'margin-left 0.2s' }}>
        <Header className="header-bar" style={{ height: 64 }}>
          <Input.Search
            placeholder="搜索资源、标签、笔记..."
            style={{ maxWidth: 420, borderRadius: 12 }}
            size="large"
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            onSearch={(value) => navigate(`/search?q=${encodeURIComponent(value)}`)}
          />
          <Space size="middle" align="center">
            <Switch
              checked={isDark}
              onChange={toggleTheme}
              checkedChildren={<MoonOutlined />}
              unCheckedChildren={<SunOutlined />}
              style={{ background: isDark ? '#667eea' : undefined }}
            />
            <Badge count={unreadCount} size="small" offset={[-2, 2]}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => navigate('/notifications')}
              >
                <BellOutlined style={{ fontSize: 16, color: '#595959' }} />
              </div>
            </Badge>
            <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenu }} placement="bottomRight">
              <Space style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: 10, transition: 'background 0.2s' }}>
                <Avatar
                  size={32}
                  src={user?.avatar}
                  icon={<UserOutlined />}
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                />
                <span style={{ fontWeight: 600, fontSize: 14 }}>{user?.username}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content style={{ margin: 24, minHeight: 280 }}>
          <div className="fade-in">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
