
import React from 'react';

interface NavItemProps {
    icon: string;
    isActive?: boolean;
    onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, isActive, onClick }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center justify-center py-5 transition-all duration-300 group border-l-4 relative ${
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
            <div className="p-4 flex flex-col items-center justify-center h-20 mb-8 mt-4">
                <i className="fa-solid fa-cube text-3xl text-primary-crm animate-pulse"></i>
            </div>

            <nav className="flex-1 space-y-2">
                <NavItem icon="fa-solid fa-house" isActive={currentHash === '#/'} onClick={() => navigate('#/')} />
                <NavItem icon="fa-solid fa-envelope" isActive={currentHash === '#/inbox'} onClick={() => navigate('#/inbox')} />
                <NavItem icon="fa-solid fa-hexagon-nodes-alt" isActive={currentHash === '#/pipelines'} onClick={() => navigate('#/pipelines')} />
                <NavItem icon="fa-solid fa-building" isActive={currentHash === '#/contacts'} onClick={() => navigate('#/contacts')} />
                <NavItem icon="fa-solid fa-brain" isActive={currentHash === '#/automations'} onClick={() => navigate('#/automations')} />
            </nav>

            <div className="p-4 mt-auto flex flex-col items-center space-y-6 pb-12 opacity-20 hover:opacity-100 transition-opacity">
                {/* Cleaned up bottom area per request */}
                <div className="h-1 w-8 bg-slate-800 rounded-full"></div>
            </div>
        </aside>
    );
};

export default Sidebar;
