import React, { useState, useEffect } from 'react';
import { Typography, Spin, Result, Image, Table, Tag, Empty } from 'antd';
import { getPublicSchedule, getSiteSettings } from '../services/api';
import { CalendarOutlined } from '@ant-design/icons';

const { Title } = Typography;

const columns = [
    {
        title: '時間',
        dataIndex: 'time',
        key: 'time',
        align: 'center',
        render: (text) => <strong>{text}</strong>,
    },
    { title: '星期一', dataIndex: 'mon', key: 'mon', align: 'center' },
    { title: '星期二', dataIndex: 'tue', key: 'tue', align: 'center' },
    { title: '星期三', dataIndex: 'wed', key: 'wed', align: 'center' },
    { title: '星期四', dataIndex: 'thu', key: 'thu', align: 'center' },
    { title: '星期五', dataIndex: 'fri', key: 'fri', align: 'center' },
];

const Schedule = () => {
    const [scheduleData, setScheduleData] = useState([]);
    const [scheduleImage, setScheduleImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                setLoading(true);
                const [scheduleRes, settingsRes] = await Promise.all([
                    getPublicSchedule(),
                    getSiteSettings(),
                ]);

                if (scheduleRes.data) {
                    setScheduleData(scheduleRes.data);
                }
                if (settingsRes.data && settingsRes.data.scheduleImage) {
                    setScheduleImage(settingsRes.data.scheduleImage);
                }
                setError(null);
            } catch (err) {
                setError('無法載入課表，請稍後再試。');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
    }, []);

    const renderContent = () => {
        if (loading) {
            return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
        }
        if (error) {
            return <Result status="error" title="載入失敗" subTitle={error} />;
        }
        if (scheduleData.length === 0 && !scheduleImage) {
            return <Empty description="目前沒有可顯示的課表。" />;
        }

        return (
            <>
                {scheduleImage && (
                    <Image 
                        src={scheduleImage} 
                        alt="班級課表圖片" 
                        style={{ maxWidth: '100%', marginBottom: 24, border: '1px solid #f0f0f0', borderRadius: '8px' }} 
                    />
                )}
                {scheduleData.length > 0 && (
                    <Table
                        columns={columns}
                        dataSource={scheduleData}
                        bordered
                        pagination={false}
                        rowKey="time"
                    />
                )}
            </>
        );
    };

    return (
        <>
            <Title level={2} style={{ marginBottom: '24px' }}><CalendarOutlined /> 班級課表</Title>
            {renderContent()}
        </>
    );
};

export default Schedule;

