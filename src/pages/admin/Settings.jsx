import React, { useState, useEffect, useCallback } from 'react';
import { Card, Typography, Form, Input, Button, App, Spin, Result } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { getAdminSiteSettings, updateSiteSettings } from '../../services/api';

const { Title } = Typography;

const AdminSettings = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [form] = Form.useForm();
    const { notification } = App.useApp();

    const fetchSettings = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getAdminSiteSettings();
            form.setFieldsValue(response.data);
            setError(null);
        } catch {
            setError('無法載入站台設定');
        } finally {
            setLoading(false);
        }
    }, [form]);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const onFinish = async (values) => {
        try {
            await updateSiteSettings(values);
            notification.success({
                message: '更新成功',
                description: '站台設定已成功儲存。',
            });
            fetchSettings();
        } catch {
            notification.error({
                message: '更新失敗',
                description: '儲存設定時發生錯誤。',
            });
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
    }

    if (error) {
        return <Result status="error" title="載入失敗" subTitle={error} />;
    }

    return (
        <Card>
            <Title level={3} style={{margin:0, marginBottom: 16}}><SettingOutlined /> 站台設定</Title>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item label="學校名稱" name="schoolName">
                    <Input />
                </Form.Item>
                <Form.Item label="班級名稱" name="className">
                    <Input />
                </Form.Item>
                <Form.Item label="網站副標題" name="subtitle">
                    <Input />
                </Form.Item>
                <Form.Item label="導師姓名" name="teacherName">
                    <Input />
                </Form.Item>
                <Form.Item label="聯絡 Email" name="contactEmail" rules={[{type: 'email'}]}>
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        儲存設定
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default AdminSettings;
