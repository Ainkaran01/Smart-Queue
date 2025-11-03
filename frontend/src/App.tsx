import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import BookAppointmentPage from './pages/BookAppointmentPage';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import AdminDashboard from './pages/AdminDashboard';
import LoadingSpinner from './components/LoadingSpinner';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import DashboardPage from './pages/DashboardPage';
import PasswordSettings from './pages/PasswordSettings';
import AdminMessagesPage from './pages/AdminMessagesPage';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Layout>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
       <Route path="/about" element={<AboutPage />} />
        {/* Private routes */}
        
        <Route 
          path="/book" 
          element={
            <PrivateRoute>
              <BookAppointmentPage />
            </PrivateRoute>
          } 
        />
         <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
             } 
        />
        <Route 
          path="/mine" 
          element={
            <PrivateRoute>
              <MyAppointmentsPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/password-settings" 
          element={
            <PrivateRoute>
              <PasswordSettings />
            </PrivateRoute>
          } 
        />
         <Route 
          path="/admin/messages" 
          element={
            <PrivateRoute>
              <AdminMessagesPage />
            </PrivateRoute>
          } 
        />
        {(user?.role === 'ADMIN' || user?.role === 'STAFF') && (
          <Route 
            path="/admin" 
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            } 
          />
        )}

        {/* Redirect unknown paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
