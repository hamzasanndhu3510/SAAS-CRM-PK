
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, markNotificationRead } from '../store/store';
import { AutomationTrigger } from '../types';

const INITIAL_TRIGGERS: AutomationTrigger[] = [
    // 1. Lead & Prospect Intelligence
    { id: 'intel-1', name: 'Neural Qualification Auditor', description: 'Analyzes BANT criteria in initial messages to auto-tag leads as Hot/Cold.', icon: 'fa-solid fa-brain', type: 'sentiment', is_active: true, color: 'blue' },
    { id: 'intel-2', name: 'Competitor Mention Sentinel', description: 'Alerts sales if rivals are mentioned and provides a Battle Card summary.', icon: 'fa-solid fa-shield-halved', type: 'logic', is_active: true, color: 'rose' },
    { id: 'intel-3', name: 'LinkedIn Profile Enricher', description: 'Scrapes public data on business email entry to populate Lead Persona.', icon: 'fa-brands fa-linkedin', type: 'logic', is_active: false, color: 'blue' },
    { id: 'intel-4', name: 'Urdu Audio-to-Intent Mapper', description: 'Transcribes voice notes and extracts next steps using Neural Audio API.', icon: 'fa-solid fa-microphone-lines', type: 'logic', is_active: true, color: 'amber' },

    // 2. Localized Financial Operations
    { id: 'fin-1', name: 'Bank SMS Reconciliation', description: 'Parses incoming SMS from local banks to match payments with Lead IDs.', icon: 'fa-solid fa-comment-dollar', type: 'logic', is_active: true, color: 'emerald' },
    { id: 'fin-2', name: 'JazzCash/EasyPaisa Fraud Guard', description: 'Uses Vision AI to detect tampered or photoshopped transaction receipts.', icon: 'fa-solid fa-eye', type: 'vision', is_active: true, color: 'rose' },
    { id: 'fin-3', name: 'Zakat-Compliant Invoicer', description: 'Calculates professional service adjustments during specific fiscal months.', icon: 'fa-solid fa-kaaba', type: 'logic', is_active: false, color: 'emerald' },
    { id: 'fin-4', name: 'Dynamic WhatsApp Invoicing', description: 'Auto-generates and sends PDF invoices when deals hit "Qualified" stage.', icon: 'fa-brands fa-whatsapp', type: 'logic', is_active: true, color: 'emerald' },

    // 3. Autonomous Communication
    { id: 'comm-1', name: 'Roman Urdu Nurture', description: 'Follows up with stale leads using casual Roman Urdu after 24h silence.', icon: 'fa-solid fa-ghost', type: 'time', is_active: true, color: 'blue' },
    { id: 'comm-2', name: 'Time-Zone Global Ping', description: 'Ensures outreach only occurs during leads regional working hours.', icon: 'fa-solid fa-clock-rotate-left', type: 'time', is_active: true, color: 'amber' },
    { id: 'comm-3', name: 'WhatsApp Thread Summarizer', description: 'Daily summary of long threads pushed directly into Lead History notes.', icon: 'fa-solid fa-list-check', type: 'sentiment', is_active: true, color: 'blue' },
    { id: 'comm-4', name: 'Meeting No-Show Recovery', description: 'Sends re-schedule link via SMS instantly if a meeting is missed.', icon: 'fa-solid fa-calendar-xmark', type: 'time', is_active: false, color: 'rose' },

    // 4. Operational Excellence
    { id: 'ops-1', name: 'Agent Burnout Monitor', description: 'Auto-redistributes leads if an agent exceeds 50 active chat threads.', icon: 'fa-solid fa-heart-pulse', type: 'logic', is_active: true, color: 'rose' },
    { id: 'ops-2', name: 'High-Value Deal War Room', description: 'Creates dedicated Slack channel for deals exceeding PKR 5M value.', icon: 'fa-solid fa-hand-holding-dollar', type: 'logic', is_active: true, color: 'amber' },
    { id: 'ops-3', name: 'Churn Probability Sentinel', description: 'Alerts manager if sentiment trends negative over multiple interactions.', icon: 'fa-solid fa-triangle-exclamation', type: 'sentiment', is_active: true, color: 'rose' },
    { id: 'ops-4', name: 'Identity Sync Auditor', description: 'Periodically verifies email and phone across external databases.', icon: 'fa-solid fa-fingerprint', type: 'logic', is_active: false, color: 'blue' }
];

const Automation: React.FC = () => {
    const { tenant } = useSelector((state: RootState) => state.auth);
    const [triggers, setTriggers] = useState(INITIAL_TRIGGERS);
    const [activeLogs, setActiveLogs] = useState<{ id: string; msg: string; time: string }[]>([]);

    const toggleTrigger = (id: string) => {
        setTriggers(prev => prev.map(t => {
            if (t.id === id) {
                const newState = !t.is_active;
                if (newState) {
                    addLog(`Trigger "${t.name}" initialized and synced to live stream.`);
                }
                return { ...t, is_active: newState };
            }
            return t;
        }));
    };

    const addLog = (msg: string) => {
        const newLog = { 
            id: Math.random().toString(36).substr(2, 9), 
            msg, 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) 
        };
        setActiveLogs(prev => [newLog, ...prev].slice(0, 5));
    };

    const getColorClasses = (color: string, active: boolean) => {
        if (!active) return 'bg-slate-100 border-slate-200 text-slate-400 opacity-60';
        switch(color) {
            case 'emerald': return 'bg-emerald-50 border-emerald-200 text-emerald-600 shadow-emerald-500/10';
            case 'blue': return 'bg-blue-50 border-blue-200 text-blue-600 shadow-blue-500/10';
            case 'rose': return 'bg-rose-50 border-rose-200 text-rose-600 shadow-rose-500/10';
            case 'amber': return 'bg-amber-50 border-amber-200 text-amber-600 shadow-amber-500/10';
            default: return 'bg-slate-50 border-slate-200 text-slate-600';
        }
    };

    const getIconBg = (color: string, active: boolean) => {
        if (!active) return 'bg-slate-200 text-slate-400';
        switch(color) {
            case 'emerald': return 'bg-emerald-600 text-white';
            case 'blue': return 'bg-blue-600 text-white';
            case 'rose': return 'bg-rose-600 text-white';
            case 'amber': return 'bg-amber-600 text-white';
            default: return 'bg-slate-900 text-white';
        }
    }

    const categories = [
        { title: 'Intelligence & Scoping', prefix: 'intel' },
        { title: 'Financial Operations', prefix: 'fin' },
        { title: 'Autonomous Outreach', prefix: 'comm' },
        { title: 'Operational Guardrails', prefix: 'ops' }
    ];

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-950 dark:text-white uppercase tracking-tighter">Neural Logic <span className="text-primary-crm">Factory</span></h2>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em] mt-1">Autonomous Business Intelligence Engine • {tenant?.name}</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <button className="flex-1 md:flex-none h-14 px-8 bg-slate-950 dark:bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center hover:scale-105 transition-all">
                        <i className="fa-solid fa-code-merge mr-3"></i> System Schema
                    </button>
                    <button className="flex-1 md:flex-none h-14 px-10 bg-primary-crm text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-primary-crm/20 hover:scale-105 transition-all">
                        New Blueprint
                    </button>
                </div>
            </div>

            {categories.map((cat, catIdx) => (
                <div key={catIdx} className="space-y-8 animate-in slide-in-from-bottom-6" style={{ animationDelay: `${catIdx * 100}ms` }}>
                    <div className="flex items-center space-x-4">
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] whitespace-nowrap">{cat.title}</h3>
                        <div className="h-px w-full bg-slate-200 dark:bg-slate-800"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {triggers.filter(t => t.id.startsWith(cat.prefix)).map(trigger => (
                            <div 
                                key={trigger.id} 
                                className={`p-8 rounded-[2.8rem] border-2 transition-all duration-500 group flex flex-col h-full bg-white dark:bg-slate-900 relative overflow-hidden ${trigger.is_active ? 'border-primary-crm/5 shadow-xl shadow-primary-crm/5' : 'border-slate-100 dark:border-slate-800 opacity-60'}`}
                            >
                                <div className="flex justify-between items-start mb-8 relative z-10">
                                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all ${getIconBg(trigger.color, trigger.is_active)} group-hover:scale-110 shadow-lg group-hover:rotate-6`}>
                                        <i className={`${trigger.icon} text-xl`}></i>
                                    </div>
                                    <div 
                                        onClick={() => toggleTrigger(trigger.id)}
                                        className={`relative inline-block w-14 h-7 align-middle select-none transition duration-500 ease-in cursor-pointer rounded-full p-1 ${trigger.is_active ? 'bg-primary-crm shadow-lg shadow-primary-crm/20' : 'bg-slate-200 dark:bg-slate-800'}`}
                                    >
                                        <div className={`bg-white w-5 h-5 rounded-full shadow-md transition-transform duration-500 transform ${trigger.is_active ? 'translate-x-7' : 'translate-x-0'}`}></div>
                                    </div>
                                </div>
                                
                                <div className="flex-1 relative z-10">
                                    <h3 className="text-[15px] font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight mb-3 group-hover:text-primary-crm transition-colors">{trigger.name}</h3>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed mb-8">{trigger.description}</p>
                                </div>
                                
                                <div className="mt-auto pt-6 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center relative z-10">
                                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg transition-all ${getColorClasses(trigger.color, trigger.is_active)}`}>
                                        {trigger.is_active ? 'Neural Link Active' : 'Paused'}
                                    </span>
                                    <button 
                                        onClick={() => addLog(`Diagnostic run: ${trigger.name} performed health check.`)}
                                        className="h-8 w-8 text-slate-300 hover:text-primary-crm transition-colors rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center"
                                    >
                                        <i className="fa-solid fa-play text-[10px]"></i>
                                    </button>
                                </div>

                                {trigger.is_active && (
                                    <div className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none group-hover:scale-125 duration-700">
                                        <i className={`${trigger.icon} text-[10rem]`}></i>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Neural Log Terminal Overlay */}
            <div className="fixed bottom-0 left-0 lg:left-[var(--sidebar-width,80px)] right-0 bg-slate-950/80 backdrop-blur-xl border-t border-white/5 p-6 z-[100] animate-in slide-in-from-bottom-full duration-500">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-6 overflow-hidden">
                        <div className="flex items-center space-x-2 shrink-0">
                            <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Live Feed:</span>
                        </div>
                        <div className="flex space-x-6 overflow-hidden">
                            {activeLogs.length > 0 ? activeLogs.map(log => (
                                <div key={log.id} className="flex items-center space-x-3 whitespace-nowrap animate-in fade-in slide-in-from-right-4">
                                    <span className="text-[9px] font-mono text-emerald-500/60">[{log.time}]</span>
                                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{log.msg}</span>
                                </div>
                            )) : (
                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] italic">Awaiting neural events...</span>
                            )}
                        </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-4 shrink-0 pl-10">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Core Status:</span>
                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-emerald-400 uppercase tracking-widest">Optimized</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Automation;
