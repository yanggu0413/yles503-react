import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Row, Col, Card, List, Spin, Tag, Space, Empty, Result } from 'antd';
import { getPublicAnnouncements, getPublicAssignments } from '../services/api';
import { RightCircleOutlined, NotificationOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Paragraph, Text } = Typography;

const HomePage = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [announcementsRes, assignmentsRes] = await Promise.all([
                    getPublicAnnouncements(),
                    getPublicAssignments(),
                ]);
                // Get latest 5
                setAnnouncements(announcementsRes.data.slice(0, 5));
                setAssignments(assignmentsRes.data.slice(0, 5));
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const renderListItem = (item, type) => {
        const isAnnouncement = type === 'announcement';
        const linkTo = isAnnouncement ? `/announcements` : `/assignments`;
        const date = dayjs(item.updated_at || item.created_at).format('YYYY-MM-DD');
        const deadline = item.deadline ? dayjs(item.deadline).format('YYYY-MM-DD') : null;

        return (
            <List.Item
                actions={[<Link to={linkTo}><Button type="link" icon={<RightCircleOutlined />}>查看</Button></Link>]}
            >
                <List.Item.Meta
                    title={<Text>{item.title}</Text>}
                    description={
                        <Space>
                            <Tag color={isAnnouncement ? "blue" : "green"}>
                                {isAnnouncement ? "公告" : "作業"}
                            </Tag>
                            <Text type="secondary">{date}</Text>
                            {deadline && <Text type="danger">截止日期: {deadline}</Text>}
                        </Space>
                    }
                />
            </List.Item>
        );
    }


    return (
        <Spin spinning={loading}>
            <div className="welcome-section" style={{ animation: 'fadeInUp 0.8s ease-out' }}>
                <Title level={2} style={{ color: 'white', marginBottom: 8 }}>歡迎來到雲林國小 503 班級網站</Title>
                <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, marginBottom: 24 }}>
                    這裡是我們分享公告、作業、學習資源和班級活動的地方
                </Paragraph>
                <Space>
                    <Button size="large" style={{ background: 'white', border: 'none', color: '#1677ff' }} onClick={() => window.scrollTo(0, 500)}>
                        快速開始
                    </Button>
                    <Link to="/contact">
                        <Button size="large" ghost style={{ borderColor: 'white', color: 'white' }}>
                            聯絡老師
                        </Button>
                    </Link>
                </Space>
            </div>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                    <Card
                        title={<><NotificationOutlined /> 最新公告</>}
                        extra={<Link to="/announcements">更多</Link>}
                    >
                        <List
                            itemLayout="horizontal"
                            dataSource={announcements}
                            renderItem={(item) => renderListItem(item, 'announcement')}
                            locale={{ emptyText: <Empty description="目前沒有公告" /> }}
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card
                        title={<><EditOutlined /> 最近作業</>}
                        extra={<Link to="/assignments">更多</Link>}
                    >
                        <List
                            itemLayout="horizontal"
                            dataSource={assignments}
                            renderItem={(item) => renderListItem(item, 'assignment')}
                            locale={{ emptyText: <Empty description="目前沒有作業" /> }}
                        />
                    </Card>
                </Col>
            </Row>
        </Spin>
    );
};

export default HomePage;