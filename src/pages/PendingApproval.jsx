import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';

const PendingApproval = () => {
  const { logout, userData, loading } = useAuth();
  const navigate = useNavigate();

  // If loading, let ProtectedRoute or general loading handle it, but here we just wait
  if (loading) {
    return null;
  }

  // If already approved, redirect to home
  if (userData && userData.status === 'approved') {
    return <Navigate to="/" replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-inter">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-slate-200 text-center">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-[32px]">pending_actions</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">บัญชีของคุณรอการอนุมัติ</h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          กรุณารอผู้ดูแลระบบตรวจสอบและอนุมัติสิทธิ์การเข้าใช้งานของคุณ 
          เมื่อได้รับการอนุมัติแล้ว คุณจะสามารถเข้าสู่ระบบได้
        </p>
        <button 
          onClick={handleLogout}
          className="bg-slate-100 text-slate-700 font-semibold py-2.5 px-6 rounded-xl hover:bg-slate-200 transition-colors"
        >
          กลับสู่หน้าเข้าสู่ระบบ
        </button>
      </div>
    </div>
  );
};

export default PendingApproval;
