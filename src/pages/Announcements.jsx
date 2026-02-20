import React, { useState, useEffect } from 'react';
import { List, Typography, Spin, Alert, Card, Empty, Result, Tag } from 'antd';
import { getPublicAnnouncements } from '../services/api';
import dayjs from 'dayjs';
import { NotificationOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                setLoading(true);
                const response = await getPublicAnnouncements();
                const sortedData = response.data.sort((a, b) => dayjs(b.created_at).diff(dayjs(a.created_at)));
                setAnnouncements(sortedData);
                setError(null);
            } catch (err) {
                setError('無法載入公告，請稍後再試。');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
    }

    if (error) {
        return <Result status="error" title="載入失敗" subTitle={error} />;
    }

    return (
        <>
            <Title level={2} style={{ marginBottom: '24px' }}><NotificationOutlined /> 班級公告</Title>
            {announcements.length > 0 ? (
                <List
                    grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 1,
                        md: 1,
                        lg: 1,
                        xl: 1,
                        xxl: 1,
                    }}
                    dataSource={announcements}
                    renderItem={item => (
                        <List.Item>
                            <Card
                                title={item.title}
                                extra={<Tag color="blue">{dayjs(item.created_at).format('YYYY-MM-DD')}</Tag>}
                            >
                                <div className="announcement-content" dangerouslySetInnerHTML={{ __html: item.content }} />
                                <Paragraph type="secondary" style={{ textAlign: 'right', marginTop: '16px', marginBottom: 0 }}>
                                    最後更新於: {dayjs(item.updated_at).format('YYYY-MM-DD HH:mm')}
                                </Paragraph>
                            </Card>
                        </List.Item>
                    )}
                />
            ) : (
                <Empty description="目前沒有任何公告。" />
            )}
        </>
    );
};

export default Announcements;

