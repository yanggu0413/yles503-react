import React, { useState, useEffect, useCallback } from 'react';
import {
    Table, Button, Modal, Form, Input, Select, App, Popconfirm, Space, Typography, Card, Tag, Switch
} from 'antd';
import { PlusOutlined, TeamOutlined } from '@ant-design/icons';
import { getAllUsers, createUser, updateUser, deleteUser } from '../../services/api';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

const roleColors = {
    admin: 'red',
    teacher: 'blue',
    student: 'green',
};

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();
    const { message } = App.useApp();

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getAllUsers();
            setUsers(response.data.sort((a, b) => dayjs(b.created_at).diff(dayjs(a.created_at))));
        } catch {
            message.error('無法載入使用者列表');
        } finally {
            setLoading(false);
        }
    }, [message]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const showModal = (record = null) => {
        setEditingRecord(record);
        form.setFieldsValue(record ? { ...record, password: '' } : { role: 'student', enabled: true });
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
             // Remove password if it's empty, so we don't send an empty string
            const payload = { ...values };
            if (!payload.password) {
                delete payload.password;
            }

            try {
                if (isEditing) {
                    await updateUser(editingRecord.id, payload);
                    message.success('使用者更新成功');
                } else {
                    await createUser(payload);
                    message.success('使用者新增成功');
                }
                handleCancel();
                await fetchUsers();
            } catch (error) {
                 const errorMsg = error.response?.data?.detail || (isEditing ? '更新失敗' : '新增失敗');
                 message.error(errorMsg);
            }
        });
    };

    const handleDelete = async (id) => {
        try {
            await deleteUser(id);
            message.success('使用者刪除成功');
            await fetchUsers();
        } catch {
            message.error('刪除失敗');
        }
    };

    const columns = [
        { title: '帳號', dataIndex: 'account', key: 'account' },
        { title: '姓名', dataIndex: 'name', key: 'name' },
        { 
            title: '角色', 
            dataIndex: 'role', 
            key: 'role',
            render: role => <Tag color={roleColors[role] || 'default'}>{role}</Tag>
        },
        {
            title: '狀態',
            dataIndex: 'enabled',
            key: 'enabled',
            render: enabled => <Tag color={enabled ? 'green' : 'red'}>{enabled ? '啟用' : '停用'}</Tag>
        },
        { title: '建立時間', dataIndex: 'created_at', key: 'created_at', render: (text) => dayjs(text).format('YYYY-MM-DD') },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 120,
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => showModal(record)}>編輯</Button>
                    <Popconfirm title="確定要刪除這位使用者嗎？" onConfirm={() => handleDelete(record.id)} okText="確定" cancelText="取消">
                        <Button type="link" danger>刪除</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={3} style={{margin:0}}><TeamOutlined /> 使用者管理</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>新增使用者</Button>
            </div>
            <Table columns={columns} dataSource={users} rowKey="id" loading={loading} scroll={{ x: 800 }} />

            <Modal
                title={editingRecord ? '編輯使用者' : '新增使用者'}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="儲存"
                cancelText="取消"
                destroyOnClose
            >
                <Form form={form} layout="vertical" name="user_form">
                    <Form.Item name="account" label="帳號" rules={[{ required: true, message: '請輸入帳號' }]}>
                        <Input disabled={!!editingRecord} />
                    </Form.Item>
                    <Form.Item name="name" label="姓名">
                        <Input />
                    </Form.Item>
                    <Form.Item 
                        name="password" 
                        label={editingRecord ? '新密碼 (留空則不變更)' : '密碼'}
                        rules={[{ required: !editingRecord, message: '請輸入密碼' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item name="role" label="角色" rules={[{ required: true, message: '請選擇角色' }]}>
                        <Select>
                            <Option value="student">student</Option>
                            <Option value="teacher">teacher</Option>
                            <Option value="admin">admin</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="enabled" label="狀態" valuePropName="checked">
                         <Switch checkedChildren="啟用" unCheckedChildren="停用" />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default AdminUsers;
