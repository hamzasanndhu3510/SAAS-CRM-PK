
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, updateTenant } from '../store/store';

const Settings: React.FC = () => {
    const dispatch = useDispatch();
    const { tenant } = useSelector((state: RootState) => state.auth);
    const [color, setColor] = useState(tenant?.primary_color || '#2563eb');
    const [activeTab, setActiveTab] = useState<'branding' | 'security' | 'integrations' | 'logs'>('branding');

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-950 dark:text-white uppercase tracking-tight">Workspace v3.1</h2>
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Core Engine Controls</p>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl w-full sm:w-auto overflow-x-auto">
                    {(['branding', 'security', 'integrations', 'logs'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                                activeTab === tab ? 'bg-white dark:bg-slate-800 text-primary-crm shadow-sm dark:text-white' : 'text-slate-400 dark:text-slate-500'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[3.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                    {activeTab === 'branding' && (
                        <div className="space-y-10">
                            <h3 className="text-lg font-black uppercase tracking-tight flex items-center dark:text-white">
                                <i className="fa-solid fa-palette mr-4 text-primary-crm"></i> Identity System
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Primary Visual Color</label>
                                        <div className="flex items-center space-x-4 bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl ring-1 ring-slate-100 dark:ring-slate-700">
                                            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-10 rounded-xl border-none cursor-pointer bg-transparent" />
                                            <input type="text" value={color.toUpperCase()} className="bg-transparent text-xs font-black font-mono dark:text-white w-24 border-none focus:ring-0" readOnly />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Regional Currency</label>
                                        <select className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-sm font-bold border-none outline-none ring-1 ring-slate-100 dark:ring-slate-700 dark:text-white">
                                            <option>PKR (Rs.)</option>
                                            <option>USD ($)</option>
                                            <option>AED (Dirham)</option>
                                        </select>
                                    </div>
                                    <button onClick={() => dispatch(updateTenant({ primary_color: color }))} className="w-full py-4 bg-slate-950 dark:bg-primary-crm text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">Deploy Overrides</button>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center border border-dashed border-slate-200 dark:border-slate-700">
                                    <div className="h-20 w-20 rounded-[2rem] bg-white dark:bg-slate-900 shadow-2xl flex items-center justify-center mb-6" style={{ border: `4px solid ${color}` }}>
                                        <i className="fa-solid fa-rocket text-2xl" style={{ color: color }}></i>
                                    </div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Portal Preview</p>
                                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-2">Active Branding Engine</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'logs' && (
                        <div className="space-y-8">
                            <h3 className="text-lg font-black uppercase tracking-tight dark:text-white">Neural Audit Trail</h3>
                            <div className="space-y-4">
                                {[
                                    { event: 'Bulk CSV Processed', user: 'Hamza', time: '10m ago', status: 'success' },
                                    { event: 'Identity Color Rotation', user: 'System', time: '1h ago', status: 'success' },
                                    { event: 'API Key Access', user: 'Hamza', time: '5h ago', status: 'warning' }
                                ].map((log, i) => (
                                    <div key={i} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
                                        <div className="flex items-center space-x-4">
                                            <div className={`h-2 w-2 rounded-full ${log.status === 'success' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                            <div>
                                                <p className="text-xs font-black text-slate-900 dark:text-white uppercase">{log.event}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">By {log.user} • {log.time}</p>
                                            </div>
                                        </div>
                                        <i className="fa-solid fa-chevron-right text-[10px] text-slate-300"></i>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-slate-950 text-white p-10 rounded-[3rem] shadow-2xl space-y-8 border border-white/5">
                        <h4 className="text-[10px] font-black text-primary-crm uppercase tracking-widest">SaaS Subscription</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                <span className="text-[10px] text-slate-500 font-bold uppercase">Plan</span>
                                <span className="text-sm font-black uppercase">Enterprise v3</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                <span className="text-[10px] text-slate-500 font-bold uppercase">AI Tokens</span>
                                <span className="text-sm font-black">UNLIMITED</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-slate-500 font-bold uppercase">Next Payout</span>
                                <span className="text-sm font-black">Oct 12, 24</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-8 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Modules</h4>
                        <div className="space-y-3">
                            {['WhatsApp Bridge', 'Gemini Neural', 'Bulk Processor'].map(m => (
                                <div key={m} className="flex items-center space-x-3 text-emerald-500">
                                    <i className="fa-solid fa-circle-check text-[10px]"></i>
                                    <span className="text-[10px] font-black uppercase tracking-tight">{m}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
