import React, { useState, useEffect, useCallback } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    App,
    Popconfirm,
    Space,
    Typography,
    Card
} from 'antd';
import { PlusOutlined, SoundOutlined } from '@ant-design/icons';
import {
    getAdminAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
} from '../../services/api';
import dayjs from 'dayjs';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'; // import styles

const { Title } = Typography;

const AdminAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();
    const { message } = App.useApp();

    const fetchAnnouncements = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getAdminAnnouncements();
            setAnnouncements(response.data.sort((a, b) => dayjs(b.created_at).diff(dayjs(a.created_at))));
        } catch {
            message.error('無法載入公告列表');
        } finally {
            setLoading(false);
        }
    }, [message]);

    useEffect(() => {
        fetchAnnouncements();
    }, [fetchAnnouncements]);

    const showModal = (record = null) => {
        setEditingRecord(record);
        form.setFieldsValue(record ? { ...record } : { title: '', content: '' });
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
                try {
                    if (isEditing) {
                        await updateAnnouncement(editingRecord.id, values);
                        message.success('公告更新成功');
                    } else {
                        await createAnnouncement(values);
                        message.success('公告新增成功');
                    }
                    handleCancel();
                    await fetchAnnouncements();
                } catch {
                    message.error(isEditing ? '更新失敗' : '新增失敗');
                }
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    const handleDelete = async (id) => {
        try {
            await deleteAnnouncement(id);
            message.success('公告刪除成功');
            await fetchAnnouncements();
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
        { title: '建立時間', dataIndex: 'created_at', key: 'created_at', render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm'), width: 150 },
        { title: '更新時間', dataIndex: 'updated_at', key: 'updated_at', render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm'), width: 150 },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 120,
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => showModal(record)}>編輯</Button>
                    <Popconfirm title="確定要刪除這則公告嗎？" onConfirm={() => handleDelete(record.id)} okText="確定" cancelText="取消">
                        <Button type="link" danger>刪除</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={3} style={{margin: 0}}><SoundOutlined /> 公告管理</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>新增公告</Button>
            </div>
            <Table columns={columns} dataSource={announcements} rowKey="id" loading={loading} scroll={{ x: 1000 }}/>

            <Modal
                title={editingRecord ? '編輯公告' : '新增公告'}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={800}
                okText="儲存"
                cancelText="取消"
                destroyOnClose
            >
                <Form form={form} layout="vertical" name="announcement_form">
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

export default AdminAnnouncements;
