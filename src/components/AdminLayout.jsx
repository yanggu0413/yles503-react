import React, { useState } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Typography, Space, Tooltip, theme, Breadcrumb } from 'antd';
import {
    DashboardOutlined,
    SoundOutlined,
    EditOutlined,
    CalendarOutlined,
    PictureOutlined,
    SettingOutlined,
    TeamOutlined,
    SolutionOutlined,
    LinkOutlined as LinkIcon,
    LogoutOutlined,
    HomeOutlined,
    ReadOutlined,
} from '@ant-design/icons';

const { Header, Content, Sider, Footer } = Layout;
const { Title, Text } = Typography;

const menuItems = [
    { key: '/admin', icon: <DashboardOutlined />, label: '總覽', title: '總覽' },
    { key: '/admin/announcements', icon: <SoundOutlined />, label: '公告管理', title: '公告管理' },
    { key: '/admin/assignments', icon: <EditOutlined />, label: '作業管理', title: '作業管理' },
    { key: '/admin/schedule', icon: <CalendarOutlined />, label: '課表管理', title: '課表管理' },
    { key: '/admin/gallery', icon: <PictureOutlined />, label: '相簿管理', title: '相簿管理' },
    { key: '/admin/resources', icon: <LinkIcon />, label: '資源管理', title: '資源管理' },
    { key: '/admin/rules', icon: <SolutionOutlined />, label: '班規管理', title: '班規管理' },
    { key: '/admin/users', icon: <TeamOutlined />, label: '使用者管理', title: '使用者管理' },
    { key: '/admin/settings', icon: <SettingOutlined />, label: '站台設定', title: '站台設定' },
];

// Function to generate breadcrumb items
const getBreadcrumbItems = (pathname) => {
    const pathSnippets = pathname.split('/').filter(i => i);
    const breadcrumbItems = [
        <Breadcrumb.Item key="home">
            <Link to="/admin">管理後台</Link>
        </Breadcrumb.Item>
    ];

    let currentPath = '';
    pathSnippets.slice(1).forEach(snippet => {
        currentPath = `/admin/${snippet}`;
        const menuItem = menuItems.find(item => item.key === currentPath);
        if(menuItem) {
            breadcrumbItems.push(
                <Breadcrumb.Item key={currentPath}>
                    <Link to={currentPath}>{menuItem.label}</Link>
                </Breadcrumb.Item>
            );
        }
    });

    return breadcrumbItems;
};


const SiderMenu = ({ currentPath }) => (
    <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[currentPath]}
        style={{ background: '#1677ff' }}
        items={menuItems.map(item => ({
            key: item.key,
            icon: item.icon,
            label: <Link to={item.key}>{item.label}</Link>
        }))}
    />
);

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const handleLogout = () => {
        // In a real app, also call API to invalidate token
        localStorage.removeItem('token');
        navigate('/login');
    };

    const breadcrumbItems = getBreadcrumbItems(location.pathname);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} style={{ background: '#1677ff' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '64px', gap: '8px' }}>
                    <ReadOutlined style={{ fontSize: '24px', color: 'white' }} />
                    {!collapsed && <Title level={4} style={{ color: 'white', margin: 0, whiteSpace: 'nowrap' }}>管理後台</Title>}
                </div>
                <SiderMenu currentPath={location.pathname} />
            </Sider>
            <Layout>
                <Header style={{ padding: '0 24px', background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <Breadcrumb>{breadcrumbItems}</Breadcrumb>
                    <Space>
                        <Tooltip title="回到前台網站">
                            <Button shape="circle" icon={<HomeOutlined />} onClick={() => navigate('/')} />
                        </Tooltip>
                        <Tooltip title="登出">
                            <Button danger shape="circle" icon={<LogoutOutlined />} onClick={handleLogout} />
                        </Tooltip>
                    </Space>
                </Header>
                <Content style={{ margin: '24px 16px 0' }}>
                    <div style={{ padding: 24, minHeight: 'calc(100vh - 64px - 48px - 70px)', background: colorBgContainer, borderRadius: borderRadiusLG }}>
                        <Outlet />
                    </div>
                </Content>
                 <Footer style={{ textAlign: 'center' }}>
                    <Text type="secondary">後台管理介面 &copy; {new Date().getFullYear()}</Text>
                </Footer>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
