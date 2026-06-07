import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UpdateProfileModal from './UpdateProfileModal';

const TopAppBar = ({ title = "Project Planning", viewMode = 'grid', onViewModeChange, onMenuClick }) => {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <header className="sticky top-0 right-0 w-full z-30 bg-white/20 backdrop-blur-md border-b border-white/30 flex items-center justify-between h-16 px-gutter transition-all duration-300 shadow-sm">
      
      {/* Left: Title */}
      <div className="flex items-center gap-2 md:gap-3 w-1/4 min-w-max">
        {/* Hamburger Menu Button (Mobile Only) */}
        <button 
          onClick={onMenuClick}
          className="md:hidden text-on-surface hover:text-primary transition-colors flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/40"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        <button className="hidden md:flex text-on-surface hover:text-primary transition-colors items-center justify-center w-8 h-8 rounded-full hover:bg-white/40">
          <span className="material-symbols-outlined text-[20px]">chevron_left</span>
        </button>
        <h2 className="font-headline-md text-[16px] md:text-[20px] text-on-surface tracking-tight font-bold truncate">{title}</h2>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 flex justify-center px-4">
        <div className="relative group w-full max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-[18px] text-on-surface/60 group-focus-within:text-primary transition-colors">search</span>
          </div>
          <input 
            className="block w-full pl-11 pr-4 py-2 border border-white/60 rounded-full leading-5 bg-white/50 text-on-surface placeholder-on-surface/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-white sm:text-sm transition-all duration-300 shadow-sm font-body-md text-body-md backdrop-blur-sm hover:bg-white/60" 
            placeholder="Search systems..." 
            type="text" 
          />
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center justify-end gap-4 w-1/4 min-w-max relative">
        
        <div className="flex items-center gap-1">
          {/* Notifications */}
          <button className="text-on-surface hover:text-primary transition-colors w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/40 relative">
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full border border-white"></span>
          </button>
          
          {/* View Toggle (Grid / List) */}
          <button 
            onClick={() => onViewModeChange && onViewModeChange(viewMode === 'grid' ? 'list' : 'grid')}
            className="text-on-surface hover:text-primary transition-colors w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/40"
            title={`Switch to ${viewMode === 'grid' ? 'List' : 'Grid'} View`}
          >
            <span className="material-symbols-outlined text-[22px]">
              {viewMode === 'grid' ? 'apps' : 'view_list'}
            </span>
          </button>
        </div>

        {/* Profile / Login */}
        <div className="pl-4 border-l border-white/40 flex items-center h-full relative">
          {currentUser ? (
            <div 
              className="flex items-center gap-3 cursor-pointer relative"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="text-right hidden xl:block">
                <p className="font-label-md text-[13px] text-on-surface font-bold hover:text-primary transition-colors leading-tight">
                  {userData?.firstName ? `${userData.firstName} ${userData.lastName}` : (currentUser.displayName || currentUser.email)}
                </p>
                <p className="font-label-sm text-[11px] text-on-surface/70 leading-tight uppercase tracking-wider">
                  {(userData?.role || ['User'])[0]}
                </p>
              </div>
              {userData?.photoURL || currentUser?.photoURL ? (
                <img alt="Profile" className="h-9 w-9 rounded-full object-cover border-2 border-white/60 shadow-sm" src={userData?.photoURL || currentUser?.photoURL} />
              ) : (
                <div className="h-9 w-9 rounded-full bg-primary/20 border-2 border-white/60 shadow-sm flex items-center justify-center text-primary font-bold">
                  {(userData?.firstName || currentUser.displayName || currentUser.email || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <span className="material-symbols-outlined text-[16px] text-on-surface/50">
                {showProfileMenu ? 'expand_less' : 'expand_more'}
              </span>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-slate-100 mb-2 xl:hidden">
                     <p className="font-bold text-sm text-slate-800 truncate">
                        {userData?.firstName ? `${userData.firstName} ${userData.lastName}` : currentUser.displayName}
                     </p>
                     <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                  </div>
                  <button 
                    onClick={() => setIsProfileModalOpen(true)}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary flex items-center gap-2 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">person</span>
                    แก้ไขข้อมูลส่วนตัว
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors mt-1"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    ออกจากระบบ
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => navigate('/auth')}
              className="bg-primary text-on-primary px-5 py-1.5 rounded-full font-label-md font-bold text-sm hover:bg-primary/90 hover:shadow-md transition-all duration-300"
            >
              Login
            </button>
          )}
        </div>
        
      </div>

      <UpdateProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </header>
  );
};

export default TopAppBar;
