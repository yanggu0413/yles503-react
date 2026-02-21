import React, { useState, useEffect } from 'react';
import { Typography, Spin, Result, Card, Col, Row, Empty, Tabs } from 'antd';
import { getPublicResources } from '../services/api';
import { LinkOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

const Resources = () => {
    const [resources, setResources] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                setLoading(true);
                const response = await getPublicResources();
                const grouped = response.data.reduce((acc, item) => {
                    const category = item.category || '其他';
                    if (!acc[category]) acc[category] = [];
                    acc[category].push(item);
                    return acc;
                }, {});
                setResources(grouped);
                setError(null);
            } catch (err) {
                setError('無法載入資源，請稍後再試。');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchResources();
    }, []);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
    }

    if (error) {
        return <Result status="error" title="載入失敗" subTitle={error} />;
    }

    return (
        <>
            <Title level={2} style={{ marginBottom: '24px' }}><LinkOutlined /> 學習資源</Title>
            {Object.keys(resources).length > 0 ? (
                <Tabs defaultActiveKey="0" tabPosition="top">
                    {Object.entries(resources).map(([category, items], index) => (
                        <TabPane tab={category} key={index}>
                            <Row gutter={[16, 16]} style={{padding: '16px 0'}}>
                                {items.map(item => (
                                    <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                                            <Card hoverable>
                                                <Card.Meta
                                                    title={item.title}
                                                    description={<Paragraph ellipsis={{rows: 2}}>{item.description}</Paragraph>}
                                                />
                                            </Card>
                                        </a>
                                    </Col>
                                ))}
                            </Row>
                        </TabPane>
                    ))}
                </Tabs>
            ) : (
                <Empty description="目前沒有可顯示的學習資源。" />
            )}
        </>
    );
};

export default Resources;

