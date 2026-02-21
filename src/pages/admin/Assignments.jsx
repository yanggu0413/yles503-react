import React, { useState, useEffect, useCallback } from 'react';
import {
    Table, Button, Modal, Form, Input, DatePicker, Select, App, Popconfirm, Space, Typography, Card
} from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import {
    getAdminAssignments, createAssignment, updateAssignment, deleteAssignment
} from '../../services/api';
import dayjs from 'dayjs';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const { Title } = Typography;
const { Option } = Select;

const AdminAssignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();
    const { message } = App.useApp();

    const fetchAssignments = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getAdminAssignments();
            setAssignments(response.data.sort((a, b) => dayjs(b.deadline).diff(dayjs(a.deadline))));
        } catch {
            message.error('無法載入作業列表');
        } finally {
            setLoading(false);
        }
    }, [message]);

    useEffect(() => {
        fetchAssignments();
    }, [fetchAssignments]);

    const showModal = (record = null) => {
        setEditingRecord(record);
        if (record) {
            form.setFieldsValue({ ...record, deadline: dayjs(record.deadline) });
        } else {
            form.resetFields();
            form.setFieldsValue({ status: 'open' });
        }
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingRecord(null);
        form.resetFields();
    };

    const handleOk = () => {
        form.validateFields()
            .then(async (values) => {
                const isEditing = !!editingRecord;
                // Make sure deadline is a string in YYYY-MM-DD format
                const payload = { ...values, deadline: dayjs(values.deadline).format('YYYY-MM-DD') };
                
                try {
                    if (isEditing) {
                        await updateAssignment(editingRecord.id, payload);
                        message.success('作業更新成功');
                    } else {
                        await createAssignment(payload);
                        message.success('作業新增成功');
                    }
                    handleCancel();
                    await fetchAssignments();
                } catch {
                    message.error(isEditing ? '更新失敗' : '新增失敗');
                }
            })
            .catch(info => console.log('Validate Failed:', info));
    };

    const handleDelete = async (id) => {
        try {
            await deleteAssignment(id);
            message.success('作業刪除成功');
            await fetchAssignments();
        } catch {
            message.error('刪除失敗');
        }
    };

    const columns = [
        { title: '科目', dataIndex: 'subject', key: 'subject', width: 120 },
        { title: '標題', dataIndex: 'title', key: 'title', ellipsis: true },
        { title: '繳交期限', dataIndex: 'deadline', key: 'deadline', render: (text) => dayjs(text).format('YYYY-MM-DD'), width: 120 },
        { title: '狀態', dataIndex: 'status', key: 'status', render: (status) => status === 'open' ? '進行中' : '已截止', width: 100 },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 120,
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => showModal(record)}>編輯</Button>
                    <Popconfirm title="確定要刪除這項作業嗎？" onConfirm={() => handleDelete(record.id)} okText="確定" cancelText="取消">
                        <Button type="link" danger>刪除</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={3} style={{margin:0}}><EditOutlined /> 作業管理</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>新增作業</Button>
            </div>
            <Table columns={columns} dataSource={assignments} rowKey="id" loading={loading} scroll={{ x: 800 }} />

            <Modal
                title={editingRecord ? '編輯作業' : '新增作業'}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={800}
                okText="儲存"
                cancelText="取消"
                destroyOnClose
            >
                <Form form={form} layout="vertical" name="assignment_form" initialValues={{ status: 'open' }}>
                    <Form.Item name="subject" label="科目" rules={[{ required: true, message: '請輸入科目' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="title" label="標題" rules={[{ required: true, message: '請輸入標題' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="deadline" label="繳交期限" rules={[{ required: true, message: '請選擇期限' }]}>
                        <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="status" label="狀態" rules={[{ required: true, message: '請選擇狀態' }]}>
                        <Select>
                            <Option value="open">進行中</Option>
                            <Option value="closed">已截止</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="content" label="詳細說明">
                        <ReactQuill theme="snow" style={{ height: 150, marginBottom: 40 }} />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default AdminAssignments;
