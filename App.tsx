
import React, { useEffect, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, setAuth, RootState } from './store/store';
import Layout from './components/Layout';
import Dashboard from './features/Dashboard';
import Pipeline from './features/Pipeline';
import Automation from './features/Automation';
import Contacts from './features/Contacts';
import Settings from './features/Settings';
import Profile from './features/Profile';
import Inbox from './features/Inbox';

const AuthScreen: React.FC = () => {
    const dispatch = useDispatch();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleAuth = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate authentication
        dispatch(setAuth({
            user: {
                id: 'user-' + Math.random().toString(36).substr(2, 9),
                tenant_id: 'tenant-123',
                name: email.split('@')[0],
                email: email,
                role: 'ADMIN' as any,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
            },
            tenant: {
                id: 'tenant-123',
                name: 'Neural Workspace',
                primary_color: '#2563eb',
                config: { currency: 'PKR', timezone: 'Asia/Karachi' }
            },
            token: 'mock-jwt-token'
        }));
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Visual Flair */}
            <div className="absolute top-0 right-0 h-[600px] w-[600px] bg-primary-crm/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
            <div className="absolute bottom-0 left-0 h-[400px] w-[400px] bg-blue-600/5 rounded-full blur-[100px] -ml-40 -mb-40"></div>

            <div className="max-w-md w-full space-y-12 animate-in fade-in zoom-in-95 duration-700 relative z-10">
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="h-24 w-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.4)] animate-pulse">
                            <i className="fa-solid fa-cube text-5xl text-white"></i>
                        </div>
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tighter uppercase">PAK<span className="text-blue-500">CRM</span></h1>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.6em] ml-2">Enterprise Intelligence Rail</p>
                </div>

                <form onSubmit={handleAuth} className="bg-slate-900/50 backdrop-blur-3xl p-10 rounded-[4rem] border border-white/5 shadow-2xl space-y-8">
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-3">Secure Identity Rail (Email)</label>
                            <input 
                                required
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-800/80 border border-white/5 rounded-[1.5rem] px-7 py-5 text-white text-sm font-bold outline-none focus:ring-2 focus:ring-blue-600 transition-all shadow-inner"
                                placeholder="agent@neural.pk"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-3">Encrypted Cipher</label>
                            <input 
                                required
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-800/80 border border-white/5 rounded-[1.5rem] px-7 py-5 text-white text-sm font-bold outline-none focus:ring-2 focus:ring-blue-600 transition-all shadow-inner"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full py-6 bg-blue-600 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.4em] shadow-xl shadow-blue-600/30 hover:scale-[1.03] active:scale-95 transition-all">
                        {isLogin ? 'Access Workspace Link' : 'Initialize New Identity'}
                    </button>

                    <div className="text-center">
                        <button 
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all underline decoration-slate-800 underline-offset-8"
                        >
                            {isLogin ? "No identity? Deploy Account" : "Identity Verified? Login"}
                        </button>
                    </div>
                </form>
                
                <p className="text-center text-[8px] font-black text-slate-600 uppercase tracking-widest">Localized Regional Security v3.1.2</p>
            </div>
        </div>
    );
};

const AppContent: React.FC = () => {
    const { isAuthenticated, isDarkMode } = useSelector((state: RootState) => state.auth);
    const [currentRoute, setCurrentRoute] = useState(window.location.hash || '#/');

    useEffect(() => {
        const handleHashChange = () => setCurrentRoute(window.location.hash || '#/');
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    useEffect(() => {
        // FIXED Theme Engine: Reactive and applied correctly to document element
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            document.body.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
            document.body.classList.remove('dark');
        }
    }, [isDarkMode]);

    if (!isAuthenticated) {
        return <AuthScreen />;
    }

    const renderRoute = () => {
        switch (currentRoute) {
            case '#/': return <Dashboard />;
            case '#/inbox': return <Inbox />;
            case '#/pipelines': return <Pipeline />;
            case '#/contacts': return <Contacts />;
            case '#/automations': return <Automation />;
            case '#/settings': return <Settings />;
            case '#/profile': return <Profile />;
            default: return <Dashboard />;
        }
    };

    return (
        <Layout>
            {renderRoute()}
            <style>{`
                @keyframes loading-bar {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(300%); }
                }
                .animate-loading-bar {
                    animation: loading-bar 1.5s infinite ease-in-out;
                }
                .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #64748b; border-radius: 10px; }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
                input[type="time"]::-webkit-calendar-picker-indicator {
                    filter: invert(0.5);
                }
                .shadow-inner-lg {
                    box-shadow: inset 0 2px 10px 0 rgba(0, 0, 0, 0.06);
                }
            `}</style>
        </Layout>
    );
};

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <AppContent />
        </Provider>
    );
};

export default App;
