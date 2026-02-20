import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert, Layout, theme, Space } from 'antd';
import { UserOutlined, LockOutlined, ArrowLeftOutlined, ReadOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';

const { Title } = Typography;
const { Content } = Layout;

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const onFinish = async (values) => {
        setLoading(true);
        setError('');
        try {
            const response = await login(values.username, values.password);
            const token = response.data.access_token;
            localStorage.setItem('token', token);
            navigate('/admin');
        } catch (err) {
            setError('登入失敗，請檢查您的帳號或密碼。');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e6f4ff 0%, #f5f7fa 50%, #fff 100%)' }}>
            <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card style={{ width: 400, background: colorBgContainer, borderRadius: 16, boxShadow: '0 8px 24px rgba(22, 119, 255, 0.15)' }}>
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        <ReadOutlined style={{ fontSize: '48px', color: '#1677ff' }} />
                        <Title level={2} style={{ marginTop: 16 }}>管理後台登入</Title>
                    </div>

                    <Form name="login" onFinish={onFinish}>
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: '請輸入帳號!' }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="帳號 (預設: admin)" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: '請輸入密碼!' }]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="密碼 (預設: admin123)" />
                        </Form.Item>

                        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 24 }} />}

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                                登入
                            </Button>
                        </Form.Item>
                        
                        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
                            <Link to="/">
                                <Button type="link" icon={<ArrowLeftOutlined />}>
                                    回到首頁
                                </Button>
                            </Link>
                        </Form.Item>
                    </Form>
                </Card>
            </Content>
        </Layout>
    );
};

export default Login;

