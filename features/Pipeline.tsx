
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, addOpportunity, addContact, addDraftEmail } from '../store/store';
import { Opportunity, Contact } from '../types';
import { generateOutreachPackage } from '../services/geminiService';

const STAGES = [
  { id: 'lead', label: 'New Leads', color: 'bg-slate-400' },
  { id: 'contacted', label: 'In Outreach', color: 'bg-blue-600' },
  { id: 'qualified', label: 'Qualified', color: 'bg-amber-600' },
  { id: 'closed', label: 'Won Deal', color: 'bg-emerald-600' }
];

const Pipeline: React.FC = () => {
    const dispatch = useDispatch();
    const { opportunities, contacts, draftEmails } = useSelector((state: RootState) => state.crm);
    const { tenant, user } = useSelector((state: RootState) => state.auth);
    
    const [showModal, setShowModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeDetailId, setActiveDetailId] = useState<string | null>(null);

    const [form, setForm] = useState({ 
        first_name: '', last_name: '', email: '', phone: '', city: '', 
        description: '', value: 0, category: 'smb'
    });

    const handleCreateLead = async () => {
        if (!form.first_name || !form.phone || !form.email) {
            alert("Please fill in Name, Contact and Email.");
            return;
        }
        setIsProcessing(true);
        
        const contactId = Math.random().toString(36).substr(2, 9);
        const contact: Contact = {
            id: contactId,
            tenant_id: tenant?.id || '',
            first_name: form.first_name,
            last_name: form.last_name,
            email: form.email,
            phone: form.phone,
            city: form.city,
            description: form.description,
            lead_category: form.category as any,
            tags: ['AI Drafted'],
            assigned_to: user?.id || '',
            created_at: new Date().toISOString()
        };

        // Call Gemini for initial analysis and email draft
        const pkg = await generateOutreachPackage({ 
            ...form, 
            tone: 'Professional & Persuasive',
            tenant_name: tenant?.name || 'PakCRM' 
        });

        const opportunity: Opportunity = {
            id: Math.random().toString(36).substr(2, 9),
            tenant_id: tenant?.id || '',
            contact_id: contactId,
            title: `${form.category.toUpperCase()} Lead - ${form.first_name}`,
            value: Number(form.value) || 0,
            stage: 'lead',
            assigned_to: user?.id || '',
            last_activity: new Date().toISOString()
        };

        dispatch(addContact(contact));
        dispatch(addOpportunity(opportunity));
        dispatch(addDraftEmail({
            contactId,
            subject: pkg.email_subject,
            body: pkg.email_body,
            generatedAt: new Date().toISOString()
        }));

        setIsProcessing(false);
        setShowModal(false);
        setForm({ first_name: '', last_name: '', email: '', phone: '', city: '', description: '', value: 0, category: 'smb' });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20 relative">
            {/* Prominent Header with Fixed Action Button Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 sticky top-0 z-[60] py-6 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md">
                <div className="pl-2">
                    <h2 className="text-4xl font-black text-slate-950 dark:text-white uppercase tracking-tighter">Active <span className="text-primary-crm">Pipeline</span></h2>
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] mt-1">Managed Lead Velocity Hub</p>
                </div>
                <div className="flex items-center space-x-4 w-full md:w-auto">
                    <div className="hidden sm:flex items-center space-x-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{opportunities.length} Active Streams</span>
                    </div>
                    <button 
                        onClick={() => setShowModal(true)}
                        className="flex-1 md:flex-none h-16 px-10 bg-slate-950 dark:bg-primary-crm text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-slate-950/20 dark:shadow-primary-crm/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center group"
                    >
                        <i className="fa-solid fa-plus-circle mr-3 text-lg group-hover:rotate-90 transition-transform"></i>
                        Add New Lead
                    </button>
                </div>
            </div>

            <div className="flex overflow-x-auto pb-10 space-x-6 custom-scrollbar snap-x">
                {STAGES.map(stage => (
                    <div key={stage.id} className="min-w-[340px] w-[340px] shrink-0 snap-start flex flex-col space-y-5">
                        <div className="flex items-center justify-between px-6 py-2 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
                            <div className="flex items-center space-x-3">
                                <div className={`h-2.5 w-2.5 rounded-full ${stage.color} shadow-sm shadow-black/10`}></div>
                                <h3 className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">{stage.label}</h3>
                            </div>
                            <span className="text-[10px] font-black text-slate-500 bg-slate-200 dark:bg-slate-800 px-2.5 py-1 rounded-full min-w-[30px] text-center">
                                {opportunities.filter(o => o.stage === stage.id).length}
                            </span>
                        </div>

                        <div className="flex-1 bg-slate-100/30 dark:bg-slate-900/30 rounded-[3rem] p-5 border border-dashed border-slate-300 dark:border-slate-800 space-y-5 min-h-[600px] transition-colors">
                            {opportunities.filter(o => o.stage === stage.id).length > 0 ? (
                                opportunities.filter(o => o.stage === stage.id).map(opp => {
                                    const contact = contacts.find(c => c.id === opp.contact_id);
                                    const hasDraft = draftEmails.some(d => d.contactId === opp.contact_id);
                                    return (
                                        <div 
                                            key={opp.id} 
                                            onClick={() => setActiveDetailId(opp.id)}
                                            className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-700/60 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all cursor-pointer group relative overflow-hidden"
                                        >
                                            <div className="flex justify-between items-start mb-4 relative z-10">
                                                <div>
                                                    <h4 className="text-sm font-black text-slate-900 dark:text-white truncate uppercase tracking-tight group-hover:text-primary-crm transition-colors">{contact?.first_name} {contact?.last_name}</h4>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase mt-1 tracking-widest">{contact?.city || 'Regional Lead'}</p>
                                                </div>
                                                {hasDraft && (
                                                    <div className="h-8 w-8 rounded-2xl bg-primary-crm/10 dark:bg-primary-crm/20 text-primary-crm flex items-center justify-center shadow-inner group-hover:bg-primary-crm group-hover:text-white transition-all">
                                                        <i className="fa-solid fa-sparkles text-[10px]"></i>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between pt-5 border-t border-slate-50 dark:border-slate-700/50">
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Value Est.</span>
                                                    <p className="text-xl font-black text-slate-950 dark:text-slate-100 leading-none">PKR {(opp.value / 1000).toFixed(0)}k</p>
                                                </div>
                                                <div className="h-10 w-10 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 transition-all">
                                                    <i className="fa-solid fa-arrow-right-long"></i>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] flex items-center justify-center text-slate-300 dark:text-slate-700">
                                    <i className="fa-solid fa-plus-circle text-2xl"></i>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Creation Modal - Rich Lead Entry */}
            {showModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => !isProcessing && setShowModal(false)}></div>
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-3xl rounded-[3.5rem] p-10 sm:p-14 shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex flex-col max-h-[92vh] overflow-hidden animate-in slide-in-from-bottom-10 border border-white/5">
                        
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Initialize New Lead</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center">
                                    <span className="h-2 w-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                                    AI Neural Drafting Enabled
                                </p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="h-14 w-14 rounded-3xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all hover:rotate-90">
                                <i className="fa-solid fa-xmark text-xl"></i>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-8 pb-4">
                            {/* Personal Info Rail */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-primary-crm uppercase tracking-[0.3em] mb-4">Contact Rail Identity</h4>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">First Name *</label>
                                        <input 
                                            value={form.first_name} 
                                            onChange={e => setForm({...form, first_name: e.target.value})} 
                                            placeholder="e.g. Abdullah"
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 p-5 rounded-[1.5rem] text-sm font-bold border-none outline-none ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-primary-crm dark:text-white transition-all" 
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Last Name</label>
                                        <input 
                                            value={form.last_name} 
                                            onChange={e => setForm({...form, last_name: e.target.value})} 
                                            placeholder="e.g. Khan"
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 p-5 rounded-[1.5rem] text-sm font-bold border-none outline-none ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-primary-crm dark:text-white transition-all" 
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">WhatsApp / Phone *</label>
                                        <input 
                                            value={form.phone} 
                                            onChange={e => setForm({...form, phone: e.target.value})} 
                                            placeholder="+92 3XX XXXXXXX"
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 p-5 rounded-[1.5rem] text-sm font-bold border-none outline-none ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-primary-crm dark:text-white transition-all" 
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Email Address *</label>
                                        <input 
                                            value={form.email} 
                                            onChange={e => setForm({...form, email: e.target.value})} 
                                            placeholder="abdullah@company.pk"
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 p-5 rounded-[1.5rem] text-sm font-bold border-none outline-none ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-primary-crm dark:text-white transition-all" 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contextual Rail */}
                            <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-800/50">
                                <h4 className="text-[10px] font-black text-primary-crm uppercase tracking-[0.3em] mb-4">Opportunity Analysis</h4>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Regional Hub (City)</label>
                                        <input 
                                            value={form.city} 
                                            onChange={e => setForm({...form, city: e.target.value})} 
                                            placeholder="Karachi, Lahore, etc."
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 p-5 rounded-[1.5rem] text-sm font-bold border-none outline-none ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-primary-crm dark:text-white transition-all" 
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Deal Value (PKR)</label>
                                        <input 
                                            type="number" 
                                            value={form.value} 
                                            onChange={e => setForm({...form, value: Number(e.target.value)})} 
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 p-5 rounded-[1.5rem] text-sm font-black border-none outline-none ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-primary-crm dark:text-white transition-all" 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Lead Description & Intent</label>
                                    <textarea 
                                        placeholder="Describe what the lead is looking for... (Gemini will use this to generate the email)" 
                                        value={form.description} 
                                        onChange={e => setForm({...form, description: e.target.value})} 
                                        className="w-full h-40 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] text-sm font-bold border-none outline-none ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-primary-crm dark:text-white resize-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-inner" 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 mt-6 border-t border-slate-100 dark:border-slate-800">
                            <button 
                                onClick={handleCreateLead}
                                disabled={isProcessing}
                                className="w-full h-20 bg-primary-crm text-white rounded-[1.5rem] text-xs font-black uppercase tracking-[0.4em] shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center relative overflow-hidden"
                            >
                                {isProcessing ? (
                                    <>
                                        <i className="fa-solid fa-brain mr-4 animate-pulse"></i>
                                        Gemini Agent Drafting...
                                        <i className="fa-solid fa-spinner fa-spin ml-4"></i>
                                    </>
                                ) : (
                                    <>
                                        Commit to Pipeline & Auto-Draft
                                        <i className="fa-solid fa-wand-magic-sparkles ml-4 text-white/50"></i>
                                    </>
                                )}
                            </button>
                            <p className="text-center text-[8px] font-black text-slate-400 uppercase tracking-widest mt-6">Secure Neural Entry Rail v3.11</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pipeline;
