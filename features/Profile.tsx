
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, setAuth } from '../store/store';

const Profile: React.FC = () => {
    const dispatch = useDispatch();
    const { user, tenant } = useSelector((state: RootState) => state.auth);
    
    const [profileForm, setProfileForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        bio: `Senior Business Development Associate at ${tenant?.name || 'PakCRM'}. Specializing in localized market outreach and neural lead processing.`,
        signature: `Wassalam,\n${user?.name}\nSales Operations\n${tenant?.name}\nPh: +92 3XX XXXXXXX`,
        workingHoursStart: '09:00',
        workingHoursEnd: '18:00'
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            if (user && tenant) {
                dispatch(setAuth({
                    user: { ...user, name: profileForm.name, email: profileForm.email },
                    tenant: tenant,
                    token: 'persisted-token'
                }));
            }
            setIsSaving(false);
            alert("Profile Identity Synced Successfully");
        }, 800);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-500 pb-20">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
                <div className="relative group">
                    <img src={user?.avatar} className="h-40 w-40 rounded-[4rem] border-8 border-white dark:border-slate-800 shadow-2xl transition-transform group-hover:scale-105" alt="Avatar" />
                    <button className="absolute -bottom-2 -right-2 h-14 w-14 bg-primary-crm text-white rounded-2xl shadow-xl flex items-center justify-center border-4 border-white dark:border-slate-800 hover:scale-110 transition-all">
                        <i className="fa-solid fa-camera text-lg"></i>
                    </button>
                </div>
                <div className="text-center md:text-left space-y-4 flex-1">
                    <div>
                        <h2 className="text-4xl font-black text-slate-950 dark:text-white uppercase tracking-tight">{profileForm.name}</h2>
                        <div className="flex items-center justify-center md:justify-start space-x-3 mt-2">
                            <span className="bg-primary-crm/10 text-primary-crm text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">{user?.role}</span>
                            <p className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">{tenant?.name} HQ Link</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                        <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Regional Access</p>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">Pakistan Hub (GMT+5)</p>
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Status</p>
                            <div className="flex items-center space-x-2">
                                <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">Identity Active</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[3.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-10">
                        <h3 className="text-xl font-black text-slate-950 dark:text-white uppercase tracking-tight flex items-center">
                            <i className="fa-solid fa-id-card-clip mr-4 text-primary-crm"></i> Identity Calibration
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2">Display Name</label>
                                <input 
                                    type="text"
                                    value={profileForm.name}
                                    onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                                    className="w-full bg-slate-50 dark:bg-slate-800 p-5 rounded-3xl text-sm font-bold border-none outline-none ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-primary-crm dark:text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2">Email Identity</label>
                                <input 
                                    type="email"
                                    value={profileForm.email}
                                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                                    className="w-full bg-slate-50 dark:bg-slate-800 p-5 rounded-3xl text-sm font-bold border-none outline-none ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-primary-crm dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2">Professional Bio</label>
                            <textarea 
                                value={profileForm.bio}
                                onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                                className="w-full h-32 bg-slate-50 dark:bg-slate-800 p-5 rounded-[2rem] text-sm font-bold border-none outline-none ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-primary-crm dark:text-white resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2">AI Neural Signature</label>
                            <textarea 
                                value={profileForm.signature}
                                onChange={(e) => setProfileForm({...profileForm, signature: e.target.value})}
                                className="w-full h-40 bg-slate-900 text-emerald-400 p-6 rounded-[2rem] text-xs font-mono border-none outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none shadow-inner"
                            />
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2 ml-4">Note: This signature is appended to all Gemini-generated outreach.</p>
                        </div>

                        <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex justify-end">
                            <button 
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-12 py-5 bg-primary-crm text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center"
                            >
                                {isSaving ? (
                                    <>Syncing Neural Identity <i className="fa-solid fa-spinner fa-spin ml-3"></i></>
                                ) : (
                                    <>Deploy Changes <i className="fa-solid fa-bolt ml-3"></i></>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-10">
                    <div className="bg-slate-950 p-10 rounded-[3.5rem] text-white shadow-2xl space-y-10 border border-white/5">
                        <h4 className="text-[10px] font-black text-primary-crm uppercase tracking-[0.3em]">Agent Performance</h4>
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Outreach Quality</span>
                                    <span className="text-xs font-black">98.2%</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[98%] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">AI Synergy</span>
                                    <span className="text-xs font-black">91%</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary-crm w-[91%] shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
                                </div>
                            </div>
                        </div>
                        <div className="pt-10 border-t border-white/5 grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-3xl font-black">842</p>
                                <p className="text-[9px] font-black text-slate-500 uppercase mt-2 tracking-widest">Deals Won</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black">1.4M</p>
                                <p className="text-[9px] font-black text-slate-500 uppercase mt-2 tracking-widest">Value Gen</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Regional Work Hours</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[8px] font-black text-slate-400 uppercase ml-2">Start</label>
                                <input 
                                    type="time" 
                                    value={profileForm.workingHoursStart}
                                    onChange={(e) => setProfileForm({...profileForm, workingHoursStart: e.target.value})}
                                    className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl text-xs font-bold border-none outline-none dark:text-white" 
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[8px] font-black text-slate-400 uppercase ml-2">End</label>
                                <input 
                                    type="time" 
                                    value={profileForm.workingHoursEnd}
                                    onChange={(e) => setProfileForm({...profileForm, workingHoursEnd: e.target.value})}
                                    className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl text-xs font-bold border-none outline-none dark:text-white" 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
