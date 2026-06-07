import React, { useState, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import TopAppBar from '../components/TopAppBar';
import { useCards } from '../context/CardContext';

// --- Configuration Data ---
const CATEGORIES = [
  { id: 'information', label: 'Information', icon: 'info' },
  { id: 'technology', label: 'Technology', icon: 'memory' },
  { id: 'project-planning', label: 'Project Planning', icon: 'event_note' },
  { id: 'project-control', label: 'Project Control', icon: 'precision_manufacturing' },
  { id: 'engineering', label: 'Engineering', icon: 'architecture' }
];

const COLOR_PALETTE = [
  '#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6', '#10b981', '#22c55e', '#84cc16', 
  '#eab308', '#f59e0b', '#f97316', '#ef4444', '#f43f5e', '#ec4899', '#d946ef',
  '#a855f7', '#8b5cf6', '#6366f1', '#4f46e5', '#475569', '#334155'
];



const ManageCards = () => {
  const { cards, addCard, updateCard, deleteCard } = useCards();

  // State
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);

  const COMMON_ICONS = [
    'language', 'domain', 'newspaper', 'account_tree', 'menu_book', 'event', 'bar_chart', 'folder', 'monitoring', 'memory', 'account_balance', 'schedule', 'public', 'engineering', 'school', 'medical_services', 'store', 'flight', 'rocket', 'group', 'star', 'home'
  ];
  const EMOJI_CATEGORIES = [
    {
      name: "Smileys & People",
      emojis: ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','😉','😊','😇','🥰','😍','🤩','😘','😗','😚','😙','😋']
    },
    {
      name: "Work & Office",
      emojis: ['💻','🖥️','🖨️','⌨️','🖱️','🖲️','💽','💾','💿','📀','📼','📷','📸','📹','🎥','📽️','🎞️','📞','☎️','📟']
    },
    {
      name: "Objects & Tools",
      emojis: ['💡','🔦','🏮','📔','📕','📖','📗','📘','📙','📚','📓','📒','📃','📜','📄','📰','🗞️','📑','🔖','🏷️']
    },
    {
      name: "Symbols & Signs",
      emojis: ['✅','✔️','☑️','❌','✖️','❓','❔','❕','❗','➕','➖','➗','💲','💰','💳','🪙','💯','⚠️','🛑','⭕']
    },
    {
      name: "Places & Transport",
      emojis: ['🏢','🏫','🏣','🏤','🏥','🏦','🏨','🏩','🏪','🏬','🏭','🏯','🏰','🚀','✈️','🛫','🛬','🛰️','🚄','🚗']
    }
  ];
  const isEmojiStr = (str) => /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u.test(str || '');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    emoji: 'language',
    imageUrl: '',
    colorHex: COLOR_PALETTE[0],
    isActive: true,
  });

  // Derived Data
  const categoryCounts = useMemo(() => {
    const counts = {};
    CATEGORIES.forEach(c => { counts[c.id] = 0; });
    cards.forEach(card => {
      if (counts[card.category] !== undefined) {
        counts[card.category]++;
      }
    });
    return counts;
  }, [cards]);

  const filteredCards = cards.filter(card => card.category === activeCategory);

  // Handlers
  const handleOpenModal = (card = null) => {
    if (card) {
      setEditingCard(card);
      setFormData({
        title: card.title || '',
        url: card.url || '',
        description: card.description || '',
        emoji: card.icon || 'language',
        imageUrl: card.imageUrl || '',
        colorHex: card.colorHex || card.colorClass?.match(/text-\[(#[0-9a-fA-F]{6})\]/)?.[1] || COLOR_PALETTE[0],
        isActive: card.isActive !== false,
      });
    } else {
      setEditingCard(null);
      setFormData({
        title: '',
        url: '',
        description: '',
        emoji: 'language',
        imageUrl: '',
        colorHex: COLOR_PALETTE[0],
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCard(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const payload = {
      title: formData.title,
      url: formData.url,
      description: formData.description,
      icon: formData.emoji,
      imageUrl: formData.imageUrl,
      colorHex: formData.colorHex,
      isActive: formData.isActive,
      category: activeCategory, // Assigned to the currently active tab
      colorClass: '' // Legacy reset
    };

    if (editingCard) {
      updateCard(editingCard.id, payload);
    } else {
      addCard(payload);
    }
    handleCloseModal();
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`คุณต้องการลบ Card "${title}" ใช่หรือไม่?`)) {
      deleteCard(id);
    }
  };

  const toggleActive = (card) => {
    updateCard(card.id, { isActive: !card.isActive });
  };

  const activeCategoryLabel = CATEGORIES.find(c => c.id === activeCategory)?.label || '';

  return (
    <div className="flex min-h-screen font-inter bg-surface selection:bg-primary-container selection:text-on-primary-container">
      {/* Sidebar Restored */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col ml-0 md:ml-[280px] min-h-screen relative transition-all duration-300">
        <TopAppBar title="จัดการการ์ดเมนู (Card Management)" onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 p-gutter max-w-[1440px] mx-auto w-full">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-on-surface mb-1">จัดการ Cards</h1>
              <p className="text-sm text-secondary">เพิ่ม แก้ไข หรือลบ Card ในแต่ละหมวดหมู่</p>
            </div>
            <button 
              onClick={() => handleOpenModal()}
              className="mt-4 md:mt-0 bg-primary hover:bg-primary/90 text-on-primary px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              เพิ่ม Card ใหม่
            </button>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-outline-variant/30 flex overflow-x-auto mb-6 custom-scrollbar">
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-6 py-3.5 border-b-2 font-semibold text-sm transition-all whitespace-nowrap ${
                    isActive 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-secondary hover:text-on-surface hover:border-outline-variant/50'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[18px] ${isActive ? 'text-primary' : 'text-secondary/70'}`}>
                    {cat.icon}
                  </span>
                  {cat.label}
                  <span className={`ml-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    isActive ? 'bg-primary/10 text-primary' : 'bg-surface-container-high text-secondary'
                  }`}>
                    {categoryCounts[cat.id] || 0}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Cards List in Selected Tab */}
          <div className="flex flex-col gap-3">
            {filteredCards.length > 0 ? (
              filteredCards.map((card) => {
                const activeStatus = card.isActive !== false;
                const hasUrl = !!card.url && card.url.trim() !== '#' && card.url.trim() !== '';
                // Fallback for older cards that use colorClass instead of colorHex
                const bgStyle = card.colorHex ? { backgroundColor: card.colorHex } : {};
                const wrapperClass = card.colorHex ? '' : (card.colorClass || 'bg-primary/10 text-primary');

                return (
                  <div key={card.id} className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                    
                    {/* Icon Box */}
                    <div 
                      className={`w-12 h-12 flex items-center justify-center shrink-0 overflow-hidden bg-transparent`}
                    >
                      {card.imageUrl ? (
                        <img src={card.imageUrl} alt="icon" className="w-full h-full object-cover rounded-xl shadow-sm" />
                      ) : (
                        <span 
                          className={`${isEmojiStr(card.icon) ? '' : 'material-symbols-outlined'} text-[32px]`}
                          style={isEmojiStr(card.icon) ? {} : { color: card.colorHex || card.colorClass?.match(/text-\[(#[0-9a-fA-F]{6})\]/)?.[1] || 'var(--color-primary)' }}
                        >
                          {card.icon || 'language'}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1.5">
                        <h3 className="text-base font-bold text-on-surface truncate">{card.title}</h3>
                        
                        {/* Status Badges */}
                        {!hasUrl ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
                            ยังไม่มี URL
                          </span>
                        ) : null}
                        
                        {activeStatus ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                            <span className="material-symbols-outlined text-[10px]">check</span>
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200">
                            Inactive
                          </span>
                        )}
                      </div>
                      
                      <div className="hidden md:block">
                        <p className="text-xs text-secondary/70 mb-1.5 truncate">
                          {hasUrl ? card.url : '-'}
                        </p>
                        <p className="text-sm text-secondary line-clamp-2">
                          {card.description || '-'}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 ml-4 self-center shrink-0">
                      <button 
                        onClick={() => toggleActive(card)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                          activeStatus ? 'text-emerald-500 hover:bg-emerald-50' : 'text-secondary/50 hover:bg-surface-container-high'
                        }`}
                        title={activeStatus ? 'Deactivate' : 'Activate'}
                      >
                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                      </button>
                      <button 
                        onClick={() => handleOpenModal(card)}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-secondary hover:text-primary hover:bg-primary/5 transition-colors"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(card.id, card.title)}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-secondary hover:text-error hover:bg-error/5 transition-colors"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-16 text-center shadow-sm">
                <span className="material-symbols-outlined text-[48px] text-secondary/30 mb-3">inbox</span>
                <p className="text-secondary font-medium">ยังไม่มีข้อมูล Card ในหมวดหมู่นี้</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ----------------- Modal Overlay ----------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl w-full max-w-[500px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between bg-surface/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">{editingCard ? 'edit' : 'add'}</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-on-surface leading-none">
                    {editingCard ? 'แก้ไข Card' : 'เพิ่ม Card ใหม่'}
                  </h2>
                  <p className="text-xs text-secondary mt-1">
                    หมวด: {activeCategoryLabel}
                  </p>
                </div>
              </div>
              <button onClick={handleCloseModal} className="text-secondary/50 hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
              
              {/* Preview Box */}
              <div className="border border-outline-variant/20 rounded-xl p-4 flex items-center gap-4 mb-6 bg-surface-container-lowest shadow-sm">
                <div 
                  className="w-14 h-14 flex items-center justify-center shrink-0 transition-colors duration-300 overflow-hidden bg-transparent"
                >
                  {formData.imageUrl ? (
                    <img src={formData.imageUrl} alt="preview" className="w-full h-full object-cover rounded-xl shadow-sm" />
                  ) : (
                    <span 
                      className={`${isEmojiStr(formData.emoji) ? '' : 'material-symbols-outlined'} text-[36px]`}
                      style={isEmojiStr(formData.emoji) ? {} : { color: formData.colorHex }}
                    >
                      {formData.emoji || 'language'}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-on-surface text-base truncate">
                    {formData.title || 'ชื่อ Card'}
                  </h4>
                  <p className="text-xs text-secondary/70 truncate mb-1">
                    {formData.url || 'https://...'}
                  </p>
                  <p className="text-xs text-secondary truncate">
                    {formData.description || 'คำอธิบาย...'}
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <form id="card-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
                
                {/* Icon Select & Upload */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Emoji Select */}
                  <div className="relative">
                    <label className="block text-[11px] font-bold text-secondary mb-1.5 uppercase tracking-wider">
                      ICON (พิมพ์ชื่อหรือวาง Emoji)
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={formData.emoji}
                          onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 bg-surface border border-outline-variant/30 rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                          placeholder="เช่น language หรือ 🌐"
                          disabled={!!formData.imageUrl}
                        />
                        <span 
                          className={`${isEmojiStr(formData.emoji) ? '' : 'material-symbols-outlined'} absolute left-3 top-1/2 -translate-y-1/2 text-[18px] pointer-events-none ${formData.imageUrl ? 'text-secondary/30' : 'text-secondary/70'}`}
                        >
                          {formData.emoji || 'language'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsIconPickerOpen(!isIconPickerOpen)}
                        disabled={!!formData.imageUrl}
                        className="px-3 py-2.5 bg-surface border border-outline-variant/30 hover:border-primary/50 hover:bg-primary/5 rounded-lg text-secondary hover:text-primary transition-colors flex items-center justify-center disabled:opacity-50 shrink-0"
                        title="เลือก Icon / Emoji"
                      >
                        <span className="material-symbols-outlined text-[20px]">apps</span>
                      </button>
                    </div>

                    {/* Icon Picker Popover */}
                    {isIconPickerOpen && (
                      <div className="absolute top-[calc(100%+0.5rem)] left-0 w-full bg-surface border border-outline-variant/20 rounded-xl shadow-xl z-[60] p-3 max-h-60 overflow-y-auto custom-scrollbar">
                        <div className="mb-3">
                          <p className="text-[11px] font-bold text-secondary mb-2 uppercase tracking-wider">System Icons</p>
                          <div className="grid grid-cols-6 gap-2">
                            {COMMON_ICONS.map(icon => (
                              <button
                                key={icon}
                                type="button"
                                onClick={() => { setFormData({...formData, emoji: icon}); setIsIconPickerOpen(false); }}
                                className="w-8 h-8 flex items-center justify-center rounded bg-surface-container-lowest hover:bg-primary/10 text-secondary hover:text-primary transition-colors border border-outline-variant/10"
                                title={icon}
                              >
                                <span className="material-symbols-outlined text-[20px]">{icon}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                        {EMOJI_CATEGORIES.map(category => (
                          <div key={category.name} className="mb-3">
                            <p className="text-[11px] font-bold text-secondary mb-2 uppercase tracking-wider">{category.name}</p>
                            <div className="grid grid-cols-6 gap-2">
                              {category.emojis.map(emoji => (
                                <button
                                  key={emoji}
                                  type="button"
                                  onClick={() => { setFormData({...formData, emoji: emoji}); setIsIconPickerOpen(false); }}
                                  className="w-8 h-8 flex items-center justify-center rounded bg-surface-container-lowest hover:bg-primary/10 text-[18px] transition-colors border border-outline-variant/10"
                                  title={emoji}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Upload Image */}
                  <div>
                    <label className="block text-[11px] font-bold text-secondary mb-1.5 uppercase tracking-wider">
                      หรือ อัพโหลดรูปภาพ (PNG/JPG)
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="flex-1 flex items-center justify-center px-3 py-2.5 bg-surface border border-outline-variant/30 hover:border-primary/50 hover:bg-primary/5 rounded-lg text-sm text-secondary hover:text-primary cursor-pointer transition-colors border-dashed">
                        <span className="material-symbols-outlined text-[18px] mr-1.5">upload_file</span>
                        <span className="truncate max-w-[90px]">{formData.imageUrl ? 'เปลี่ยนรูปภาพ' : 'เลือกไฟล์'}</span>
                        <input 
                          type="file" 
                          accept="image/png, image/jpeg" 
                          className="hidden" 
                          onChange={handleImageUpload}
                        />
                      </label>
                      {formData.imageUrl && (
                        <button 
                          type="button"
                          onClick={() => setFormData({ ...formData, imageUrl: '' })}
                          className="w-10 h-[42px] flex items-center justify-center text-error bg-error/10 hover:bg-error/20 rounded-lg transition-colors shrink-0"
                          title="ลบรูปภาพ"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-[11px] font-bold text-secondary mb-1.5 uppercase tracking-wider">
                    ชื่อ CARD <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="เช่น QC Dashboard"
                    className="w-full px-4 py-2.5 bg-surface border border-outline-variant/30 rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>

                {/* URL */}
                <div>
                  <label className="block text-[11px] font-bold text-secondary mb-1.5 uppercase tracking-wider">
                    URL <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://example.web.app"
                    className="w-full px-4 py-2.5 bg-surface border border-outline-variant/30 rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    required
                  />
                  <p className="text-[11px] text-secondary/60 mt-1.5">ใส่ # ถ้ายังไม่มี URL</p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[11px] font-bold text-secondary mb-1.5 uppercase tracking-wider">
                    คำอธิบาย
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => {
                      if (e.target.value.length <= 80) {
                        setFormData({ ...formData, description: e.target.value });
                      }
                    }}
                    placeholder="อธิบายระบบสั้นๆ..."
                    rows={2}
                    className="w-full px-4 py-2.5 bg-surface border border-outline-variant/30 rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                  />
                  <div className="text-[11px] text-secondary/60 text-right mt-1">
                    {formData.description.length}/80
                  </div>
                </div>

                {/* Color Selector */}
                <div>
                  <label className="block text-[11px] font-bold text-secondary mb-2.5 uppercase tracking-wider">
                    สีพื้นหลัง ICON (FALLBACK)
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {COLOR_PALETTE.map(hex => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => setFormData({ ...formData, colorHex: hex })}
                        className={`w-7 h-7 rounded-md border-2 transition-all ${
                          formData.colorHex === hex 
                            ? 'border-on-surface scale-110 shadow-sm' 
                            : 'border-transparent hover:scale-110'
                        }`}
                        style={{ backgroundColor: hex }}
                        title={hex}
                      />
                    ))}
                  </div>
                </div>

                {/* Active Toggle */}
                <div className="bg-surface border border-outline-variant/30 rounded-xl p-4 flex items-center justify-between mt-2">
                  <div className="pr-4">
                    <h4 className="text-sm font-bold text-on-surface mb-1">สถานะการแสดงผล</h4>
                    <p className="text-[11px] text-secondary leading-snug">
                      เมื่อตั้งเป็น <span className="text-emerald-600 font-semibold">Active</span> จะมีเครื่องหมาย ✓ สีเขียวแสดงที่มุมบนซ้ายของ Card
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                    className={`relative w-12 h-6 rounded-full transition-colors shrink-0 shadow-inner ${
                      formData.isActive ? 'bg-emerald-500' : 'bg-outline-variant/50'
                    }`}
                  >
                    <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${
                      formData.isActive ? 'left-[26px]' : 'left-1'
                    }`} />
                  </button>
                  <span className={`text-xs font-bold w-12 text-right ${formData.isActive ? 'text-emerald-600' : 'text-secondary/70'}`}>
                    {formData.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-surface border-t border-outline-variant/20 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-secondary hover:text-on-surface hover:bg-surface-container-high transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                form="card-form"
                className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-on-primary rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                {editingCard ? 'บันทึก' : 'เพิ่ม Card'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ManageCards;
