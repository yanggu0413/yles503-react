import React, { useState, useEffect, useCallback } from 'react';
import { Upload, Button, App, Typography, Card, Col, Row, Popconfirm, Image, Modal, Form, Input, Empty, Spin } from 'antd';
import { UploadOutlined, DeleteOutlined, EditOutlined, PictureOutlined } from '@ant-design/icons';
import { getAdminGallery, uploadGalleryImage, deleteGalleryItem, updateGalleryItem } from '../../services/api';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const AdminGallery = () => {
    const [gallery, setGallery] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();
    const { message, notification } = App.useApp();


    const fetchGallery = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getAdminGallery();
            setGallery(response.data.sort((a, b) => dayjs(b.created_at).diff(dayjs(a.created_at))));
        } catch {
            message.error('無法載入相簿列表');
        } finally {
            setLoading(false);
        }
    }, [message]);

    useEffect(() => {
        fetchGallery();
    }, [fetchGallery]);

    const handleUpload = async (options) => {
        const { file, onSuccess, onError } = options;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', file.name); // Use filename as default title

        setUploading(true);
        try {
            await uploadGalleryImage(formData);
            notification.success({ message: `'${file.name}' 上傳成功`});
            onSuccess();
            fetchGallery();
        } catch (error) {
            notification.error({ message: `'${file.name}' 上傳失敗`});
            onError(error);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteGalleryItem(id);
            message.success('圖片刪除成功');
            fetchGallery();
        } catch {
            message.error('刪除失敗');
        }
    };

    const showEditModal = (record) => {
        setEditingRecord(record);
        form.setFieldsValue({ title: record.title });
        setIsModalOpen(true);
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
        setEditingRecord(null);
        form.resetFields();
    };

    const handleModalOk = () => {
        form.validateFields().then(async (values) => {
            try {
                await updateGalleryItem(editingRecord.id, values);
                message.success('標題更新成功');
                handleModalCancel();
                fetchGallery();
            } catch {
                message.error('更新失敗');
            }
        });
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
    }

    return (
        <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={3} style={{margin:0}}><PictureOutlined /> 相簿管理</Title>
                <Upload
                    customRequest={handleUpload}
                    showUploadList={false}
                    disabled={uploading}
                    accept="image/*"
                    multiple
                >
                    <Button icon={<UploadOutlined />} loading={uploading}>上傳圖片</Button>
                </Upload>
            </div>
            {gallery.length > 0 ? (
                <Row gutter={[16, 16]}>
                    {gallery.map(item => (
                        <Col xs={12} sm={8} md={6} key={item.id}>
                            <Card
                                cover={<Image alt={item.title} src={item.image_url} style={{ height: 180, objectFit: 'cover' }} />}
                                actions={[
                                    <Button type="text" icon={<EditOutlined />} key="edit" onClick={() => showEditModal(item)} />,
                                    <Popconfirm title="確定要刪除圖片嗎？" onConfirm={() => handleDelete(item.id)} okText="確定" cancelText="取消">
                                        <Button type="text" danger icon={<DeleteOutlined />} key="delete" />
                                    </Popconfirm>,
                                ]}
                            >
                                <Card.Meta title={item.title || '無標題'} description={<Text type="secondary">{dayjs(item.created_at).format('YYYY-MM-DD')}</Text>} />
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <Empty description="目前相簿中沒有任何照片，點擊右上角按鈕上傳。" />
            )}

             <Modal
                title="編輯圖片標題"
                open={isModalOpen}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="儲存"
                cancelText="取消"
                destroyOnClose
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="title" label="標題" rules={[{ required: true, message: '請輸入標題' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default AdminGallery;

