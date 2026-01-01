
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, addOpportunity, addContact, addDraftEmail } from '../store/store';
import { Opportunity, Contact, UserRole } from '../types';
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
        if (!form.first_name || !form.phone || !form.email) return;
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
            tags: ['AI Analyzed'],
            assigned_to: user?.id || '',
            created_at: new Date().toISOString()
        };

        // Call Gemini for initial analysis and email draft
        const pkg = await generateOutreachPackage({ 
            ...form, 
            tone: 'Professional Roman Urdu mix',
            tenant_name: tenant?.name || 'PakCRM' 
        });

        const opportunity: Opportunity = {
            id: Math.random().toString(36).substr(2, 9),
            tenant_id: tenant?.id || '',
            contact_id: contactId,
            title: `${form.category.toUpperCase()} Inquiry - ${form.first_name}`,
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
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 sticky top-0 z-40 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md py-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-950 dark:text-white uppercase tracking-tight">Active Rail</h2>
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mt-1">Neural Flow Optimization</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                   <button 
                        onClick={() => setShowModal(true)}
                        className="flex-1 md:flex-none bg-primary-crm text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary-crm/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        <i className="fa-solid fa-plus-circle mr-3"></i> Add New Lead
                    </button>
                </div>
            </div>

            <div className="flex overflow-x-auto pb-10 space-x-6 custom-scrollbar snap-x">
                {STAGES.map(stage => (
                    <div key={stage.id} className="min-w-[320px] w-80 shrink-0 snap-start flex flex-col space-y-4">
                        <div className="flex items-center justify-between px-4">
                            <div className="flex items-center space-x-3">
                                <div className={`h-2 w-2 rounded-full ${stage.color} animate-pulse`}></div>
                                <h3 className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{stage.label}</h3>
                            </div>
                            <span className="text-[9px] font-black text-slate-400 bg-slate-200 dark:bg-slate-800 dark:text-slate-500 px-2 py-0.5 rounded-full">
                                {opportunities.filter(o => o.stage === stage.id).length}
                            </span>
                        </div>

                        <div className="flex-1 bg-slate-100/50 dark:bg-slate-900/50 rounded-[3rem] p-4 border border-slate-200/50 dark:border-slate-800/50 space-y-4 min-h-[500px]">
                            {opportunities.filter(o => o.stage === stage.id).map(opp => {
                                const contact = contacts.find(c => c.id === opp.contact_id);
                                const hasDraft = draftEmails.some(d => d.contactId === opp.contact_id);
                                return (
                                    <div 
                                        key={opp.id} 
                                        onClick={() => setActiveDetailId(opp.id)}
                                        className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="text-sm font-black text-slate-900 dark:text-white truncate uppercase tracking-tight">{contact?.first_name} {contact?.last_name}</h4>
                                                <p className="text-[9px] font-black text-slate-400 uppercase mt-0.5">{contact?.city || 'Regional Hub'}</p>
                                            </div>
                                            {hasDraft && (
                                                <div className="h-6 w-6 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[9px] font-black animate-bounce">
                                                    AI
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700/50">
                                            <p className="text-lg font-black text-slate-950 dark:text-slate-100">PKR {(opp.value / 1000).toFixed(0)}k</p>
                                            <i className="fa-solid fa-chevron-right text-[10px] text-slate-300 group-hover:text-primary-crm transition-colors"></i>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Creation Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => !isProcessing && setShowModal(false)}></div>
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] p-8 sm:p-12 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-10">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">New Lead Entry</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Manual Neural Ingestion</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="h-10 w-10 text-slate-400 hover:text-slate-900 dark:hover:text-white"><i className="fa-solid fa-xmark text-xl"></i></button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">First Name</label>
                                    <input value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-sm font-bold border border-slate-100 dark:border-slate-700 outline-none focus:border-primary-crm dark:text-white" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Name</label>
                                    <input value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-sm font-bold border border-slate-100 dark:border-slate-700 outline-none focus:border-primary-crm dark:text-white" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone / WhatsApp</label>
                                    <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-sm font-bold border border-slate-100 dark:border-slate-700 outline-none focus:border-primary-crm dark:text-white" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                                    <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-sm font-bold border border-slate-100 dark:border-slate-700 outline-none focus:border-primary-crm dark:text-white" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deal Value (PKR)</label>
                                <input type="number" value={form.value} onChange={e => setForm({...form, value: Number(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-sm font-bold border border-slate-100 dark:border-slate-700 outline-none focus:border-primary-crm dark:text-white" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lead Description / Context</label>
                                <textarea placeholder="Paste inquiry details here..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full h-32 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-sm font-bold border border-slate-100 dark:border-slate-700 outline-none focus:border-primary-crm dark:text-white resize-none" />
                            </div>
                        </div>

                        <div className="pt-8 mt-4 border-t border-slate-50 dark:border-slate-800">
                            <button 
                                onClick={handleCreateLead}
                                disabled={isProcessing}
                                className="w-full py-5 bg-primary-crm text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-primary-crm/30 hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center"
                            >
                                {isProcessing ? (
                                    <>AI Agent Processing <i className="fa-solid fa-spinner fa-spin ml-4"></i></>
                                ) : (
                                    <>Commit Lead to Pipeline <i className="fa-solid fa-bolt ml-4"></i></>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pipeline;
