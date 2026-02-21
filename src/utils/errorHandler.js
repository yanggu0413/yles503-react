export const getErrorMessage = (error) => {
    if (!error) return '發生未知錯誤';
    
    const response = error.response;
    const status = response?.status;
    const detail = response?.data?.detail;
    const message = error.message || '';
    
    if (!response) {
        if (message.includes('Network Error') || message.includes('ECONNREFUSED')) {
            return '無法連線到伺服器，請檢查網路連線或伺服器是否運行中';
        }
        if (message.includes('timeout')) {
            return '請求逾時，請稍後再試';
        }
        return `網路錯誤：${message}`;
    }
    
    switch (status) {
        case 400:
            if (typeof detail === 'string') return detail;
            if (Array.isArray(detail)) {
                return detail.map(d => d.msg || JSON.stringify(d)).join(', ');
            }
            return '請求格式錯誤';
            
        case 401:
            if (detail === 'Incorrect account or password') return '帳號或密碼錯誤';
            if (detail === 'Could not validate credentials') return '登入驗證失敗，請重新登入';
            if (detail?.includes('disabled')) return '帳號已被停用，請聯絡管理員';
            return '未經授權，請重新登入';
            
        case 403:
            if (detail?.includes('Access denied')) return detail;
            return '沒有權限執行此操作';
            
        case 404:
            if (typeof detail === 'string') return detail;
            return '找不到請求的資源';
            
        case 409:
            return detail || '資料衝突，可能已存在';
            
        case 422:
            if (Array.isArray(detail)) {
                return detail.map(d => d.msg || JSON.stringify(d)).join(', ');
            }
            return '資料驗證失敗';
            
        case 500:
        case 502:
        case 503:
            return '伺服器錯誤，請稍後再試';
            
        case 504:
            return '伺服器回應逾時';
            
        default:
            if (typeof detail === 'string') return detail;
            if (typeof detail === 'object' && detail !== null) {
                return JSON.stringify(detail);
            }
            return `錯誤 (${status})`;
    }
};

export const handleApiError = (error, defaultMessage = '操作失敗') => {
    console.error('API Error:', error);
    return getErrorMessage(error) || defaultMessage;
};
