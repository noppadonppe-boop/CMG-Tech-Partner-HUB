import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopAppBar from '../components/TopAppBar';
import SystemCard from '../components/SystemCard';
import { useCards } from '../context/CardContext';

const categoriesData = [
  { id: 'information', title: 'Information', image: '/information.png' },
  { id: 'technology', title: 'Technology', image: '/Technology.png' },
  { id: 'project-planning', title: 'Project Planning', image: '/Project Planing.png' },
  { id: 'project-control', title: 'Project Control', image: '/Project Control.png' },
  { id: 'engineering', title: 'Engineering', image: '/Engineering.png' }
];

const categoryTitles = categoriesData.reduce((acc, cur) => ({...acc, [cur.id]: cur.title}), {});

const Dashboard = () => {
  const { category } = useParams();
  const { cards } = useCards();
  const [showToast, setShowToast] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Simulate a system toast fading in and out on mount
    const timer1 = setTimeout(() => {
      setShowToast(true);
    }, 1000);

    const timer2 = setTimeout(() => {
      setShowToast(false);
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [category]); // Re-trigger on category change

  // If the category route is invalid, redirect to project-planning
  if (!category || !categoryTitles[category]) {
    return <Navigate to="/project-planning" replace />;
  }

  const activeIndex = categoriesData.findIndex(c => c.id === category);
  const pageTitle = categoryTitles[category];

  return (
    <div className="flex min-h-screen font-inter selection:bg-primary-container selection:text-on-primary-container overflow-hidden bg-background relative w-full">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Main content wrapper is now full width, so backgrounds slide completely underneath Sidebar */}
      <div className="flex-1 h-screen relative overflow-hidden transition-all duration-300">
        
        {/* TopAppBar stays fixed above everything, positioned after the Sidebar on desktop */}
        <div className="absolute top-0 left-0 md:left-[280px] right-0 z-30 transition-all duration-300">
          <TopAppBar title={pageTitle} viewMode={viewMode} onViewModeChange={setViewMode} onMenuClick={() => setIsSidebarOpen(true)} />
        </div>

        {/* Sliding Container */}
        <div 
          className="absolute inset-0 flex w-[500%] transition-transform duration-700 ease-in-out z-10"
          style={{ transform: `translateX(-${activeIndex * 20}%)` }}
        >
          {categoriesData.map((catData) => {
            const catCards = cards.filter(card => card.category === catData.id);
            return (
              <div key={catData.id} className="w-1/5 h-full relative">
                
                {/* Background Image for this slide */}
                <div 
                  className="absolute inset-0 z-0 bg-[length:100%_100%] bg-no-repeat"
                  style={{ backgroundImage: `url("${catData.image}")` }}
                >
                  {/* Very subtle gradient overlay just to ensure header text readability */}
                  <div className="absolute inset-0 bg-gradient-to-b from-surface/50 via-surface/10 to-transparent pointer-events-none"></div>
                </div>

                {/* Scrollable content area needs padding to avoid overlapping the Sidebar */}
                <div className="absolute inset-0 z-10 overflow-y-auto overflow-x-hidden pt-16 pl-0 md:pl-[280px] transition-all duration-300">
                  <main className="p-gutter max-w-container mx-auto w-full pt-8 pb-24">
                    
                    {/* Cards Grid / List */}
                    {catCards.length > 0 ? (
                      <div className={viewMode === 'grid' ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4" : "flex flex-col gap-4"}>
                        {catCards.map((system) => (
                          <SystemCard
                            key={system.id}
                            icon={system.icon}
                            title={system.title}
                            description={system.description}
                            colorClass={system.colorClass}
                            colorHex={system.colorHex}
                            url={system.url}
                            imageUrl={system.imageUrl}
                            viewMode={viewMode}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-20 px-6 bg-surface-container-lowest/80 backdrop-blur-md rounded-3xl border border-outline-variant/20 shadow-lg max-w-md mx-auto mt-12">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                          <span className="material-symbols-outlined text-[40px] text-primary select-none">
                            grid_off
                          </span>
                        </div>
                        <h3 className="font-headline-md text-headline-md text-on-surface mb-3 font-bold">
                          ไม่พบข้อมูลระบบการ์ด
                        </h3>
                        <p className="font-body-md text-body-md text-secondary/80 mb-8">
                          ยังไม่มีการเพิ่มการ์ดสำหรับหมวดหมู่ {catData.title} ในระบบ
                        </p>
                        <a
                          href="/master-admin/manage-cards"
                          className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-label-md text-label-md font-bold hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                        >
                          <span className="material-symbols-outlined text-[20px]">add_circle</span>
                          ไปที่หน้าจัดการการ์ด
                        </a>
                      </div>
                    )}

                  </main>
                </div>

              </div>
            );
          })}
        </div>

        {/* Toast Notification */}
        <div 
          className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 md:ml-[140px] bg-on-background/90 text-surface-container-lowest backdrop-blur-md border border-outline-variant/10 shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-3 pointer-events-none transition-all duration-500 z-50 ${
            showToast ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
          }`}
        >
          <span className="material-symbols-outlined text-[24px] text-[#10b981]">check_circle</span>
          <span className="font-label-md text-label-md font-semibold tracking-wide">เข้าสู่หมวดหมู่ {pageTitle} สำเร็จ</span>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
