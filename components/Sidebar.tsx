
import React from 'react';

interface NavItemProps {
    icon: string;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
            isActive 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
            : 'text-slate-400 hover:bg-white/5 hover:text-white'
        }`}
    >
        <i className={`${icon} ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} transition-colors`}></i>
        <span className="font-medium text-sm">{label}</span>
    </button>
);

const Sidebar: React.FC = () => {
    return (
        <aside className="w-64 bg-slate-950 text-white border-r border-slate-800 hidden lg:flex flex-col h-screen sticky top-0">
            <div className="p-6">
                <div className="flex items-center space-x-2">
                    <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                        <i className="fa-solid fa-rocket text-white"></i>
                    </div>
                    <span className="text-xl font-black text-white tracking-tight">Pak<span className="text-blue-500">CRM</span></span>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                <NavItem icon="fa-solid fa-chart-line" label="Dashboard" isActive={window.location.hash === '#/' || window.location.hash === ''} onClick={() => window.location.hash = '#/'} />
                <NavItem icon="fa-solid fa-address-book" label="Contacts" isActive={window.location.hash === '#/contacts'} onClick={() => window.location.hash = '#/contacts'} />
                <NavItem icon="fa-solid fa-columns-three" label="Pipelines" isActive={window.location.hash === '#/pipelines'} onClick={() => window.location.hash = '#/pipelines'} />
                <NavItem icon="fa-solid fa-comment-dots" label="Inbox" isActive={window.location.hash === '#/inbox'} onClick={() => window.location.hash = '#/inbox'} />
                <NavItem icon="fa-solid fa-bolt" label="Automations" isActive={window.location.hash === '#/automations'} onClick={() => window.location.hash = '#/automations'} />
                
                <div className="pt-8 pb-4">
                    <span className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Finance</span>
                </div>
                <NavItem icon="fa-solid fa-wallet" label="Payments" isActive={window.location.hash === '#/payments'} onClick={() => window.location.hash = '#/payments'} />
                <NavItem icon="fa-solid fa-file-invoice" label="Reports" isActive={window.location.hash === '#/reports'} onClick={() => window.location.hash = '#/reports'} />
                
                <div className="pt-8 pb-4">
                    <span className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">System</span>
                </div>
                <NavItem icon="fa-solid fa-gear" label="Settings" isActive={window.location.hash === '#/settings'} onClick={() => window.location.hash = '#/settings'} />
            </nav>

            <div className="p-4 border-t border-slate-900">
                <div className="bg-slate-900 rounded-xl p-4 flex items-center justify-between border border-slate-800">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Current Tier</span>
                        <span className="text-xs font-bold text-blue-400">Enterprise Plus</span>
                    </div>
                    <button className="h-8 w-8 hover:bg-slate-800 rounded-lg transition-colors text-slate-500 flex items-center justify-center">
                        <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
