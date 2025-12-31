
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, tenant } = useSelector((state: RootState) => state.auth);

  const navigateToProfile = () => {
    window.location.hash = '#/profile';
  };

  return (
    <div className="flex min-h-screen bg-slate-50" style={{ '--primary-crm': tenant?.primary_color || '#2563eb' } as React.CSSProperties}>
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center space-x-4">
             {tenant?.logo_url ? (
               <img src={tenant.logo_url} alt="Logo" className="h-8 w-auto max-h-8" />
             ) : (
               <h1 className="text-xl font-bold text-slate-900">
                  {tenant?.name || 'PakCRM'}
               </h1>
             )}
             <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-blue-100 uppercase tracking-wider">
                Production Environment
             </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="h-10 w-10 flex items-center justify-center text-slate-400 hover:text-primary-crm hover:bg-slate-50 rounded-full transition-all">
                <i className="fa-solid fa-bell"></i>
            </button>
            <div className="h-8 w-[1px] bg-slate-200"></div>
            
            <button 
                onClick={navigateToProfile}
                className="flex items-center space-x-3 bg-slate-50 px-3 py-1.5 rounded-2xl border border-slate-100 hover:border-primary-crm/30 transition-all group"
            >
               <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-900 leading-tight group-hover:text-primary-crm transition-colors">{user?.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{user?.role}</p>
               </div>
               <div className="relative">
                  <img 
                    src={user?.avatar} 
                    alt="User Profile" 
                    className="h-8 w-8 rounded-lg border border-slate-200 shadow-sm group-hover:ring-2 ring-primary-crm transition-all" 
                  />
                  <span className="absolute -bottom-1 -right-1 h-3 w-3 bg-emerald-500 border-2 border-white rounded-full"></span>
               </div>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          {children}
        </main>
      </div>

      <style>{`
        .bg-primary-crm { background-color: var(--primary-crm); }
        .text-primary-crm { color: var(--primary-crm); }
        .border-primary-crm { border-color: var(--primary-crm); }
        .ring-primary-crm { --tw-ring-color: var(--primary-crm); }
        .hover-bg-primary-crm:hover { background-color: var(--primary-crm); }
      `}</style>
    </div>
  );
};

export default Layout;
