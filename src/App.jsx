import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ManageCards from './pages/ManageCards';
import ManageUsers from './pages/ManageUsers';
import Auth from './pages/Auth';
import PendingApproval from './pages/PendingApproval';
import { CardProvider } from './context/CardContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <CardProvider>
        <Router>
          <Routes>
            {/* Auth Route */}
            <Route path="/auth" element={<Auth />} />

            {/* Pending Route */}
            <Route path="/pending" element={<PendingApproval />} />

            {/* Default to project-planning */}
            <Route path="/" element={<Navigate to="/project-planning" replace />} />
            
            {/* Admin Route - Protected */}
            <Route path="/master-admin/manage-cards" element={
              <ProtectedRoute>
                <ManageCards />
              </ProtectedRoute>
            } />

            <Route path="/master-admin/manage-users" element={
              <ProtectedRoute requireRoles={['MasterAdmin']}>
                <ManageUsers />
              </ProtectedRoute>
            } />
            
            {/* Category Routes */}
            <Route path="/:category" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            {/* Fallback to project-planning */}
            <Route path="*" element={<Navigate to="/project-planning" replace />} />
          </Routes>
        </Router>
      </CardProvider>
    </AuthProvider>
  );
}

export default App;
