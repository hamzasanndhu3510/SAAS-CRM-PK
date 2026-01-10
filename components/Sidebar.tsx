
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, toggleSidebar } from '../store/store';

interface NavItemProps {
    icon: string;
    label: string;
    isActive?: boolean;
    isExpanded: boolean;
    onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, isExpanded, onClick }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center px-6 py-4 transition-all duration-300 group border-l-4 relative ${
            isActive 
            ? 'border-blue-600 text-white bg-blue-600/5' 
            : 'border-transparent text-slate-500 hover:text-slate-300'
        }`}
    >
        <div className="w-8 flex items-center justify-center shrink-0">
            <i className={`${icon} text-lg ${isActive ? 'scale-110' : ''}`}></i>
        </div>
        <div className={`ml-4 overflow-hidden transition-all duration-500 ${isExpanded ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0'}`}>
            <span className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                {label}
            </span>
        </div>
        {isActive && !isExpanded && (
            <div className="absolute right-0 w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse mr-2"></div>
        )}
    </button>
);

const Sidebar: React.FC = () => {
    const dispatch = useDispatch();
    const { isSidebarExpanded } = useSelector((state: RootState) => state.auth);
    
    const navigate = (path: string) => {
        window.location.hash = path;
    };

    const currentHash = window.location.hash || '#/';

    return (
        <aside 
            className={`${isSidebarExpanded ? 'w-64' : 'w-20'} bg-slate-950 text-white border-r border-white/5 flex flex-col h-screen overflow-hidden transition-all duration-500 ease-in-out`}
            style={{ transitionProperty: 'width' }}
        >
            {/* Header / Brand */}
            <div className="p-4 flex items-center h-20 mb-8 mt-4 overflow-hidden">
                <div className="flex items-center px-2">
                    <div className="shrink-0 w-10 flex justify-center">
                        <i className="fa-solid fa-cube text-3xl text-primary-crm animate-pulse"></i>
                    </div>
                    <div className={`ml-4 transition-all duration-500 overflow-hidden ${isSidebarExpanded ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0'}`}>
                        <span className="text-sm font-black uppercase tracking-tighter whitespace-nowrap">
                            AH <span className="text-primary-crm">CRM</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Navigation Rail */}
            <nav className="flex-1 space-y-1">
                <NavItem icon="fa-solid fa-house" label="Dashboard" isExpanded={isSidebarExpanded} isActive={currentHash === '#/'} onClick={() => navigate('#/')} />
                <NavItem icon="fa-solid fa-envelope" label="Inbox" isExpanded={isSidebarExpanded} isActive={currentHash === '#/inbox'} onClick={() => navigate('#/inbox')} />
                <NavItem icon="fa-solid fa-hexagon-nodes-alt" label="Pipelines" isExpanded={isSidebarExpanded} isActive={currentHash === '#/pipelines'} onClick={() => navigate('#/pipelines')} />
                <NavItem icon="fa-solid fa-building" label="Contacts" isExpanded={isSidebarExpanded} isActive={currentHash === '#/contacts'} onClick={() => navigate('#/contacts')} />
                <NavItem icon="fa-solid fa-brain" label="Automations" isExpanded={isSidebarExpanded} isActive={currentHash === '#/automations'} onClick={() => navigate('#/automations')} />
                <NavItem icon="fa-solid fa-user" label="Identity" isExpanded={isSidebarExpanded} isActive={currentHash === '#/profile'} onClick={() => navigate('#/profile')} />
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 mt-auto flex flex-col space-y-2 pb-8 overflow-hidden">
                <button 
                    onClick={() => navigate('#/settings')} 
                    className={`flex items-center px-6 py-4 text-slate-500 hover:text-white transition-all rounded-xl relative group ${currentHash === '#/settings' ? 'text-white bg-white/5' : ''}`}
                >
                    <div className="w-8 flex items-center justify-center shrink-0">
                        <i className="fa-solid fa-gear text-lg"></i>
                    </div>
                    <div className={`ml-4 overflow-hidden transition-all duration-500 ${isSidebarExpanded ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0'}`}>
                        <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Settings Hub</span>
                    </div>
                </button>

                <button 
                    onClick={() => dispatch(toggleSidebar())}
                    className="flex items-center px-6 py-4 text-slate-500 hover:text-white transition-all group relative"
                >
                    <div 
                        className="w-8 flex items-center justify-center shrink-0 transition-transform duration-500" 
                        style={{ transform: isSidebarExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                        <i className="fa-solid fa-chevron-right text-xs"></i>
                    </div>
                    <div className={`ml-4 overflow-hidden transition-all duration-500 ${isSidebarExpanded ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0'}`}>
                        <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Collapse Rail</span>
                    </div>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
