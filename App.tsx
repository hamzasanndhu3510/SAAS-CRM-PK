
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

const AppContent: React.FC = () => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [currentRoute, setCurrentRoute] = useState(window.location.hash || '#/');

    useEffect(() => {
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

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center space-y-10">
                    <div className="flex justify-center">
                        <div className="h-20 w-20 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-3xl shadow-blue-600/40 animate-bounce">
                            <i className="fa-solid fa-rocket text-4xl text-white"></i>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Pak<span className="text-blue-500">CRM</span></h1>
                        <div className="flex flex-col items-center space-y-2">
                            <div className="h-1 w-32 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 w-1/2 animate-loading-bar"></div>
                            </div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Establishing Secure Session...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const renderRoute = () => {
        switch (currentRoute) {
            case '#/':
            case '':
                return <Dashboard />;
            case '#/pipelines':
                return <Pipeline />;
            case '#/contacts':
                return <Contacts />;
            case '#/automations':
                return <Automation />;
            case '#/settings':
                return <Settings />;
            case '#/profile':
                return <Profile />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <Layout>
            {renderRoute()}
            
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] bg-white/80 backdrop-blur-xl border border-blue-100 px-8 py-4 rounded-[2.5rem] shadow-2xl flex items-center space-x-6">
               <div className="h-3 w-3 rounded-full bg-blue-500 animate-ping"></div>
               <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.15em]">SaaS Identity: {store.getState().auth.user?.name} ({store.getState().auth.user?.role})</span>
            </div>

            <style>{`
                @keyframes loading-bar {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(300%); }
                }
                .animate-loading-bar {
                    animation: loading-bar 1.5s infinite ease-in-out;
                }
                .custom-scrollbar::-webkit-scrollbar { height: 6px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .stage-transition-flash { animation: flash 1s ease-out; }
                @keyframes flash {
                    0% { background-color: var(--primary-crm); opacity: 0.2; }
                    100% { background-color: transparent; opacity: 1; }
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
