
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, updateTenant } from '../store/store';

const Settings: React.FC = () => {
    const dispatch = useDispatch();
    const { tenant, user } = useSelector((state: RootState) => state.auth);
    const [color, setColor] = useState(tenant?.primary_color || '#2563eb');
    const [activeSection, setActiveSection] = useState<'branding' | 'team' | 'integrations'>('branding');

    const handleUpdateBranding = () => {
        dispatch(updateTenant({ primary_color: color }));
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-slate-950 uppercase tracking-tight">Control Tower</h2>
                    <p className="text-slate-500 text-sm font-medium">Enterprise configurations for {tenant?.name}</p>
                </div>
                <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                    {(['branding', 'team', 'integrations'] as const).map(section => (
                        <button
                            key={section}
                            onClick={() => setActiveSection(section)}
                            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                activeSection === section ? 'bg-white text-primary-crm shadow-sm' : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            {section}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {activeSection === 'branding' && (
                    <div className="lg:col-span-7 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8 animate-in fade-in slide-in-from-left-4">
                        <h3 className="text-lg font-black uppercase tracking-tight flex items-center">
                            <i className="fa-solid fa-palette mr-3 text-primary-crm"></i> White-Label Engine
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Primary Identity Color</label>
                                    <div className="flex items-center space-x-4 bg-slate-50 p-3 rounded-2xl ring-1 ring-slate-100">
                                        <input 
                                            type="color" 
                                            value={color} 
                                            onChange={(e) => setColor(e.target.value)}
                                            className="h-10 w-10 rounded-xl border-none cursor-pointer p-0 bg-transparent"
                                        />
                                        <input 
                                            type="text" 
                                            value={color.toUpperCase()} 
                                            onChange={(e) => setColor(e.target.value)}
                                            className="bg-transparent text-xs font-black font-mono border-none focus:ring-0 outline-none w-24"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Workspace Brand Logo</label>
                                    <input 
                                        placeholder="Secure S3 URL or Public Domain" 
                                        className="w-full bg-slate-50 p-4 rounded-xl text-sm font-bold border-none outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-primary-crm"
                                        onChange={(e) => dispatch(updateTenant({ logo_url: e.target.value }))}
                                    />
                                </div>
                                <button 
                                    onClick={handleUpdateBranding}
                                    className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02] active:scale-95"
                                >
                                    Deploy Branding Globally
                                </button>
                            </div>
                            <div className="bg-slate-50 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center space-y-4 border border-slate-100">
                                <div className="h-20 w-20 rounded-3xl bg-white shadow-xl flex items-center justify-center" style={{ border: `4px solid ${color}` }}>
                                    <i className="fa-solid fa-rocket text-3xl" style={{ color: color }}></i>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Preview UI Card</p>
                                    <p className="text-xs font-bold text-slate-600 mt-1">Logo + Identity Sync</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'team' && (
                    <div className="lg:col-span-12 space-y-8 animate-in fade-in slide-in-from-right-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-black uppercase tracking-tight flex items-center">
                                <i className="fa-solid fa-users-gear mr-3 text-primary-crm"></i> Team Access Control (RBAC)
                            </h3>
                            <button className="bg-primary-crm text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                Invite Employee
                            </button>
                        </div>
                        
                        <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Profile</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role Scoping</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity Status</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Control</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    <tr className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center space-x-3">
                                                <img src={user?.avatar} className="h-10 w-10 rounded-xl" />
                                                <div>
                                                    <p className="text-sm font-black text-slate-900">{user?.name} (You)</p>
                                                    <p className="text-[10px] text-slate-400 font-bold">{user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="bg-blue-50 text-blue-600 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100">
                                                Super Administrator
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center space-x-2 text-emerald-500">
                                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                                <span className="text-[10px] font-black uppercase">Active HQ</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right font-black text-[10px] text-slate-400 uppercase">System Root</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/50 transition-colors opacity-60 grayscale">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-10 w-10 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 font-black">?</div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-400 italic">No Employees Yet</p>
                                                    <p className="text-[10px] text-slate-300 font-bold uppercase">Awaiting Invitation</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td colSpan={3}></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeSection === 'integrations' && (
                    <div className="lg:col-span-6 space-y-8 animate-in fade-in slide-in-from-bottom-4">
                        <section className="bg-slate-950 text-white p-10 rounded-[3rem] shadow-2xl space-y-8">
                            <h3 className="text-lg font-black uppercase tracking-tight flex items-center">
                                <i className="fa-solid fa-plug mr-3 text-primary-crm"></i> Provisioned Modules
                            </h3>
                            <div className="space-y-4">
                                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl flex justify-between items-center group hover:bg-white/10 transition-all cursor-pointer">
                                    <div className="flex items-center space-x-4">
                                        <div className="h-12 w-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center">
                                            <i className="fa-brands fa-whatsapp text-2xl"></i>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-black uppercase tracking-widest text-white">WhatsApp Business API</h4>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Provider: ZenSend • High Throughput</p>
                                        </div>
                                    </div>
                                    <div className="h-8 w-8 bg-white/10 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-primary-crm transition-all">
                                        <i className="fa-solid fa-gear"></i>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;
