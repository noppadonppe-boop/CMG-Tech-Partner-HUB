import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCards } from '../context/CardContext';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const { currentUser, userData } = useAuth();
  const { sidebarMenus } = useCards();
  const [pendingCount, setPendingCount] = useState(0);
  const [expandedMenus, setExpandedMenus] = useState({});

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

  // Expand parent menu if active pathname matches a submenu
  useEffect(() => {
    const activeSub = sidebarMenus.find(m => m.type === 'sub' && isActive(m.path));
    if (activeSub && activeSub.parentId) {
      setExpandedMenus(prev => ({
        ...prev,
        [activeSub.parentId]: true
      }));
    }
  }, [pathname, sidebarMenus]);

  const toggleExpand = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const isEmojiStr = (str) => /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u.test(str || '');

  const mainMenus = sidebarMenus.filter(m => m.type === 'main' || !m.type);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity" onClick={onClose} />
      )}
      <aside className={`fixed left-0 top-0 h-screen w-[280px] bg-white/20 backdrop-blur-md shadow-lg z-50 border-r border-r-white/30 flex flex-col select-none transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>

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
          {mainMenus.map((item) => {
            const submenus = sidebarMenus.filter(m => m.parentId === item.id && m.type === 'sub');
            const hasSubs = submenus.length > 0;
            const isExpanded = !!expandedMenus[item.id];
            
            // Active state checks
            const isParentActive = isActive(item.path) || submenus.some(sub => isActive(sub.path));
            const activeColor = item.color || '#0ea5e9';

            if (hasSubs) {
              return (
                <div key={item.id} className="flex flex-col gap-1">
                  {/* Expandable parent header */}
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg mx-2 font-label-md text-label-md transition-all duration-300 group ${
                      isParentActive 
                        ? 'bg-white/40 shadow-sm font-semibold border-l-[3px]' 
                        : 'text-on-surface/70 hover:bg-white/30'
                    }`}
                    style={{ 
                      borderColor: isParentActive ? activeColor : 'transparent', 
                      color: isParentActive ? activeColor : undefined,
                      '--hover-color': activeColor 
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span 
                        className={`${isEmojiStr(item.icon) ? '' : 'material-symbols-outlined'} text-[20px] transition-colors duration-300 ${
                          isParentActive ? '' : 'text-on-surface/50 group-hover:text-[color:var(--hover-color)]'
                        }`} 
                        style={{ color: isParentActive ? activeColor : undefined }}
                      >
                        {item.icon || 'folder'}
                      </span>
                      <span className={`${isParentActive ? '' : 'group-hover:text-[color:var(--hover-color)] transition-colors'}`}>
                        {item.label}
                      </span>
                    </div>
                    <span 
                      className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                      style={{ color: isParentActive ? activeColor : 'inherit' }}
                    >
                      expand_more
                    </span>
                  </button>

                  {/* Submenus list */}
                  {isExpanded && (
                    <div className="flex flex-col gap-1 pl-4 ml-2 border-l border-white/20">
                      {submenus.map((sub) => {
                        const subActive = isActive(sub.path);
                        const subColor = sub.color || activeColor;
                        return (
                          <Link
                            key={sub.path}
                            to={sub.path}
                            className={`flex items-center gap-2.5 px-4 py-2 rounded-lg font-label-md text-label-sm transition-all duration-300 group ${
                              subActive 
                                ? 'bg-white/30 font-semibold border-l-[2px]' 
                                : 'text-on-surface/60 hover:bg-white/20'
                            }`}
                            style={{ 
                              borderColor: subActive ? subColor : 'transparent', 
                              color: subActive ? subColor : undefined,
                              '--hover-color': subColor 
                            }}
                          >
                            <span 
                              className={`${isEmojiStr(sub.icon) ? '' : 'material-symbols-outlined'} text-[16px] transition-colors duration-300 ${
                                subActive ? '' : 'text-on-surface/40 group-hover:text-[color:var(--hover-color)]'
                              }`}
                              style={{ color: subActive ? subColor : undefined }}
                            >
                              {sub.icon || 'folder'}
                            </span>
                            <span className={`${subActive ? '' : 'group-hover:text-[color:var(--hover-color)] transition-colors'}`}>
                              {sub.label}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // Normal menu item without submenus
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mx-2 font-label-md text-label-md transition-all duration-300 group ${
                  active ? 'bg-white/40 shadow-sm font-semibold border-l-[3px]' : 'text-on-surface/70 hover:bg-white/30'
                }`}
                style={{ 
                  borderColor: active ? activeColor : 'transparent', 
                  color: active ? activeColor : undefined, 
                  '--hover-color': activeColor 
                }}
                to={item.path}
              >
                <span 
                  className={`${isEmojiStr(item.icon) ? '' : 'material-symbols-outlined'} text-[20px] transition-colors duration-300 ${
                    active ? '' : 'text-on-surface/50 group-hover:text-[color:var(--hover-color)]'
                  }`} 
                  style={{ color: active ? activeColor : undefined }}
                >
                  {item.icon || 'folder'}
                </span>
                <span className={`${active ? '' : 'group-hover:text-[color:var(--hover-color)] transition-colors'}`}>
                  {item.label}
                </span>
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
            <Link
              to="/master-admin/manage-sidebar"
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg mx-2 font-label-md text-label-md transition-all duration-300 group ${isActive('/master-admin/manage-sidebar') ? 'bg-white/40 text-primary border-l-[3px] border-primary shadow-sm font-semibold' : 'text-on-surface/70 hover:bg-white/30 hover:text-on-surface'}`}
            >
              <span className={`material-symbols-outlined text-[20px] transition-colors duration-300 ${isActive('/master-admin/manage-sidebar') ? 'text-primary' : 'group-hover:text-primary text-on-surface/50'}`}>view_sidebar</span>
              จัดการ Sidebar
            </Link>
          </div>
        )}

        {/* Copyright */}
        <div className={`${isMasterAdmin ? '' : 'mt-auto'} text-[10px] text-on-surface/40 text-center mt-4 pb-4`}>
          © 2026 information
        </div>

      </aside>
    </>
  );
};

export default Sidebar;
