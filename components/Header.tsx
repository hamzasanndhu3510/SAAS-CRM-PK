
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, markNotificationRead, logout } from '../store/store';

const Header: React.FC = () => {
    const dispatch = useDispatch();
    const { tenant, user } = useSelector((state: RootState) => state.auth);
    const { notifications } = useSelector((state: RootState) => state.crm);
    
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    
    const notificationRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setShowProfileMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        window.location.hash = '#/';
    };

    return (
        <header className="h-20 sticky top-0 z-[80] bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 px-6 sm:px-10 flex items-center justify-between transition-all">
            <div className="flex items-center space-x-4">
                <div className="lg:hidden h-10 w-10 bg-primary-crm rounded-xl flex items-center justify-center text-white shadow-lg">
                    <i className="fa-solid fa-cube"></i>
                </div>
                <div>
                    <h1 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-tighter leading-none">
                        {tenant?.name || 'AH CRM'}
                    </h1>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Network Active</p>
                </div>
            </div>

            <div className="flex items-center space-x-3 sm:space-x-5">
                {/* Requested Theme Toggle Button */}
                <button 
                    // This uses the global window function injected in App.tsx
                    onClick={() => (window as any).toggleDarkMode()}
                    className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 shadow-sm active:scale-95"
                >
                    Toggle Mode
                </button>

                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                    <button 
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="h-11 w-11 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-all hover:scale-105 shadow-sm border border-slate-100 dark:border-slate-800"
                    >
                        <i className="fa-solid fa-bell"></i>
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 h-5 w-5 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-slate-950">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-5 w-80 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-6 animate-in fade-in zoom-in-95 overflow-hidden">
                            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] mb-6">Briefing Rail</h4>
                            <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                                {notifications.length > 0 ? notifications.map(n => (
                                    <div 
                                        key={n.id} 
                                        onClick={() => dispatch(markNotificationRead(n.id))}
                                        className={`p-4 rounded-3xl cursor-pointer transition-all border ${n.read ? 'bg-transparent border-transparent opacity-40' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-700/50 shadow-sm'}`}
                                    >
                                        <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-relaxed">{n.text}</p>
                                        <span className="text-[9px] font-black text-slate-400 uppercase mt-2 block tracking-widest">{n.time}</span>
                                    </div>
                                )) : (
                                    <div className="py-12 text-center opacity-30">
                                        <i className="fa-solid fa-check-circle text-2xl mb-3 text-emerald-500"></i>
                                        <p className="text-[10px] font-black uppercase tracking-widest">All Clear</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile */}
                <div className="relative" ref={profileRef}>
                    <button 
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="flex items-center space-x-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-4 pr-1 py-1 rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <span className="hidden sm:block text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{user?.name}</span>
                        <img src={user?.avatar} className="h-9 w-9 rounded-xl border-2 border-white dark:border-slate-700" alt="Avatar" />
                    </button>

                    {showProfileMenu && (
                        <div className="absolute right-0 mt-5 w-64 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-4 animate-in fade-in zoom-in-95 overflow-hidden">
                            <div className="px-5 py-4 border-b border-slate-50 dark:border-slate-800 mb-2">
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Authenticated</p>
                                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.email}</p>
                            </div>
                            <div className="space-y-1">
                                <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-5 py-3.5 rounded-2xl text-[11px] font-black text-rose-500 hover:bg-rose-50 transition-colors uppercase tracking-widest">
                                    <i className="fa-solid fa-door-open text-sm"></i>
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
