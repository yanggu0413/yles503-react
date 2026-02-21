import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Typography, Spin, Result, Button, Space } from 'antd';
import { 
    SoundOutlined, 
    EditOutlined, 
    TeamOutlined, 
    PictureOutlined,
    ArrowRightOutlined
} from '@ant-design/icons';
import { 
    getAdminAnnouncements,
    getAdminAssignments,
    getAllUsers,
    getAdminGallery,
} from '../../services/api';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const [announcementsRes, assignmentsRes, usersRes, galleryRes] = await Promise.all([
                    getAdminAnnouncements(),
                    getAdminAssignments(),
                    getAllUsers(),
                    getAdminGallery(),
                ]);
                setStats({
                    announcements: announcementsRes.data.length,
                    assignments: assignmentsRes.data.length,
                    users: usersRes.data.length,
                    galleryItems: galleryRes.data.length,
                });
                setError(null);
            } catch (err) {
                setError('無法載入總覽數據，請稍後再試。');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
    }

    if (error) {
        return <Result status="error" title="載入失敗" subTitle={error} />;
    }

    return (
        <>
            <Card style={{ marginBottom: 24 }}>
                <Title level={3}>歡迎回來！</Title>
                <Paragraph>這裡是您的管理後台總覽，您可以從這裡快速管理網站的各個部分。</Paragraph>
                <Space wrap>
                    <Link to="/admin/announcements"><Button type="primary">管理公告</Button></Link>
                    <Link to="/admin/assignments"><Button>管理作業</Button></Link>
                    <Link to="/admin/gallery"><Button>管理相簿</Button></Link>
                    <Link to="/admin/settings"><Button>站台設定</Button></Link>
                </Space>
            </Card>

            <Row gutter={[16, 16]}>
                <Col xs={12} sm={12} md={6}>
                    <Card hoverable>
                        <Statistic
                            title="公告總數"
                            value={stats.announcements}
                            prefix={<SoundOutlined />}
                        />
                         <Link to="/admin/announcements"><Text type="secondary">前往管理 <ArrowRightOutlined /></Text></Link>
                    </Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                    <Card hoverable>
                        <Statistic
                            title="作業總數"
                            value={stats.assignments}
                            prefix={<EditOutlined />}
                        />
                         <Link to="/admin/assignments"><Text type="secondary">前往管理 <ArrowRightOutlined /></Text></Link>
                    </Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                    <Card hoverable>
                        <Statistic
                            title="使用者總數"
                            value={stats.users}
                            prefix={<TeamOutlined />}
                        />
                         <Link to="/admin/users"><Text type="secondary">前往管理 <ArrowRightOutlined /></Text></Link>
                    </Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                    <Card hoverable>
                        <Statistic
                            title="相簿項目"
                            value={stats.galleryItems}
                            prefix={<PictureOutlined />}
                        />
                         <Link to="/admin/gallery"><Text type="secondary">前往管理 <ArrowRightOutlined /></Text></Link>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default Dashboard;

