import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const UpdateProfileModal = ({ isOpen, onClose }) => {
  const { currentUser, userData, refreshProfile } = useAuth();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [position, setPosition] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userData && isOpen) {
      setFirstName(userData.firstName || '');
      setLastName(userData.lastName || '');
      setPosition(userData.position || '');
      setError('');
    }
  }, [userData, isOpen]);

  if (!isOpen || !userData) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userRef = doc(db, 'Web-Hub-Tech-Partner', 'root', 'users', currentUser.email);
      await updateDoc(userRef, {
        firstName,
        lastName,
        position
      });
      await refreshProfile();
      onClose();
    } catch (err) {
      console.error(err);
      setError('Failed to update profile.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800">แก้ไขข้อมูลส่วนตัว</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">ชื่อ (First Name)</label>
            <input 
              type="text" 
              required 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">นามสกุล (Last Name)</label>
            <input 
              type="text" 
              required 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">ตำแหน่งงาน (Position)</label>
            <input 
              type="text" 
              required 
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              ยกเลิก
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-sm font-bold bg-primary text-white rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-70 flex items-center justify-center min-w-[100px]"
            >
              {loading ? <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> : 'บันทึก'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfileModal;
