import React, { useState, useEffect, useCallback } from 'react';
import {
    Table, Button, Form, Input, App, Typography, Card, Upload, Spin, Result, Tabs, Popconfirm, Image
} from 'antd';
import { UploadOutlined, CalendarOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { getPublicSchedule, getSiteSettings, uploadScheduleImage, deleteScheduleImage } from '../../services/api';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const EditableCell = ({
    editing,
    dataIndex,
    title,
    children,
    ...restProps
}) => {
    const inputNode = <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[{ required: true, message: `請輸入 ${title}!` }]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};


const AdminSchedule = () => {
    const [form] = Form.useForm();
    const [scheduleData, setScheduleData] = useState([]);
    const [scheduleImage, setScheduleImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editingKey, setEditingKey] = useState('');
    const { message, notification } = App.useApp();

    const dummyScheduleData = React.useMemo(() => [
        { key: '1', time: '08:00-08:40', mon: '早自習', tue: '早自習', wed: '早自習', thu: '早自習', fri: '早自習' },
        { key: '2', time: '08:40-09:20', mon: '國語', tue: '數學', wed: '社會', thu: '自然', fri: '英語' },
        { key: '3', time: '09:30-10:10', mon: '數學', tue: '國語', wed: '自然', thu: '社會', fri: '體育' },
        { key: '4', time: '10:30-11:10', mon: '社會', tue: '自然', wed: '國語', thu: '數學', fri: '音樂' },
        { key: '5', time: '11:20-12:00', mon: '自然', tue: '社會', wed: '數學', thu: '國語', fri: '美術' },
        { key: '6', time: '13:30-14:10', mon: '綜合', tue: '彈性', wed: '國語', thu: '數學', fri: '社會' },
        { key: '7', time: '14:20-15:00', mon: '彈性', tue: '綜合', wed: '數學', thu: '國語', fri: '自然' },
    ], []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [, settingsRes] = await Promise.all([
                getPublicSchedule(),
                getSiteSettings(),
            ]);

            // For now, API for schedule data is not ready, use dummy data.
            // setScheduleData(scheduleRes.data || []); 
            setScheduleData(dummyScheduleData); // Using dummy data for now
            
            if (settingsRes.data && settingsRes.data.scheduleImage) {
                setScheduleImage(settingsRes.data.scheduleImage);
            }
        } catch {
            message.error('無法載入課表資料');
        } finally {
            setLoading(false);
        }
    }, [message, dummyScheduleData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...scheduleData];
            const index = newData.findIndex((item) => key === item.key);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setScheduleData(newData);
                setEditingKey('');
                // Here you would call an API to save the data
                message.success("課表已更新 (前端)");
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };
    
    const handleUpload = async (options) => {
        const { file, onSuccess, onError } = options;
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await uploadScheduleImage(formData);
            setScheduleImage(res.data.imageUrl);
            onSuccess(res.data);
            notification.success({ message: '圖片上傳成功！' });
        } catch (err) {
            onError({ err });
            notification.error({ message: '圖片上傳失敗', description: '請確認檔案格式或網路連線。' });
        }
    };

    const handleDeleteImage = async () => {
        try {
            await deleteScheduleImage();
            setScheduleImage(null);
            notification.success({ message: '圖片已成功刪除！' });
        } catch {
            notification.error({ message: '圖片刪除失敗' });
        }
    };

    const columns = [
        { title: '時間', dataIndex: 'time', key: 'time', width: 120, editable: false },
        { title: '星期一', dataIndex: 'mon', key: 'mon', editable: true },
        { title: '星期二', dataIndex: 'tue', key: 'tue', editable: true },
        { title: '星期三', dataIndex: 'wed', key: 'wed', editable: true },
        { title: '星期四', dataIndex: 'thu', key: 'thu', editable: true },
        { title: '星期五', dataIndex: 'fri', key: 'fri', editable: true },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Button type="primary" onClick={() => save(record.key)} style={{ marginRight: 8 }}>儲存</Button>
                        <Popconfirm title="確定要取消嗎?" onConfirm={cancel}><Button>取消</Button></Popconfirm>
                    </span>
                ) : (
                    <Button disabled={editingKey !== ''} onClick={() => edit(record)}>編輯</Button>
                );
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) return col;
        return {
            ...col,
            onCell: (record) => ({
                record,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    if (loading) {
        return <Spin />;
    }

    return (
         <Card>
            <Title level={3} style={{ margin: 0, marginBottom: 16 }}><CalendarOutlined /> 課表管理</Title>
            <Tabs defaultActiveKey="1">
                <TabPane tab="圖片管理" key="1">
                     <div style={{marginBottom: 16}}>
                        {scheduleImage ? (
                            <div>
                                <Title level={5}>目前課表圖片</Title>
                                <Image src={scheduleImage} alt="課表" style={{ maxWidth: '100%', maxHeight: 400, border: '1px solid #d9d9d9', borderRadius: 8 }} />
                                <Popconfirm title="確定要刪除這張圖片嗎?" onConfirm={handleDeleteImage} okText="確定" cancelText="取消">
                                    <Button type="primary" danger icon={<DeleteOutlined />} style={{ marginTop: 16 }}>刪除圖片</Button>
                                </Popconfirm>
                            </div>
                        ) : (
                             <Text>目前沒有上傳課表圖片。</Text>
                        )}
                    </div>
                    <Upload
                        accept="image/*"
                        customRequest={handleUpload}
                        showUploadList={false}
                    >
                        <Button icon={<UploadOutlined />}>點此上傳新圖片</Button>
                    </Upload>
                    <Text type="secondary" style={{display: 'block', marginTop: 8}}>僅會顯示最新上傳的一張圖片。</Text>
                </TabPane>
                <TabPane tab="表格編輯器 (Beta)" key="2">
                    <Form form={form} component={false}>
                        <Table
                            components={{ body: { cell: EditableCell } }}
                            bordered
                            dataSource={scheduleData}
                            columns={mergedColumns}
                            rowClassName="editable-row"
                            pagination={false}
                            rowKey="key"
                        />
                    </Form>
                     <Text type="secondary" style={{display: 'block', marginTop: 8}}>此功能尚未串接後端儲存。</Text>
                </TabPane>
            </Tabs>
        </Card>
    );
};

export default AdminSchedule;