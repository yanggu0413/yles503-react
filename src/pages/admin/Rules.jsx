import React, { useState, useEffect, useCallback } from 'react';
import {
    Table, Button, Modal, Form, Input, App, Popconfirm, Space, Typography, Card
} from 'antd';
import { PlusOutlined, SolutionOutlined } from '@ant-design/icons';
import {
    getAdminRules, createRule, updateRule, deleteRule
} from '../../services/api';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const { Title } = Typography;

const AdminRules = () => {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();
    const { message } = App.useApp();

    const fetchRules = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getAdminRules();
            setRules(response.data);
        } catch {
            message.error('無法載入班規列表');
        } finally {
            setLoading(false);
        }
    }, [message]);

    useEffect(() => {
        fetchRules();
    }, [fetchRules]);

    const showModal = (record = null) => {
        setEditingRecord(record);
        form.setFieldsValue(record || { title: '', content: '' });
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
                    await updateRule(editingRecord.id, values);
                    message.success('班規更新成功');
                } else {
                    await createRule(values);
                    message.success('班規新增成功');
                }
                handleCancel();
                await fetchRules();
            } catch {
                message.error(isEditing ? '更新失敗' : '新增失敗');
            }
        });
    };

    const handleDelete = async (id) => {
        try {
            await deleteRule(id);
            message.success('班規刪除成功');
            await fetchRules();
        } catch {
            message.error('刪除失敗');
        }
    };

    const columns = [
        { title: '標題', dataIndex: 'title', key: 'title', width: '30%' },
        { 
            title: '內容預覽', 
            dataIndex: 'content', 
            key: 'content',
            ellipsis: true,
            render: (text) => <div dangerouslySetInnerHTML={{ __html: text }} />
        },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 120,
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => showModal(record)}>編輯</Button>
                    <Popconfirm title="確定要刪除這項班規嗎？" onConfirm={() => handleDelete(record.id)} okText="確定" cancelText="取消">
                        <Button type="link" danger>刪除</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={3} style={{margin:0}}><SolutionOutlined /> 班規管理</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>新增班規</Button>
            </div>
            <Table columns={columns} dataSource={rules} rowKey="id" loading={loading} scroll={{ x: 800 }} />

            <Modal
                title={editingRecord ? '編輯班規' : '新增班規'}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={800}
                okText="儲存"
                cancelText="取消"
                destroyOnClose
            >
                <Form form={form} layout="vertical" name="rule_form">
                    <Form.Item name="title" label="標題" rules={[{ required: true, message: '請輸入標題' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="content" label="內容" rules={[{ required: true, message: '請輸入內容' }]}>
                        <ReactQuill theme="snow" style={{ height: 200, marginBottom: 40 }} />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default AdminRules;
