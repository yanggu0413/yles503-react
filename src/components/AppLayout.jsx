import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout, Typography, Card } from 'antd';
import MainMenu from './MainMenu';
import { ReadOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const AppLayout = () => {

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ display: 'flex', alignItems: 'center', padding: '0 24px', background: '#1677ff', height: 64 }}>
                <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: 24 }}>
                    <ReadOutlined style={{ fontSize: '24px', color: 'white' }} />
                    <Title level={4} style={{ color: 'white', margin: 0, whiteSpace: 'nowrap' }}>
                        雲林國小 503 班
                    </Title>
                </div>
                <MainMenu />
            </Header>
            <Content style={{ padding: '24px 48px', background: '#f5f7fa' }}>
                <Card
                    style={{
                        background: '#ffffff',
                        borderRadius: 12,
                        minHeight: 'calc(100vh - 64px - 80px)'
                    }}
                >
                    <Outlet />
                </Card>
            </Content>
            <Footer style={{ textAlign: 'center', background: '#ffffff' }}>
                <Text type="secondary">雲林國小 503 班級網站 &copy; {new Date().getFullYear()}</Text>
            </Footer>
        </Layout>
    );
};

export default AppLayout;