
import React, { useEffect, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, setAuth, RootState } from './store/store';
import { MOCK_TENANT, MOCK_USER } from './services/mockData';
import Layout from './components/Layout';
import Dashboard from './features/Dashboard';
import Pipeline from './features/Pipeline';
import Automation from './features/Automation';
import Contacts from './features/Contacts';
import Settings from './features/Settings';
import Profile from './features/Profile';
import Inbox from './features/Inbox';

const AppContent: React.FC = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, isDarkMode } = useSelector((state: RootState) => state.auth);
    const [currentRoute, setCurrentRoute] = useState(window.location.hash || '#/');

    useEffect(() => {
        // Mock Session Recovery
        setTimeout(() => {
            dispatch(setAuth({
                user: MOCK_USER,
                tenant: MOCK_TENANT,
                token: 'mock-jwt-token'
            }));
        }, 800);

        const handleHashChange = () => setCurrentRoute(window.location.hash || '#/');
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [dispatch]);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center space-y-10">
                    <div className="flex justify-center">
                        <div className="h-24 w-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center shadow-3xl shadow-blue-600/40 animate-bounce">
                            <i className="fa-solid fa-cube text-4xl text-white"></i>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase">PAK<span className="text-blue-500">CRM</span></h1>
                        <div className="flex flex-col items-center space-y-4">
                            <div className="h-1.5 w-48 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 w-1/2 animate-loading-bar"></div>
                            </div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] animate-pulse">Initializing Neural Workspace...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
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
