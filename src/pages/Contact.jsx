import React, { useState, useEffect } from 'react';
import { Typography, Spin, Result, Card, Avatar, Descriptions } from 'antd';
import { getSiteSettings } from '../services/api';
import { UserOutlined, MailOutlined, PhoneOutlined, MessageOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Contact = () => {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setLoading(true);
                const response = await getSiteSettings();
                setSettings(response.data);
                setError(null);
            } catch (err) {
                setError('無法載入聯絡資訊，請稍後再試。');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
    }

    if (error) {
        return <Result status="error" title="載入失敗" subTitle={error} />;
    }

    return (
        <>
            <Title level={2} style={{ marginBottom: '24px' }}><MessageOutlined /> 聯絡老師</Title>
            <Card>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Avatar size={128} icon={<UserOutlined />} />
                    <Title level={3} style={{ marginTop: 16 }}>{settings.teacherName || '林老師'}</Title>
                    <Text type="secondary">503班 班導師</Text>
                </div>

                <Descriptions bordered column={1}>
                    <Descriptions.Item label={<><MailOutlined /> 電子郵件</>}>
                        <a href={`mailto:${settings.contactEmail || 'teacher@example.com'}`}>
                            {settings.contactEmail || 'teacher@example.com'}
                        </a>
                    </Descriptions.Item>
                    <Descriptions.Item label={<><PhoneOutlined /> 校內分機</>}>
                        #123
                    </Descriptions.Item>
                    <Descriptions.Item label="辦公時間">
                        週一至週五，上午 8:00 - 下午 5:00
                    </Descriptions.Item>
                     <Descriptions.Item label="備註">
                        如有要事，建議提前預約。
                    </Descriptions.Item>
                </Descriptions>
            </Card>
        </>
    );
};

export default Contact;

