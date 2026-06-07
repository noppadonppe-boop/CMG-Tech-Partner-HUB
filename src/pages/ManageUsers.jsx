import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopAppBar from '../components/TopAppBar';
import { db } from '../firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';

const ROLES_LIST = ['MasterAdmin', 'Admin', 'User', 'Staff', 'Engineer'];

const ManageUsers = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  
  useEffect(() => {
    const usersRef = collection(db, 'Web-Hub-Tech-Partner', 'root', 'users');
    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const usersData = [];
      snapshot.forEach(doc => {
        usersData.push({ id: doc.id, ...doc.data() });
      });
      setUsers(usersData);
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const userRef = doc(db, 'Web-Hub-Tech-Partner', 'root', 'users', editingUser.id);
      await updateDoc(userRef, {
        role: editingUser.role,
        status: editingUser.status,
        assignedProjects: editingUser.assignedProjects || []
      });
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user: ", error);
    }
  };

  const handleRoleToggle = (role) => {
    setEditingUser(prev => {
      const roles = prev.role || [];
      if (roles.includes(role)) {
        return { ...prev, role: roles.filter(r => r !== role) };
      } else {
        return { ...prev, role: [...roles, role] };
      }
    });
  };

  return (
    <div className="flex min-h-screen font-inter selection:bg-primary-container selection:text-on-primary-container overflow-hidden bg-background relative w-full">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 h-screen relative overflow-hidden transition-all duration-300">
        <div className="absolute top-0 left-0 md:left-[280px] right-0 z-30 transition-all duration-300">
          <TopAppBar title="จัดการผู้ใช้งาน (User Management)" onMenuClick={() => setIsSidebarOpen(true)} />
        </div>

        <div className="absolute inset-0 z-10 overflow-y-auto pt-16 pl-0 md:pl-[280px] transition-all duration-300 bg-slate-50/50">
          <main className="p-gutter max-w-container mx-auto w-full pt-8 pb-24">
            
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">ระบบจัดการสิทธิ์ผู้ใช้งาน</h1>
              <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 text-sm font-semibold text-slate-600">
                ผู้ใช้ทั้งหมด: <span className="text-primary">{users.length}</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-500">
                      <th className="p-4 font-semibold">User Profile</th>
                      <th className="p-4 font-semibold">Position</th>
                      <th className="p-4 font-semibold">Roles</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {user.photoURL ? (
                              <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold border border-primary/20">
                                {(user.firstName || user.email || 'U').charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className="font-semibold text-slate-800">{user.firstName} {user.lastName}</div>
                              <div className="text-xs text-slate-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-slate-600">{user.position || '-'}</div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1.5">
                            {(user.role || []).map(r => (
                              <span key={r} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg border border-slate-200">
                                {r}
                              </span>
                            ))}
                            {(!user.role || user.role.length === 0) && (
                              <span className="text-xs text-slate-400 italic">No Roles</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full ${
                            user.status === 'approved' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                            user.status === 'pending' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                            'bg-red-100 text-red-700 border border-red-200'
                          }`}>
                            {user.status === 'approved' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                            {user.status === 'pending' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>}
                            {user.status === 'rejected' && <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>}
                            <span className="capitalize">{user.status || 'unknown'}</span>
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => setEditingUser(user)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-primary hover:text-white transition-colors"
                            title="Edit User"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-12 text-center text-slate-500">
                          <span className="material-symbols-outlined text-[40px] mb-3 text-slate-300 block">group_off</span>
                          No users found in the database.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </main>
        </div>

      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">จัดการข้อมูลผู้ใช้</h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
               {editingUser.photoURL ? (
                 <img src={editingUser.photoURL} alt="Profile" className="w-12 h-12 rounded-full object-cover border border-slate-200" />
               ) : (
                 <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg border border-primary/20">
                   {(editingUser.firstName || editingUser.email || 'U').charAt(0).toUpperCase()}
                 </div>
               )}
               <div>
                 <div className="font-bold text-slate-800">{editingUser.firstName} {editingUser.lastName}</div>
                 <div className="text-sm text-slate-500">{editingUser.email}</div>
               </div>
            </div>

            <form onSubmit={handleUpdateUser} className="flex flex-col gap-5">
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">สถานะการเข้าถึง (Status)</label>
                <div className="relative">
                  <select 
                    value={editingUser.status || 'pending'} 
                    onChange={e => setEditingUser({...editingUser, status: e.target.value})}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-700 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                  >
                    <option value="pending">⏳ รอดำเนินการ (Pending)</option>
                    <option value="approved">✅ อนุมัติ (Approved)</option>
                    <option value="rejected">❌ ระงับการใช้งาน (Rejected)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">สิทธิ์การใช้งาน (Roles)</label>
                <div className="flex flex-wrap gap-2 p-4 border border-slate-300 rounded-xl bg-slate-50/50">
                  {ROLES_LIST.map(role => {
                    const isSelected = (editingUser.role || []).includes(role);
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleRoleToggle(role)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 border ${
                          isSelected 
                            ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20' 
                            : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100 hover:border-slate-400'
                        }`}
                      >
                        {isSelected && <span className="material-symbols-outlined text-[14px]">check</span>}
                        {role}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setEditingUser(null)}
                  className="px-6 py-3 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit"
                  className="px-6 py-3 text-sm font-bold bg-primary text-white rounded-xl shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  บันทึกการเปลี่ยนแปลง
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageUsers;
