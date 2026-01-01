
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { AutomationTrigger } from '../types';

const INITIAL_TRIGGERS: AutomationTrigger[] = [
    {
        id: 'trig-1',
        name: 'Vision Payment Auditor',
        description: 'Instantly verifies JazzCash & EasyPaisa screenshots to auto-move deals to "Paid".',
        icon: 'fa-solid fa-camera-retro',
        type: 'vision',
        is_active: true,
        color: 'emerald'
    },
    {
        id: 'trig-2',
        name: 'Bilingual Re-activator',
        description: 'Nudges stale leads in Roman Urdu mix after 48h of silence.',
        icon: 'fa-solid fa-ghost',
        type: 'time',
        is_active: true,
        color: 'blue'
    },
    {
        id: 'trig-3',
        name: 'Sentiment Priority Engine',
        description: 'Detects frustration or high-intent keywords to alert senior management.',
        icon: 'fa-solid fa-fire-flame-curved',
        type: 'sentiment',
        is_active: false,
        color: 'rose'
    },
    {
        id: 'trig-4',
        name: 'Lead Persona Sorter',
        description: 'Auto-tags leads as "Enterprise" or "Individual" based on first inquiry text.',
        icon: 'fa-solid fa-filter',
        type: 'logic',
        is_active: true,
        color: 'amber'
    }
];

const Automation: React.FC = () => {
  const { tenant } = useSelector((state: RootState) => state.auth);
  const [triggers, setTriggers] = useState(INITIAL_TRIGGERS);

  const toggleTrigger = (id: string) => {
    setTriggers(triggers.map(t => t.id === id ? { ...t, is_active: !t.is_active } : t));
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

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-950 uppercase tracking-tight">Neural logic factory</h2>
            <p className="text-slate-500 font-medium text-sm">Autonomous intelligence for {tenant?.name}</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
             <button className="flex-1 md:flex-none bg-slate-900 text-white px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 transition-all hover:bg-slate-800">
                <i className="fa-solid fa-code mr-2"></i> Logic Logs
             </button>
             <button className="flex-1 md:flex-none bg-primary-crm text-white px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary-crm/20 transition-all hover:scale-105">
                <i className="fa-solid fa-brain mr-2"></i> New Trigger
             </button>
          </div>
       </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {triggers.map(trigger => (
              <div 
                key={trigger.id} 
                className={`p-6 md:p-8 rounded-[2.5rem] border transition-all duration-300 group flex flex-col h-full bg-white shadow-sm ${trigger.is_active ? 'border-primary-crm/10' : 'border-slate-100 grayscale opacity-60'}`}
              >
                  <div className="flex justify-between items-start mb-6">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all ${getIconBg(trigger.color, trigger.is_active)} group-hover:scale-110 shadow-lg`}>
                          <i className={`${trigger.icon} text-lg`}></i>
                      </div>
                      <div className="flex items-center">
                         <div 
                            onClick={() => toggleTrigger(trigger.id)}
                            className={`relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in cursor-pointer rounded-full p-1 ${trigger.is_active ? 'bg-primary-crm' : 'bg-slate-200'}`}
                         >
                            <div className={`bg-white w-4 h-4 rounded-full transition-transform transform ${trigger.is_active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                         </div>
                      </div>
                  </div>
                  
                  <h3 className="text-base font-black text-slate-900 uppercase tracking-tight leading-tight mb-3">{trigger.name}</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">{trigger.description}</p>
                  
                  <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${getColorClasses(trigger.color, trigger.is_active)}`}>
                        {trigger.is_active ? 'Activated' : 'Paused'}
                    </span>
                    <button className="text-slate-400 hover:text-primary-crm transition-colors">
                        <i className="fa-solid fa-sliders text-sm"></i>
                    </button>
                  </div>
              </div>
          ))}

          {/* New Trigger Placeholder */}
          <button className="border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-slate-400 hover:border-primary-crm hover:text-primary-crm hover:bg-slate-50 transition-all group min-h-[300px]">
             <div className="h-16 w-16 rounded-[1.5rem] bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-primary-crm/10 group-hover:scale-110 transition-all">
                <i className="fa-solid fa-plus-circle text-2xl"></i>
             </div>
             <span className="font-black text-[10px] uppercase tracking-[0.2em]">Add Neural Cell</span>
          </button>
       </div>

       {/* Advanced Logic View */}
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-slate-950 text-white rounded-[3rem] p-8 md:p-12 overflow-hidden relative shadow-2xl shadow-primary-crm/10 border border-white/5">
                <div className="absolute -top-20 -right-20 p-12 opacity-5 pointer-events-none">
                    <i className="fa-solid fa-code-branch text-[20rem] rotate-45"></i>
                </div>
                <div className="max-w-2xl relative z-10">
                    <div className="flex items-center space-x-4 mb-6">
                        <span className="bg-primary-crm text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center">
                            <i className="fa-solid fa-microchip mr-2 animate-pulse"></i>
                            Gemini Neural v3.1
                        </span>
                    </div>
                    <h3 className="text-2xl md:text-4xl font-black mb-6 tracking-tight uppercase leading-none">Generative <span className="text-primary-crm">Sequences</span></h3>
                    <p className="text-slate-400 mb-8 text-sm md:text-base leading-relaxed font-medium">
                        Connect complex AI reasoning with localized payment gateways. Your CRM now understands when a JazzCash receipt is genuine and nudges leads in polite Roman Urdu to close deals faster.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="px-8 py-4 bg-primary-crm hover:brightness-110 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all flex items-center justify-center shadow-2xl shadow-primary-crm/30">
                            Neural Studio <i className="fa-solid fa-bolt ml-4"></i>
                        </button>
                        <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all flex items-center justify-center">
                            System Logs
                        </button>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-[3rem] p-8 md:p-10 shadow-sm flex flex-col">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Automation Health</h4>
                <div className="space-y-6 flex-1">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                                <i className="fa-solid fa-check-double text-xs"></i>
                            </div>
                            <span className="text-[10px] font-bold uppercase text-slate-500">Succesful Actions</span>
                        </div>
                        <span className="text-lg font-black text-slate-900">1,204</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                                <i className="fa-solid fa-hourglass-half text-xs"></i>
                            </div>
                            <span className="text-[10px] font-bold uppercase text-slate-500">AI Thinking Time</span>
                        </div>
                        <span className="text-lg font-black text-slate-900">0.8s</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                                <i className="fa-solid fa-coins text-xs"></i>
                            </div>
                            <span className="text-[10px] font-bold uppercase text-slate-500">Revenue Guarded</span>
                        </div>
                        <span className="text-lg font-black text-slate-900">PKR 2.4M</span>
                    </div>
                </div>
                <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Next Optimization Run</p>
                    <div className="flex items-center text-primary-crm">
                        <i className="fa-solid fa-clock-rotate-left mr-2 text-xs"></i>
                        <span className="text-[10px] font-black uppercase">In 4 hours</span>
                    </div>
                </div>
            </div>
       </div>
    </div>
  );
};

export default Automation;
