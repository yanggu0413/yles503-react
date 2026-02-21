import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL, 
});

// Function to get the auth token from storage (e.g., localStorage)
const getToken = () => localStorage.getItem('token');

// Add a request interceptor to include the auth token in headers
apiClient.interceptors.request.use(config => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});


// --- Public Endpoints ---
export const getPublicAnnouncements = () => apiClient.get('/announcements');
export const getPublicAssignments = () => apiClient.get('/assignments');
export const getPublicGallery = () => apiClient.get('/gallery');
export const getPublicResources = () => apiClient.get('/resources');
export const getPublicRules = () => apiClient.get('/rules');
export const getPublicSchedule = () => apiClient.get('/schedule');
export const getSiteSettings = () => apiClient.get('/site');


// --- Auth Endpoints ---
export const login = (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    return apiClient.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
};

// --- Admin Endpoints ---
export const getAdminSiteSettings = () => apiClient.get('/admin/site');
export const updateSiteSettings = (data) => apiClient.put('/admin/site', data);

export const getAdminAnnouncements = () => apiClient.get('/admin/announcements');
export const createAnnouncement = (data) => apiClient.post('/admin/announcements', data);
export const updateAnnouncement = (id, data) => apiClient.put(`/admin/announcements/${id}`, data);
export const deleteAnnouncement = (id) => apiClient.delete(`/admin/announcements/${id}`);

export const getAdminAssignments = () => apiClient.get('/admin/assignments');
export const createAssignment = (data) => apiClient.post('/admin/assignments', data);
export const updateAssignment = (id, data) => apiClient.put(`/admin/assignments/${id}`, data);
export const deleteAssignment = (id) => apiClient.delete(`/admin/assignments/${id}`);

export const getAdminSchedule = () => apiClient.get('/admin/schedule');
export const updateSchedule = (data) => apiClient.post('/admin/schedule', data);
export const uploadScheduleImage = (formData) => apiClient.post('/admin/schedule/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteScheduleImage = () => apiClient.delete('/admin/schedule/image');

export const getAdminGallery = () => apiClient.get('/admin/gallery');
export const uploadGalleryImage = (formData) => apiClient.post('/admin/gallery/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateGalleryItem = (id, data) => apiClient.put(`/admin/gallery/${id}`, data);
export const deleteGalleryItem = (id) => apiClient.delete(`/admin/gallery/${id}`);

export const getAdminResources = () => apiClient.get('/admin/resources');
export const createResource = (data) => apiClient.post('/admin/resources', data);
export const updateResource = (id, data) => apiClient.put(`/admin/resources/${id}`, data);
export const deleteResource = (id) => apiClient.delete(`/admin/resources/${id}`);

export const getAdminRules = () => apiClient.get('/admin/rules');
export const createRule = (data) => apiClient.post('/admin/rules', data);
export const updateRule = (id, data) => apiClient.put(`/admin/rules/${id}`, data);
export const deleteRule = (id) => apiClient.delete(`/admin/rules/${id}`);

export const getAllUsers = () => apiClient.get('/admin/users');
export const createUser = (data) => apiClient.post('/admin/users', data);
export const updateUser = (id, data) => apiClient.put(`/admin/users/${id}`, data);
export const deleteUser = (id) => apiClient.delete(`/admin/users/${id}`);

export default apiClient;
