
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, toggleTheme, markNotificationRead } from '../store/store';

const Header: React.FC = () => {
    const dispatch = useDispatch();
    const { tenant, user, isDarkMode } = useSelector((state: RootState) => state.auth);
    const { notifications } = useSelector((state: RootState) => state.crm);
    const [showNotifications, setShowNotifications] = useState(false);
    
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <header className="h-20 sticky top-0 z-[80] bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 px-6 sm:px-10 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <div className="lg:hidden h-10 w-10 bg-primary-crm rounded-xl flex items-center justify-center text-white shadow-lg">
                    <i className="fa-solid fa-cube"></i>
                </div>
                <div>
                    <h1 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-tighter leading-none">
                        {tenant?.name || 'PakCRM'} <span className="text-primary-crm font-black">.</span>
                    </h1>
                    <div className="flex items-center space-x-2 mt-1">
                        <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Neural Link Active</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-3 sm:space-x-6">
                {/* Dark Mode Toggle */}
                <button 
                    onClick={() => dispatch(toggleTheme())}
                    className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-all hover:scale-105"
                >
                    <i className={`fa-solid ${isDarkMode ? 'fa-sun text-amber-400' : 'fa-moon'}`}></i>
                </button>

                {/* Notifications */}
                <div className="relative">
                    <button 
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-all hover:scale-105"
                    >
                        <i className="fa-solid fa-bell"></i>
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 h-5 w-5 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-4 w-72 sm:w-80 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 animate-in fade-in zoom-in-95">
                            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 px-2">Intelligence Briefing</h4>
                            <div className="space-y-2">
                                {notifications.map(n => (
                                    <div 
                                        key={n.id} 
                                        onClick={() => dispatch(markNotificationRead(n.id))}
                                        className={`p-3 rounded-2xl cursor-pointer transition-colors ${n.read ? 'opacity-50' : 'bg-slate-50 dark:bg-slate-800/50'}`}
                                    >
                                        <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200">{n.text}</p>
                                        <span className="text-[9px] font-black text-slate-400 uppercase mt-1 block">{n.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile Quick Access */}
                <div className="flex items-center space-x-3 bg-slate-100 dark:bg-slate-800 pl-3 pr-1 py-1 rounded-2xl">
                    <span className="hidden sm:block text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{user?.name}</span>
                    <img 
                        src={user?.avatar} 
                        className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl border border-white dark:border-slate-700 shadow-sm" 
                        alt="Avatar"
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;
