
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, setAuth } from '../store/store';

const Profile: React.FC = () => {
    const { user, tenant } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();

    const [activeTab, setActiveTab] = useState<'info' | 'security' | 'sessions'>('info');

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center space-x-6">
                <div className="relative">
                    <img src={user?.avatar} className="h-24 w-24 rounded-[2.5rem] border-4 border-white shadow-2xl ring-2 ring-primary-crm/20" alt="Avatar" />
                    <button className="absolute -bottom-2 -right-2 h-10 w-10 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center text-primary-crm hover:scale-110 transition-transform">
                        <i className="fa-solid fa-camera"></i>
                    </button>
                </div>
                <div>
                    <h2 className="text-3xl font-black text-slate-950 uppercase tracking-tight leading-none">{user?.name}</h2>
                    <p className="text-slate-400 font-bold text-xs mt-2 uppercase tracking-widest flex items-center">
                        <i className="fa-solid fa-shield-halved mr-2 text-primary-crm"></i>
                        {user?.role} • {tenant?.name}
                    </p>
                </div>
            </div>

            <div className="flex space-x-2 bg-slate-100 p-1.5 rounded-[1.5rem] w-fit">
                {(['info', 'security', 'sessions'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            activeTab === tab ? 'bg-white text-primary-crm shadow-sm' : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    {activeTab === 'info' && (
                        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                            <h3 className="text-lg font-black uppercase tracking-tight">Personal Identity</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Full Legal Name</label>
                                    <input defaultValue={user?.name} className="w-full bg-slate-50 p-4 rounded-xl text-sm font-bold border-none outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-primary-crm transition-all" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Professional Email</label>
                                    <input defaultValue={user?.email} className="w-full bg-slate-50 p-4 rounded-xl text-sm font-bold border-none outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-primary-crm transition-all" />
                                </div>
                            </div>
                            <button className="bg-primary-crm text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all hover:brightness-110 active:scale-95">
                                Update Credentials
                            </button>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                            <h3 className="text-lg font-black uppercase tracking-tight">Cyber Security</h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Current Access Token</label>
                                    <div className="flex items-center space-x-3 bg-slate-50 p-4 rounded-xl font-mono text-xs text-slate-500 overflow-hidden">
                                        <i className="fa-solid fa-key text-primary-crm"></i>
                                        <span className="truncate">***************************</span>
                                        <button className="text-primary-crm hover:text-primary-crm/80 ml-auto">Reveal</button>
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <button className="w-full py-4 border-2 border-dashed border-rose-200 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all">
                                        Rotate Master Credentials
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'sessions' && (
                        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
                            <h3 className="text-lg font-black uppercase tracking-tight">Active Sessions</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center space-x-4">
                                        <div className="h-10 w-10 bg-primary-crm/10 text-primary-crm rounded-xl flex items-center justify-center">
                                            <i className="fa-solid fa-desktop"></i>
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase">Current Browser (Chrome)</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Lahore, Pakistan • Active Now</p>
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full uppercase">Secure</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-8">
                    <div className="bg-slate-950 text-white p-8 rounded-[2.5rem] shadow-2xl space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-widest text-primary-crm">Workspace Stats</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Total Deals Managed</span>
                                <span className="text-xl font-black">124</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Response Score</span>
                                <span className="text-xl font-black text-emerald-400">98%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">System Uptime</span>
                                <span className="text-xl font-black">100%</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-rose-50 rounded-[2.5rem] border border-rose-100">
                        <h4 className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-4">Danger Zone</h4>
                        <button className="w-full py-4 bg-white border border-rose-200 text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                            Deactivate Identity
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
