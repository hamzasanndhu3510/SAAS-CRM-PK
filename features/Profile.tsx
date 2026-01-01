
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const Profile: React.FC = () => {
    const { user, tenant } = useSelector((state: RootState) => state.auth);

    return (
        <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-500 pb-20">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
                <div className="relative group">
                    <img src={user?.avatar} className="h-32 w-32 rounded-[3.5rem] border-4 border-white dark:border-slate-800 shadow-2xl transition-transform group-hover:scale-105" alt="Avatar" />
                    <button className="absolute -bottom-2 -right-2 h-12 w-12 bg-primary-crm text-white rounded-2xl shadow-xl flex items-center justify-center border-2 border-white dark:border-slate-800">
                        <i className="fa-solid fa-camera"></i>
                    </button>
                </div>
                <div className="text-center md:text-left space-y-4">
                    <div>
                        <h2 className="text-4xl font-black text-slate-950 dark:text-white uppercase tracking-tight">{user?.name}</h2>
                        <div className="flex items-center justify-center md:justify-start space-x-3 mt-2">
                            <span className="bg-primary-crm/10 text-primary-crm text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">{user?.role}</span>
                            <p className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">{tenant?.name} Headquarters</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-10">
                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-10">
                        <h3 className="text-xl font-black text-slate-950 dark:text-white uppercase tracking-tight">Agent Bio & Signature</h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Neural Signature (Used for AI Outreach)</label>
                                <textarea 
                                    className="w-full h-32 bg-slate-50 dark:bg-slate-800 p-5 rounded-[2rem] text-sm font-bold border-none outline-none ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-primary-crm dark:text-white resize-none"
                                    defaultValue={`Regards,\n${user?.name}\nSenior Business Development Associate\n${tenant?.name}`}
                                />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Work Hours Start</label>
                                    <input type="time" defaultValue="09:00" className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-sm font-bold border-none outline-none ring-1 ring-slate-100 dark:ring-slate-700 dark:text-white" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Work Hours End</label>
                                    <input type="time" defaultValue="18:00" className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-sm font-bold border-none outline-none ring-1 ring-slate-100 dark:ring-slate-700 dark:text-white" />
                                </div>
                            </div>
                            <button className="px-10 py-5 bg-slate-950 dark:bg-primary-crm text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl transition-all hover:scale-[1.02]">Update Agent Identity</button>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-10">
                    <div className="bg-slate-950 p-10 rounded-[3.5rem] text-white shadow-2xl space-y-10">
                        <h4 className="text-[10px] font-black text-primary-crm uppercase tracking-[0.3em]">Neural Efficiency</h4>
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[9px] font-black uppercase text-slate-500">Response Velocity</span>
                                    <span className="text-xs font-black">94%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[94%]"></div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[9px] font-black uppercase text-slate-500">AI Collaboration</span>
                                    <span className="text-xs font-black">88%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary-crm w-[88%]"></div>
                                </div>
                            </div>
                        </div>
                        <div className="pt-10 border-t border-white/5 grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-2xl font-black">12.4k</p>
                                <p className="text-[9px] font-black text-slate-500 uppercase mt-1">Processed</p>
                            </div>
                            <div>
                                <p className="text-2xl font-black">450</p>
                                <p className="text-[9px] font-black text-slate-500 uppercase mt-1">Converted</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
