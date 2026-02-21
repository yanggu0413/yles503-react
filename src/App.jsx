import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import AppLayout from './components/AppLayout';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import HomePage from './pages/HomePage';
import Announcements from './pages/Announcements';
import Assignments from './pages/Assignments';
import Schedule from './pages/Schedule';
import Resources from './pages/Resources';
import Gallery from './pages/Gallery';
import Rules from './pages/Rules';
import Contact from './pages/Contact';
import Login from './pages/Login';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminAnnouncements from './pages/admin/Announcements';
import AdminAssignments from './pages/admin/Assignments';
import AdminSchedule from './pages/admin/Schedule';
import AdminGallery from './pages/admin/Gallery';
import AdminResources from './pages/admin/Resources';
import AdminRules from './pages/admin/Rules';
import AdminUsers from './pages/admin/Users';
import AdminSettings from './pages/admin/Settings';



const NotFound = () => <div>404 - Page Not Found</div>;

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="resources" element={<Resources />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="rules" element={<Rules />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      {/* Login Route */}
      <Route path="/login" element={<Login />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="announcements" element={<AdminAnnouncements />} />
        <Route path="assignments" element={<AdminAssignments />} />
        <Route path="schedule" element={<AdminSchedule />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="resources" element={<AdminResources />} />
        <Route path="rules" element={<AdminRules />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Not Found Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
