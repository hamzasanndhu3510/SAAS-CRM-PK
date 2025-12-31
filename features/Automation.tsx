
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const Automation: React.FC = () => {
  const { tenant } = useSelector((state: RootState) => state.auth);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">AI Logic Factory</h2>
            <p className="text-slate-500 font-medium mt-1">Autonomous workflows for {tenant?.name}</p>
          </div>
          <button className="bg-primary-crm text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary-crm/20 transition-all hover:scale-105 active:scale-95">
             <i className="fa-solid fa-brain mr-2"></i> Deploy Neural Logic
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* AI WhatsApp Greeting */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm border-l-[10px] border-l-emerald-500 group hover:shadow-2xl transition-all">
             <div className="flex justify-between items-start mb-6">
                <div className="h-14 w-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i className="fa-brands fa-whatsapp text-2xl"></i>
                </div>
                <div className="flex items-center">
                   <div className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in">
                      <input type="checkbox" defaultChecked name="toggle" id="toggle1" className="sr-only peer" />
                      <div className="w-12 h-6 bg-slate-200 rounded-full peer peer-checked:bg-emerald-500 transition-colors"></div>
                      <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-6"></div>
                   </div>
                </div>
             </div>
             <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Gemini Lead Responder</h3>
             <p className="text-xs text-slate-500 mt-3 leading-relaxed font-medium">Uses Gemini 3 to parse WhatsApp inquiries and draft context-aware replies in Urdu/English.</p>
             <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active • AI Driven</span>
                <button className="text-slate-400 text-[10px] font-black uppercase hover:text-primary-crm transition-colors">Tune Prompt</button>
             </div>
          </div>

          {/* AI Score Trigger */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm border-l-[10px] border-l-blue-600 group hover:shadow-2xl transition-all">
             <div className="flex justify-between items-start mb-6">
                <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-ranking-star text-2xl"></i>
                </div>
                <div className="flex items-center">
                   <div className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in">
                      <input type="checkbox" defaultChecked name="toggle" id="toggle2" className="sr-only peer" />
                      <div className="w-12 h-6 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 transition-colors"></div>
                      <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-6"></div>
                   </div>
                </div>
             </div>
             <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Intelligent Routing</h3>
             <p className="text-xs text-slate-500 mt-3 leading-relaxed font-medium">Automatically assigns leads with an AI Intent Score > 85% to Senior Agents for closing.</p>
             <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Active • Precision High</span>
                <button className="text-slate-400 text-[10px] font-black uppercase hover:text-primary-crm transition-colors">Route Map</button>
             </div>
          </div>

          {/* New Logic Slot */}
          <button className="border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-slate-400 hover:border-primary-crm hover:text-primary-crm hover:bg-slate-50 transition-all group">
             <div className="h-16 w-16 rounded-[1.5rem] bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-primary-crm/10 group-hover:scale-110 transition-all">
                <i className="fa-solid fa-plus-circle text-2xl"></i>
             </div>
             <span className="font-black text-[10px] uppercase tracking-[0.2em]">Add Neural Trigger</span>
             <p className="text-[10px] mt-2 font-bold uppercase tracking-widest text-slate-300">Connect Intent to Action</p>
          </button>
       </div>

       {/* Visual AI Builder Placeholder */}
       <div className="bg-slate-950 text-white rounded-[3rem] p-12 overflow-hidden relative shadow-2xl shadow-primary-crm/10 border border-white/5">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <i className="fa-solid fa-code-merge text-[15rem] rotate-45"></i>
          </div>
          <div className="max-w-2xl relative z-10">
             <div className="flex items-center space-x-4 mb-6">
                <span className="bg-primary-crm text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">Neural Engine v2.0</span>
             </div>
             <h3 className="text-3xl font-black mb-6 tracking-tight uppercase leading-none">Generative <span className="text-primary-crm">Workflows</span></h3>
             <p className="text-slate-400 mb-8 text-sm leading-relaxed font-medium">
                Orchestrate multi-step AI tasks. Connect Gemini-powered sentiment analysis with localized JazzCash payment verification and WhatsApp re-engagement loops.
             </p>
             <div className="flex flex-wrap gap-4">
                <button className="px-8 py-4 bg-primary-crm hover:brightness-110 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] transition-all flex items-center shadow-2xl shadow-primary-crm/30">
                    Open Neural Studio <i className="fa-solid fa-bolt ml-4"></i>
                </button>
                <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] transition-all">
                    View Logs
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};

export default Automation;
