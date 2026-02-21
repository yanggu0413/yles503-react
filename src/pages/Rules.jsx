import React, { useState, useEffect } from 'react';
import { Typography, Spin, Result, List, Card, Empty } from 'antd';
import { getPublicRules } from '../services/api';
import { SolutionOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Rules = () => {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRules = async () => {
            try {
                setLoading(true);
                const response = await getPublicRules();
                setRules(response.data);
                setError(null);
            } catch (err) {
                setError('無法載入班規，請稍後再試。');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRules();
    }, []);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
    }

    if (error) {
        return <Result status="error" title="載入失敗" subTitle={error} />;
    }

    return (
        <>
            <Title level={2} style={{ marginBottom: '24px' }}><SolutionOutlined /> 班級公約</Title>
            {rules.length > 0 ? (
                <List
                    grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 1,
                        md: 2,
                        lg: 2,
                        xl: 3,
                        xxl: 3,
                    }}
                    dataSource={rules}
                    renderItem={(rule, index) => (
                        <List.Item>
                            <Card title={`${index + 1}. ${rule.title}`} hoverable>
                                <div dangerouslySetInnerHTML={{ __html: rule.content }} />
                            </Card>
                        </List.Item>
                    )}
                />
            ) : (
                <Empty description="目前尚未新增任何班級公約。" />
            )}
        </>
    );
};

export default Rules;

