import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const { currentUser, userData } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);

  const isActive = (path) => {
    if (path === '/project-planning') {
      return pathname === '/project-planning' || pathname === '/';
    }
    return pathname === path;
  };

  const isMasterAdmin = userData?.role?.includes('MasterAdmin');

  useEffect(() => {
    if (isMasterAdmin) {
      const q = query(collection(db, 'Web-Hub-Tech-Partner', 'root', 'users'), where('status', '==', 'pending'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setPendingCount(snapshot.size);
      });
      return () => unsubscribe();
    }
  }, [isMasterAdmin]);

  const navItems = [
    { path: '/information', label: 'Information', icon: 'info', color: '#0ea5e9' },
    { path: '/technology', label: 'Technology', icon: 'memory', color: '#8b5cf6' },
    { path: '/project-planning', label: 'Project Planning', icon: 'event_note', color: '#f59e0b' },
    { path: '/project-control', label: 'Project Control', icon: 'precision_manufacturing', color: '#ec4899' },
    { path: '/engineering', label: 'Engineering', icon: 'architecture', color: '#10b981' }
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity" onClick={onClose} />
      )}
      <aside className={`fixed left-0 top-0 h-screen w-[280px] bg-white/20 backdrop-blur-md shadow-lg z-50 border-r border-white/30 flex flex-col select-none transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        
        {/* Brand Header */}
        <div className="px-6 py-6 mb-2 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-on-primary font-bold shadow-sm">C</div>
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">SMART HUB</h1>
            <p className="font-label-sm text-label-sm text-on-surface/70 uppercase tracking-wider">Tech Partner</p>
          </div>
        </div>

        {/* Profile Card */}
        {userData && (
          <div className="px-4 mb-6">
            <div className="bg-white/40 border border-white/50 rounded-2xl p-4 flex items-center gap-3 shadow-sm backdrop-blur-sm">
              {userData.photoURL ? (
                <img src={userData.photoURL} alt="Profile" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm">
                  {(userData.firstName || userData.email || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 overflow-hidden">
                <div className="font-bold text-slate-800 truncate text-sm">{userData.firstName} {userData.lastName}</div>
                <div className="text-[10px] flex flex-wrap gap-1 mt-1.5">
                  {(userData.role || []).map(r => (
                    <span key={r} className="bg-primary text-white px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase">{r}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto sidebar-scroll flex flex-col gap-1.5 px-2">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mx-2 font-label-md text-label-md transition-all duration-300 group ${active ? 'bg-white/40 shadow-sm font-semibold border-l-[3px]' : 'text-on-surface/70 hover:bg-white/30'}`}
                style={{ borderColor: active ? item.color : 'transparent', color: active ? item.color : undefined, '--hover-color': item.color }}
                to={item.path}
              >
                <span className={`material-symbols-outlined text-[20px] transition-colors duration-300 ${active ? '' : 'text-on-surface/50 group-hover:text-[color:var(--hover-color)]'}`} style={{ color: active ? item.color : undefined }}>
                  {item.icon}
                </span>
                <span className={`${active ? '' : 'group-hover:text-[color:var(--hover-color)] transition-colors'}`}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Admin Section */}
        {isMasterAdmin && (
          <div className="mt-auto px-2 pt-4 border-t border-white/30 flex flex-col gap-1">
            <div className="px-4 pb-2 text-[11px] font-bold text-on-surface/50 uppercase tracking-widest">
              Master Admin
            </div>
            <Link
              to="/master-admin/manage-users"
              className={`flex items-center justify-between px-4 py-2.5 rounded-lg mx-2 font-label-md text-label-md transition-all duration-300 group ${isActive('/master-admin/manage-users') ? 'bg-white/40 text-primary border-l-[3px] border-primary shadow-sm font-semibold' : 'text-on-surface/70 hover:bg-white/30 hover:text-on-surface'}`}
            >
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-[20px] transition-colors duration-300 ${isActive('/master-admin/manage-users') ? 'text-primary' : 'group-hover:text-primary text-on-surface/50'}`}>manage_accounts</span>
                จัดการผู้ใช้งาน
              </div>
              {pendingCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                  {pendingCount}
                </span>
              )}
            </Link>
            <Link
              to="/master-admin/manage-cards"
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg mx-2 font-label-md text-label-md transition-all duration-300 group ${isActive('/master-admin/manage-cards') ? 'bg-white/40 text-primary border-l-[3px] border-primary shadow-sm font-semibold' : 'text-on-surface/70 hover:bg-white/30 hover:text-on-surface'}`}
            >
              <span className={`material-symbols-outlined text-[20px] transition-colors duration-300 ${isActive('/master-admin/manage-cards') ? 'text-primary' : 'group-hover:text-primary text-on-surface/50'}`}>dashboard_customize</span>
              จัดการการ์ดเมนู
            </Link>
          </div>
        )}

        {/* Copyright */}
        <div className={`${isMasterAdmin ? '' : 'mt-auto'} text-[10px] text-on-surface/40 text-center mt-4 pb-4`}>
          © 2026 CMG Engineering & Construction
        </div>

      </aside>
    </>
  );
};

export default Sidebar;
