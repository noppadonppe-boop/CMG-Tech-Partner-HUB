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

            {/* Default to information */}
            <Route path="/" element={<Navigate to="/information" replace />} />
            
            {/* Admin Route - Protected */}
            <Route path="/master-admin/manage-cards" element={
              <ProtectedRoute requireRoles={['MasterAdmin']}>
                <ManageCards />
              </ProtectedRoute>
            } />

            <Route path="/master-admin/manage-users" element={
              <ProtectedRoute requireRoles={['MasterAdmin']}>
                <ManageUsers />
              </ProtectedRoute>
            } />
            
            {/* Category Routes */}
            <Route path="/:category" element={<Dashboard />} />
            
            {/* Fallback to information */}
            <Route path="*" element={<Navigate to="/information" replace />} />
          </Routes>
        </Router>
      </CardProvider>
    </AuthProvider>
  );
}

export default App;
