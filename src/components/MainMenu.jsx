import React from 'react';
import { Menu, Button } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
    HomeOutlined, 
    NotificationOutlined, 
    EditOutlined, 
    CalendarOutlined, 
    LinkOutlined,
    PictureOutlined,
    SolutionOutlined,
    MessageOutlined,
    SettingOutlined,
    UserOutlined
} from '@ant-design/icons';

const items = [
    { label: <Link to="/"><HomeOutlined /> 首頁</Link>, key: '/' },
    { label: <Link to="/announcements"><NotificationOutlined /> 最新公告</Link>, key: '/announcements' },
    { label: <Link to="/assignments"><EditOutlined /> 班級作業</Link>, key: '/assignments' },
    { label: <Link to="/schedule"><CalendarOutlined /> 課程表</Link>, key: '/schedule' },
    { label: <Link to="/resources"><LinkOutlined /> 學習資源</Link>, key: '/resources' },
    { label: <Link to="/gallery"><PictureOutlined /> 班級相簿</Link>, key: '/gallery' },
    { label: <Link to="/rules"><SolutionOutlined /> 班級公約</Link>, key: '/rules' },
    { label: <Link to="/contact"><MessageOutlined /> 聯絡我們</Link>, key: '/contact' },
];

const MainMenu = () => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
            <Menu
                theme="dark"
                mode="horizontal"
                selectedKeys={[location.pathname]}
                items={items}
                style={{ flex: 1, minWidth: 0, borderBottom: 'none', lineHeight: '62px' }}
            />
            <Button 
                type="primary" 
                icon={<SettingOutlined />} 
                onClick={() => navigate('/admin')}
                style={{ marginLeft: 16, borderRadius: 8 }}
            >
                管理後台
            </Button>
        </div>
    );
};

export default MainMenu;
