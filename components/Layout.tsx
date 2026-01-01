
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import Sidebar from './Sidebar';
import Header from './Header';
import ChatBot from './ChatBot';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { tenant } = useSelector((state: RootState) => state.auth);
  const currentHash = window.location.hash || '#/';

  const navigate = (path: string) => {
    window.location.hash = path;
  };

  const navItems = [
    { id: 'home', icon: 'fa-solid fa-house', path: '#/' },
    { id: 'inbox', icon: 'fa-solid fa-envelope', path: '#/inbox' },
    { id: 'pipelines', icon: 'fa-solid fa-hexagon-nodes-alt', path: '#/pipelines' },
    { id: 'contacts', icon: 'fa-solid fa-building', path: '#/contacts' },
    { id: 'automations', icon: 'fa-solid fa-brain', path: '#/automations' },
    { id: 'profile', icon: 'fa-solid fa-user', path: '#/profile' },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500" style={{ '--primary-crm': tenant?.primary_color || '#2563eb' } as React.CSSProperties}>
      
      {/* Desktop Sidebar Rail */}
      <div className="hidden lg:block sticky top-0 h-screen shrink-0 z-[100]">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-24 lg:pb-0">
        <Header />
        <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-[1600px] mx-auto w-full transition-all">
          {children}
        </main>
      </div>

      {/* Global AI ChatBot */}
      <ChatBot />

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 px-4 py-2 z-[90] flex justify-between items-center shadow-2xl">
        {navItems.map((item) => {
          const isActive = currentHash === item.path;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className="flex-1 flex flex-col items-center justify-center py-2 transition-all duration-300 relative"
            >
              <div className={`transition-all duration-300 ${isActive ? 'text-primary-crm transform -translate-y-1 scale-110' : 'text-slate-400 dark:text-slate-500'}`}>
                <i className={`${item.icon} text-lg`}></i>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
