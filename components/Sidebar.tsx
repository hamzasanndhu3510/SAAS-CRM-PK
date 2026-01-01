
import React from 'react';

interface NavItemProps {
    icon: string;
    isActive?: boolean;
    onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, isActive, onClick }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center justify-center py-4 transition-all duration-300 group border-l-4 relative ${
            isActive 
            ? 'border-blue-600 text-white bg-blue-600/5' 
            : 'border-transparent text-slate-500 hover:text-slate-300'
        }`}
    >
        <i className={`${icon} text-lg ${isActive ? 'scale-110' : ''}`}></i>
        {isActive && (
            <div className="absolute right-0 w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse mr-2"></div>
        )}
    </button>
);

const Sidebar: React.FC = () => {
    const navigate = (path: string) => {
        window.location.hash = path;
    };

    const currentHash = window.location.hash || '#/';

    return (
        <aside className="w-20 bg-slate-950 text-white border-r border-white/5 flex flex-col h-screen overflow-hidden">
            <div className="p-4 flex flex-col items-center justify-center h-16 mb-6">
                <i className="fa-solid fa-cube text-2xl text-primary-crm animate-pulse"></i>
            </div>

            <nav className="flex-1 space-y-2">
                <NavItem icon="fa-solid fa-house" isActive={currentHash === '#/'} onClick={() => navigate('#/')} />
                <NavItem icon="fa-solid fa-envelope" isActive={currentHash === '#/inbox'} onClick={() => navigate('#/inbox')} />
                <NavItem icon="fa-solid fa-hexagon-nodes-alt" isActive={currentHash === '#/pipelines'} onClick={() => navigate('#/pipelines')} />
                <NavItem icon="fa-solid fa-building" isActive={currentHash === '#/contacts'} onClick={() => navigate('#/contacts')} />
                <NavItem icon="fa-solid fa-brain" isActive={currentHash === '#/automations'} onClick={() => navigate('#/automations')} />
                <NavItem icon="fa-solid fa-user" isActive={currentHash === '#/profile'} onClick={() => navigate('#/profile')} />
            </nav>

            <div className="p-4 mt-auto flex flex-col items-center space-y-6 pb-10">
                <button onClick={() => navigate('#/settings')} className="text-slate-600 hover:text-white transition-colors">
                    <i className="fa-solid fa-gear text-lg"></i>
                </button>
                <div className="relative cursor-pointer" onClick={() => navigate('#/profile')}>
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Hamza" className="h-9 w-9 rounded-xl border border-white/10" alt="Avatar" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 border-2 border-slate-950 rounded-full"></span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
