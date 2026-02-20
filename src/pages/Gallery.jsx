import React, { useState, useEffect } from 'react';
import { Typography, Spin, Result, Row, Col, Card, Image, Empty } from 'antd';
import { getPublicGallery } from '../services/api';
import dayjs from 'dayjs';
import { CameraOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Gallery = () => {
    const [gallery, setGallery] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                setLoading(true);
                const response = await getPublicGallery();
                const sortedData = response.data.sort((a, b) => dayjs(b.created_at).diff(dayjs(a.created_at)));
                setGallery(sortedData);
                setError(null);
            } catch (err) {
                setError('無法載入相簿，請稍後再試。');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchGallery();
    }, []);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
    }

    if (error) {
        return <Result status="error" title="載入失敗" subTitle={error} />;
    }

    return (
        <>
            <Title level={2} style={{ marginBottom: '24px' }}><CameraOutlined /> 班級相簿</Title>
            {gallery.length > 0 ? (
                 <Image.PreviewGroup>
                    <Row gutter={[16, 16]}>
                        {gallery.map(item => (
                            <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                                <Card
                                    hoverable
                                    cover={<Image alt={item.title} src={item.image_url} style={{ height: 200, objectFit: 'cover' }} />}
                                >
                                    <Card.Meta 
                                        title={item.title} 
                                        description={<Text type="secondary">{dayjs(item.created_at).format('YYYY-MM-DD')}</Text>}
                                    />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                 </Image.PreviewGroup>
            ) : (
                <Empty description="目前相簿中沒有任何照片。" />
            )}
        </>
    );
};

export default Gallery;

