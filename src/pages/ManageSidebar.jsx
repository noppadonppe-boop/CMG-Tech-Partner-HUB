import React, { useState, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import TopAppBar from '../components/TopAppBar';
import { useCards } from '../context/CardContext';

const COLOR_PALETTE = [
  '#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6', '#10b981', '#22c55e', '#84cc16', 
  '#eab308', '#f59e0b', '#f97316', '#ef4444', '#f43f5e', '#ec4899', '#d946ef',
  '#a855f7', '#8b5cf6', '#6366f1', '#4f46e5', '#475569', '#334155'
];

const COMMON_ICONS = [
  'info', 'memory', 'event_note', 'precision_manufacturing', 'architecture',
  'language', 'domain', 'newspaper', 'account_tree', 'menu_book', 'event', 'bar_chart', 
  'folder', 'monitoring', 'account_balance', 'schedule', 'public', 'engineering', 
  'school', 'medical_services', 'store', 'flight', 'rocket', 'group', 'star', 'home'
];

const ManageSidebar = () => {
  const { cards, sidebarMenus, addSidebarMenu, updateSidebarMenu, deleteSidebarMenu } = useCards();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    label: '',
    slug: '',
    type: 'main',
    parentId: '',
    icon: 'folder',
    color: COLOR_PALETTE[0],
    order: 0
  });

  // Get only main menus to act as potential parents
  const mainMenusOnly = useMemo(() => {
    return sidebarMenus.filter(m => m.type === 'main' || !m.type);
  }, [sidebarMenus]);

  // Group menus hierarchically for display
  const hierarchicalMenus = useMemo(() => {
    const mains = sidebarMenus.filter(m => m.type === 'main' || !m.parentId);
    const result = [];
    
    mains.forEach(main => {
      result.push({
        ...main,
        isSub: false
      });
      // Find submenus
      const subs = sidebarMenus.filter(m => m.type === 'sub' && m.parentId === main.id);
      subs.forEach(sub => {
        result.push({
          ...sub,
          isSub: true,
          parentLabel: main.label
        });
      });
    });

    // Also find orphan subs (in case a parent was deleted or changed)
    const activeMainIds = mains.map(m => m.id);
    const orphans = sidebarMenus.filter(m => m.type === 'sub' && !activeMainIds.includes(m.parentId));
    orphans.forEach(sub => {
      result.push({
        ...sub,
        isSub: true,
        parentLabel: 'ไม่มี (Orphaned)'
      });
    });

    return result;
  }, [sidebarMenus]);

  // Handlers
  const handleOpenModal = (menu = null) => {
    if (menu) {
      setEditingMenu(menu);
      setFormData({
        label: menu.label || '',
        slug: menu.id || '',
        type: menu.type || 'main',
        parentId: menu.parentId || '',
        icon: menu.icon || 'folder',
        color: menu.color || COLOR_PALETTE[0],
        order: menu.order || 0
      });
    } else {
      setEditingMenu(null);
      // Auto-increment order
      const maxOrder = sidebarMenus.reduce((max, item) => Math.max(max, item.order || 0), -1);
      setFormData({
        label: '',
        slug: '',
        type: 'main',
        parentId: '',
        icon: 'folder',
        color: COLOR_PALETTE[0],
        order: maxOrder + 1
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMenu(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.label.trim() || !formData.slug.trim()) return;

    // Clean slug: replace spaces/special chars with hyphens, lowercase
    const cleanId = formData.slug.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-');
    const path = `/${cleanId}`;

    const payload = {
      label: formData.label.trim(),
      path: path,
      type: formData.type,
      parentId: formData.type === 'sub' ? formData.parentId : '',
      icon: formData.icon,
      color: formData.color,
      order: Number(formData.order)
    };

    if (editingMenu) {
      // If we are editing, keep the same ID but update content
      await updateSidebarMenu(editingMenu.id, payload);
    } else {
      // Adding new menu
      await addSidebarMenu({
        ...payload,
        id: cleanId
      });
    }
    handleCloseModal();
  };

  const handleDelete = async (id, label) => {
    // Check if there are any cards associated with this category
    const associatedCards = cards.filter(c => c.category === id);
    if (associatedCards.length > 0) {
      alert(`ไม่สามารถลบเมนู "${label}" ได้ เนื่องจากยังมี Card อยู่ในเมนูนี้จำนวน ${associatedCards.length} รายการ กรุณาลบการ์ดออกก่อน!`);
      return;
    }

    if (window.confirm(`คุณต้องการลบเมนู "${label}" ใช่หรือไม่?`)) {
      try {
        await deleteSidebarMenu(id);
      } catch (error) {
        alert(`เกิดข้อผิดพลาดในการลบ: ${error.message}`);
      }
    }
  };

  const isEmojiStr = (str) => /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u.test(str || '');

  return (
    <div className="flex min-h-screen font-inter bg-surface selection:bg-primary-container selection:text-on-primary-container">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col ml-0 md:ml-[280px] min-h-screen relative transition-all duration-300">
        <TopAppBar title="จัดการ Sidebar (Sidebar Management)" onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 p-gutter max-w-[1440px] mx-auto w-full">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-on-surface mb-1">จัดการ Sidebar</h1>
              <p className="text-sm text-secondary">เพิ่ม ลบ หรือแก้ไขโครงสร้างเมนูของ Sidebar และแบ่งกลุ่ม Main / Sub</p>
            </div>
            <button 
              onClick={() => handleOpenModal()}
              className="mt-4 md:mt-0 bg-primary hover:bg-primary/90 text-on-primary px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              เพิ่มเมนูใหม่
            </button>
          </div>

          {/* Menus Table */}
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface/50 border-b border-outline-variant/20 text-xs font-bold text-secondary uppercase tracking-wider">
                    <th className="px-6 py-4 w-20">ลำดับ (Order)</th>
                    <th className="px-6 py-4">เมนู (Label)</th>
                    <th className="px-6 py-4">เส้นทาง (Route Path)</th>
                    <th className="px-6 py-4">ประเภท (Type)</th>
                    <th className="px-6 py-4">เมนูหลัก (Parent)</th>
                    <th className="px-6 py-4 text-right">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {hierarchicalMenus.length > 0 ? (
                    hierarchicalMenus.map((menu) => {
                      return (
                        <tr 
                          key={menu.id} 
                          className={`hover:bg-surface/30 transition-colors ${menu.isSub ? 'bg-surface/10' : ''}`}
                        >
                          <td className="px-6 py-4 font-semibold text-sm text-secondary">
                            {menu.order}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {menu.isSub && (
                                <span className="material-symbols-outlined text-secondary/40 select-none text-[20px] ml-4">
                                  subdirectory_arrow_right
                                </span>
                              )}
                              <div 
                                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
                                style={{ backgroundColor: `${menu.color}20` }} // 12% opacity hex
                              >
                                <span 
                                  className={`${isEmojiStr(menu.icon) ? '' : 'material-symbols-outlined'} text-[20px]`}
                                  style={isEmojiStr(menu.icon) ? {} : { color: menu.color }}
                                >
                                  {menu.icon || 'folder'}
                                </span>
                              </div>
                              <span className="font-bold text-on-surface text-sm">{menu.label}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-mono text-secondary">
                            {menu.path}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                              menu.type === 'sub' 
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}>
                              {menu.type === 'sub' ? 'Sub Menu' : 'Main Menu'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-secondary">
                            {menu.type === 'sub' ? menu.parentLabel : '-'}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button 
                                onClick={() => handleOpenModal(menu)}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:text-primary hover:bg-primary/5 transition-colors"
                                title="Edit"
                              >
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                              </button>
                              <button 
                                onClick={() => handleDelete(menu.id, menu.label)}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:text-error hover:bg-error/5 transition-colors"
                                title="Delete"
                              >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-16 text-center text-secondary font-medium">
                        <span className="material-symbols-outlined text-[48px] text-secondary/30 mb-2">menu_open</span>
                        <p>ไม่มีข้อมูลเมนูใน Sidebar</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl w-full max-w-[500px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between bg-surface/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">{editingMenu ? 'edit' : 'add'}</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-on-surface leading-none">
                    {editingMenu ? 'แก้ไขเมนู Sidebar' : 'เพิ่มเมนู Sidebar ใหม่'}
                  </h2>
                  <p className="text-xs text-secondary mt-1">
                    {editingMenu ? `ID: ${editingMenu.id}` : 'กำหนดสไตล์และประเภทเมนู'}
                  </p>
                </div>
              </div>
              <button onClick={handleCloseModal} className="text-secondary/50 hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
              <form id="menu-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
                
                {/* Menu Label */}
                <div>
                  <label className="block text-[11px] font-bold text-secondary mb-1.5 uppercase tracking-wider">
                    ชื่อเมนู (Label)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface border border-outline-variant/30 rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="เช่น Information, ระบบรายงาน"
                  />
                </div>

                {/* Slug / Path */}
                <div>
                  <label className="block text-[11px] font-bold text-secondary mb-1.5 uppercase tracking-wider">
                    สลักปลายทาง / Slug (ID)
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!editingMenu} // Disable changing ID on edit because it maps to card collections
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface border border-outline-variant/30 rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:bg-surface/50 disabled:text-secondary/50"
                    placeholder="เช่น information, report-system (อังกฤษเท่านั้น)"
                  />
                  {!editingMenu && (
                    <p className="text-[10px] text-secondary/60 mt-1">
                      จะกลายเป็นเส้นทางระบบ เช่น /information
                    </p>
                  )}
                </div>

                {/* Type Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-secondary mb-1.5 uppercase tracking-wider">
                      ประเภทเมนู (Type)
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value, parentId: e.target.value === 'main' ? '' : formData.parentId })}
                      className="w-full px-4 py-2.5 bg-surface border border-outline-variant/30 rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    >
                      <option value="main">Main Menu</option>
                      <option value="sub">Sub Menu</option>
                    </select>
                  </div>

                  {/* Order */}
                  <div>
                    <label className="block text-[11px] font-bold text-secondary mb-1.5 uppercase tracking-wider">
                      ลำดับการแสดงผล (Order)
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                      className="w-full px-4 py-2.5 bg-surface border border-outline-variant/30 rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                {/* Parent Menu (Conditional) */}
                {formData.type === 'sub' && (
                  <div>
                    <label className="block text-[11px] font-bold text-secondary mb-1.5 uppercase tracking-wider">
                      เลือกเมนูหลัก (Parent Menu)
                    </label>
                    <select
                      required
                      value={formData.parentId}
                      onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                      className="w-full px-4 py-2.5 bg-surface border border-outline-variant/30 rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    >
                      <option value="">-- กรุณาเลือกเมนูหลัก --</option>
                      {mainMenusOnly
                        .filter(m => m.id !== editingMenu?.id) // Can't select itself
                        .map(m => (
                          <option key={m.id} value={m.id}>{m.label}</option>
                        ))
                      }
                    </select>
                  </div>
                )}

                {/* Icon Selection */}
                <div>
                  <label className="block text-[11px] font-bold text-secondary mb-1.5 uppercase tracking-wider">
                    สัญลักษณ์ / Icon (Material Symbol หรือ Emoji)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full px-4 py-2.5 bg-surface border border-outline-variant/30 rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="เช่น folder หรือ 📁"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2 max-h-[80px] overflow-y-auto p-1.5 bg-surface border border-outline-variant/10 rounded-lg">
                    {COMMON_ICONS.map(ic => (
                      <button
                        key={ic}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: ic })}
                        className={`w-7 h-7 rounded flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors ${formData.icon === ic ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-secondary'}`}
                        title={ic}
                      >
                        <span className="material-symbols-outlined text-[16px]">{ic}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Palette */}
                <div>
                  <label className="block text-[11px] font-bold text-secondary mb-2 uppercase tracking-wider">
                    โทนสีของเมนู (Color Theme)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COLOR_PALETTE.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 border border-outline-variant/20 transition-transform hover:scale-110 shadow-sm"
                        style={{ backgroundColor: color }}
                      >
                        {formData.color === color && (
                          <span className="material-symbols-outlined text-[14px] text-white font-bold select-none">
                            check
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-outline-variant/20 bg-surface/50 flex items-center justify-end gap-3 shrink-0">
              <button 
                type="button" 
                onClick={handleCloseModal}
                className="px-4 py-2 border border-outline-variant/50 rounded-lg text-sm font-semibold text-secondary hover:bg-surface-container-high transition-colors"
              >
                ยกเลิก
              </button>
              <button 
                type="submit" 
                form="menu-form"
                className="px-5 py-2 bg-primary hover:bg-primary/90 text-on-primary rounded-lg text-sm font-semibold shadow-sm transition-colors"
              >
                {editingMenu ? 'บันทึกการแก้ไข' : 'บันทึก'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ManageSidebar;
