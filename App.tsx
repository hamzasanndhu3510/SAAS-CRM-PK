
import React, { useEffect, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, setAuth, toggleTheme, RootState, hydrateAuth } from './store/store';
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
        
        const authPayload = {
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
        };

        // Established Persistent Identity Tunnel
        localStorage.setItem('auth_session', JSON.stringify({
            ...authPayload,
            isAuthenticated: true,
            isDarkMode: localStorage.getItem('isDarkMode') === 'true'
        }));
        
        dispatch(setAuth(authPayload));
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-[600px] w-[600px] bg-primary-crm/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
            <div className="absolute bottom-0 left-0 h-[400px] w-[400px] bg-blue-600/5 rounded-full blur-[100px] -ml-40 -mb-40"></div>

            <div className="max-w-md w-full space-y-12 animate-in fade-in zoom-in-95 duration-700 relative z-10">
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="h-24 w-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.4)]">
                            <i className="fa-solid fa-cube text-5xl text-white"></i>
                        </div>
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tighter uppercase">AH <span className="text-blue-500">CRM</span></h1>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.6em] ml-2 leading-none">Persistent Intelligence Link</p>
                </div>

                <form onSubmit={handleAuth} className="bg-slate-900/50 backdrop-blur-3xl p-10 rounded-[4rem] border border-white/5 shadow-2xl space-y-8">
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-3">Identity Email</label>
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
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-3">Cipher Key</label>
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

                    <button type="submit" className="w-full py-6 bg-blue-600 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.4em] shadow-xl hover:scale-[1.03] transition-all">
                        {isLogin ? 'Access Identity Stream' : 'Deploy New identity'}
                    </button>

                    <div className="text-center">
                        <button 
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all underline decoration-slate-800 underline-offset-8"
                        >
                            {isLogin ? "No identity? Establish Link" : "Link Verified? Login"}
                        </button>
                    </div>
                </form>
                <div className="text-center text-[9px] font-black text-slate-700 uppercase tracking-widest">Session Persistence Active v3.1</div>
            </div>
        </div>
    );
};

const AppContent: React.FC = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, isDarkMode } = useSelector((state: RootState) => state.auth);
    const [currentRoute, setCurrentRoute] = useState(window.location.hash || '#/');
    const [isAppReady, setIsAppReady] = useState(false);

    // Initial Identity Session Check (Autologin)
    useEffect(() => {
        const savedSession = localStorage.getItem('auth_session');
        if (savedSession) {
            try {
                const parsed = JSON.parse(savedSession);
                if (parsed.isAuthenticated) {
                    dispatch(hydrateAuth(parsed));
                }
            } catch (e) {
                localStorage.removeItem('auth_session');
            }
        }
        setIsAppReady(true);
    }, [dispatch]);

    // Establish Global Dark Mode Bridge
    useEffect(() => {
        (window as any).toggleDarkMode = () => {
            dispatch(toggleTheme());
        };
    }, [dispatch]);

    useEffect(() => {
        const handleHashChange = () => setCurrentRoute(window.location.hash || '#/');
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            document.body.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
            document.body.classList.remove('dark');
        }
    }, [isDarkMode]);

    if (!isAppReady) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="h-12 w-12 border-4 border-primary-crm border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

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
                .custom-scrollbar::-webkit-scrollbar { height: 0px; width: 0px; }
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
