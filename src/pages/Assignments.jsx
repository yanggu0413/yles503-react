import React, { useState, useEffect } from 'react';
import { Timeline, Typography, Spin, Result, Card, Tag, Empty, theme } from 'antd';
import { getPublicAssignments } from '../services/api';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { EditOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

dayjs.extend(isBetween);

const { Title, Text } = Typography;

const Assignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = theme.useToken();

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                setLoading(true);
                const response = await getPublicAssignments();
                const sortedData = response.data.sort((a, b) => dayjs(b.deadline).diff(dayjs(a.deadline)));
                setAssignments(sortedData);
                setError(null);
            } catch (err) {
                setError('無法載入作業，請稍後再試。');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignments();
    }, []);

    const getTimelineItem = (item) => {
        const now = dayjs();
        const deadline = dayjs(item.deadline);
        const isPast = now.isAfter(deadline);
        const isCurrent = now.isBetween(dayjs(item.created_at), deadline);

        let color = token.colorPrimary;
        let icon = <ClockCircleOutlined />;
        
        if (isPast) {
            color = 'gray';
            icon = <CheckCircleOutlined />;
        } else if (isCurrent) {
            color = 'blue';
            icon = <EditOutlined />;
        }

        return {
            color: color,
            dot: icon,
            children: (
                <Card 
                    style={{ marginBottom: 16 }}
                    title={`${item.subject}: ${item.title}`}
                    extra={<Tag color={isPast ? 'red' : 'green'}>{isPast ? '已截止' : '進行中'}</Tag>}
                >
                    <div dangerouslySetInnerHTML={{ __html: item.content }} />
                    <Text strong type={isPast ? 'secondary' : 'danger'} style={{ display: 'block', marginTop: 16 }}>
                        繳交期限: {deadline.format('YYYY-MM-DD')}
                    </Text>
                </Card>
            ),
        };
    };
    
    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
    }

    if (error) {
        return <Result status="error" title="載入失敗" subTitle={error} />;
    }

    return (
        <>
            <Title level={2} style={{ marginBottom: '24px' }}><EditOutlined /> 班級作業</Title>
            {assignments.length > 0 ? (
                <Timeline
                    mode="alternate"
                    items={assignments.map(getTimelineItem)}
                />
            ) : (
                <Empty description="目前沒有任何作業。" />
            )}
        </>
    );
};

export default Assignments;

