import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form, Input, App, Popconfirm, Space, Typography, Card } from 'antd';
import { PlusOutlined, LinkOutlined } from '@ant-design/icons';
import { getAdminResources, createResource, updateResource, deleteResource } from '../../services/api';

const { Title } = Typography;
const { TextArea } = Input;

const AdminResources = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();
    const { message } = App.useApp();

    const fetchResources = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getAdminResources();
            setResources(response.data);
        } catch {
            message.error('無法載入資源列表');
        } finally {
            setLoading(false);
        }
    }, [message]);

    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    const showModal = (record = null) => {
        setEditingRecord(record);
        form.setFieldsValue(record || { title: '', url: '', category: '', description: '' });
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingRecord(null);
        form.resetFields();
    };

    const handleOk = () => {
        form.validateFields().then(async (values) => {
            const isEditing = !!editingRecord;
            try {
                if (isEditing) {
                    await updateResource(editingRecord.id, values);
                    message.success('資源更新成功');
                } else {
                    await createResource(values);
                    message.success('資源新增成功');
                }
                handleCancel();
                await fetchResources();
            } catch {
                message.error(isEditing ? '更新失敗' : '新增失敗');
            }
        });
    };

    const handleDelete = async (id) => {
        try {
            await deleteResource(id);
            message.success('資源刪除成功');
            await fetchResources();
        } catch {
            message.error('刪除失敗');
        }
    };

    const columns = [
        { 
            title: '分類', 
            dataIndex: 'category', 
            key: 'category',
            sorter: (a, b) => a.category.localeCompare(b.category),
            width: 150,
        },
        { title: '標題', dataIndex: 'title', key: 'title', ellipsis: true },
        { title: '網址', dataIndex: 'url', key: 'url', render: (url) => <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>, ellipsis: true },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 120,
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => showModal(record)}>編輯</Button>
                    <Popconfirm title="確定要刪除這項資源嗎？" onConfirm={() => handleDelete(record.id)} okText="確定" cancelText="取消">
                        <Button type="link" danger>刪除</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={3} style={{margin:0}}><LinkOutlined /> 資源管理</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>新增資源</Button>
            </div>
            <Table columns={columns} dataSource={resources} rowKey="id" loading={loading} scroll={{ x: 800 }} />

            <Modal
                title={editingRecord ? '編輯資源' : '新增資源'}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="儲存"
                cancelText="取消"
                destroyOnClose
            >
                <Form form={form} layout="vertical" name="resource_form">
                    <Form.Item name="category" label="分類" rules={[{ required: true, message: '請輸入分類' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="title" label="標題" rules={[{ required: true, message: '請輸入標題' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="url" label="網址" rules={[{ required: true, message: '請輸入網址' }, { type: 'url', message: '請輸入有效的網址' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="描述">
                        <TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default AdminResources;

