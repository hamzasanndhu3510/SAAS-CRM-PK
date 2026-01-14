
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, addOpportunity, addContact, addDraftEmail } from '../store/store';
import { Opportunity, Contact } from '../types';
import { generateOutreachPackage, suggestLeadFunnelStage } from '../services/geminiService';
import ReactQuill from 'react-quill';

const STAGES = [
  { id: 'lead', label: 'New Leads', color: 'bg-slate-400' },
  { id: 'contacted', label: 'In Outreach', color: 'bg-blue-600' },
  { id: 'qualified', label: 'Qualified', color: 'bg-amber-600' },
  { id: 'closed', label: 'Won Deal', color: 'bg-emerald-600' }
];

const QUILL_MODULES = {
    toolbar: [
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['clean']
    ],
};

const Pipeline: React.FC = () => {
    const dispatch = useDispatch();
    const { opportunities, contacts, draftEmails } = useSelector((state: RootState) => state.crm);
    const { tenant, user } = useSelector((state: RootState) => state.auth);
    
    const [showModal, setShowModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeDetailId, setActiveDetailId] = useState<string | null>(null);

    const [form, setForm] = useState({ 
        first_name: '', last_name: '', email: '', phone: '', city: '', 
        description: '', value: '0', category: 'smb'
    });

    const [aiSuggestion, setAiSuggestion] = useState<{stage: string, reasoning: string} | null>(null);
    const [isAiThinking, setIsAiThinking] = useState(false);

    useEffect(() => {
        if (form.description.length > 50 && showModal) {
            const timer = setTimeout(async () => {
                setIsAiThinking(true);
                const result = await suggestLeadFunnelStage({
                    description: form.description,
                    value: Number(form.value) || 0,
                    tenant_name: tenant?.name || 'AH CRM'
                });
                setAiSuggestion({ stage: result.suggested_stage, reasoning: result.reasoning });
                setIsAiThinking(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [form.description, form.value, tenant?.name, showModal]);

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

        const pkg = await generateOutreachPackage({ 
            ...form, 
            value: Number(form.value) || 0,
            tone: 'Professional & Persuasive',
            tenant_name: tenant?.name || 'AH CRM' 
        });

        const finalStage = aiSuggestion?.stage || 'lead';

        const opportunity: Opportunity = {
            id: Math.random().toString(36).substr(2, 9),
            tenant_id: tenant?.id || '',
            contact_id: contactId,
            title: `${form.category.toUpperCase()} Lead - ${form.first_name}`,
            value: Number(form.value) || 0,
            stage: finalStage,
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
        setForm({ first_name: '', last_name: '', email: '', phone: '', city: '', description: '', value: '0', category: 'smb' });
        setAiSuggestion(null);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20 relative">
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
                                    const score = contact?.ai_analysis?.score || 0;
                                    const sentiment = contact?.ai_analysis?.sentiment || 'neutral';
                                    
                                    return (
                                        <div 
                                            key={opp.id} 
                                            onClick={() => setActiveDetailId(opp.id)}
                                            className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-700/60 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all cursor-pointer group relative overflow-hidden"
                                        >
                                            {/* AI Scoring Prominent Display */}
                                            {score > 0 && (
                                                <div className={`absolute top-0 right-0 h-16 w-16 flex items-center justify-center rounded-bl-[2rem] border-b border-l ${
                                                    sentiment === 'positive' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                                                    sentiment === 'negative' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
                                                    'bg-blue-500/10 border-blue-500/20 text-blue-500'
                                                }`}>
                                                    <div className="text-center">
                                                        <p className="text-[8px] font-black uppercase tracking-tighter opacity-60">Heat</p>
                                                        <p className="text-sm font-black tracking-tighter">{score}%</p>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex justify-between items-start mb-4 relative z-10">
                                                <div className="max-w-[70%]">
                                                    <h4 className="text-sm font-black text-slate-900 dark:text-white truncate uppercase tracking-tight group-hover:text-primary-crm transition-colors">{contact?.first_name} {contact?.last_name}</h4>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase mt-1 tracking-widest">{contact?.city || 'Regional Lead'}</p>
                                                </div>
                                                {hasDraft && !contact?.ai_analysis && (
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

            {showModal && (
                <div className="fixed inset-0 lg:left-[var(--sidebar-width,80px)] lg:w-[calc(100%-var(--sidebar-width,80px))] z-[150] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => !isProcessing && setShowModal(false)}></div>
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] p-10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex flex-col max-h-[92vh] overflow-hidden border border-white/5">
                        
                        <div className="flex justify-between items-center mb-8 shrink-0">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Initialize New Lead</h3>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 flex items-center">
                                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                                    AI Neural Drafting Enabled
                                </p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">
                                <i className="fa-solid fa-xmark text-lg"></i>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6 pb-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Name *</label>
                                    <div className="ring-1 ring-slate-100 dark:ring-slate-800 rounded-2xl focus-within:ring-2 focus-within:ring-primary-crm transition-all ring-offset-2 ring-offset-white dark:ring-offset-slate-900">
                                        <input 
                                            value={form.first_name} 
                                            onChange={e => setForm({...form, first_name: e.target.value})} 
                                            placeholder="Name"
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl text-sm font-bold border-none outline-none dark:text-white transition-all" 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Last Name</label>
                                    <div className="ring-1 ring-slate-100 dark:ring-slate-800 rounded-2xl focus-within:ring-2 focus-within:ring-primary-crm transition-all ring-offset-2 ring-offset-white dark:ring-offset-slate-900">
                                        <input 
                                            value={form.last_name} 
                                            onChange={e => setForm({...form, last_name: e.target.value})} 
                                            placeholder="Last Name"
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl text-sm font-bold border-none outline-none dark:text-white transition-all" 
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Deal Value (PKR)</label>
                                    <div className="ring-1 ring-slate-100 dark:ring-slate-800 rounded-2xl focus-within:ring-2 focus-within:ring-primary-crm transition-all ring-offset-2 ring-offset-white dark:ring-offset-slate-900">
                                        <input 
                                            type="text" 
                                            value={form.value} 
                                            onChange={e => setForm({...form, value: e.target.value})} 
                                            placeholder="Value"
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl text-sm font-black border-none outline-none dark:text-white transition-all" 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Lead Category</label>
                                    <select 
                                        value={form.category} 
                                        onChange={e => setForm({...form, category: e.target.value})}
                                        className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl text-sm font-black border-none outline-none dark:text-white ring-1 ring-slate-100 dark:ring-slate-700 transition-all"
                                    >
                                        <option value="smb">Small Business (SMB)</option>
                                        <option value="corporate">Enterprise Corporate</option>
                                        <option value="individual">Direct Individual</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Lead Description & Intent (Rich Text)</label>
                                <div className="ring-1 ring-slate-100 dark:ring-slate-800 rounded-[1.5rem] focus-within:ring-2 focus-within:ring-primary-crm transition-all ring-offset-2 ring-offset-white dark:ring-offset-slate-900 overflow-hidden bg-slate-50 dark:bg-slate-800/50">
                                    <ReactQuill 
                                        theme="snow"
                                        value={form.description}
                                        onChange={val => setForm({...form, description: val})}
                                        modules={QUILL_MODULES}
                                        placeholder="Describe the lead's intent. AI will auto-categorize based on your input..."
                                    />
                                </div>
                            </div>

                            {/* Prominent Neural Intelligence Panel */}
                            <div className="relative mt-8 group">
                                <div className={`p-8 rounded-[2.5rem] transition-all duration-700 border-2 overflow-hidden ${
                                    isAiThinking 
                                    ? 'bg-slate-50 dark:bg-slate-800/50 border-primary-crm/20 animate-pulse' 
                                    : aiSuggestion 
                                    ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/30' 
                                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800'
                                }`}>
                                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none transition-transform group-hover:scale-110">
                                        <i className="fa-solid fa-brain text-[8rem]"></i>
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-6 relative z-10">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="h-10 w-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                                                    <i className={`fa-solid ${isAiThinking ? 'fa-spinner fa-spin' : 'fa-wand-magic-sparkles'}`}></i>
                                                </div>
                                                <div>
                                                    <h4 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Neural Intelligence Report</h4>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">Automated Funnel Assessment</p>
                                                </div>
                                            </div>

                                            {isAiThinking ? (
                                                <div className="space-y-3">
                                                    <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
                                                    <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse delay-75"></div>
                                                </div>
                                            ) : aiSuggestion ? (
                                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                    <p className="text-[13px] font-bold text-slate-600 dark:text-slate-300 leading-relaxed italic">
                                                        "{aiSuggestion.reasoning}"
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-2">Provide more details for AI analysis...</p>
                                            )}
                                        </div>

                                        {!isAiThinking && aiSuggestion && (
                                            <div className="shrink-0 flex flex-col items-center justify-center p-6 bg-emerald-500 dark:bg-emerald-600 rounded-3xl text-white shadow-2xl shadow-emerald-500/30 animate-in zoom-in-95 duration-500">
                                                <p className="text-[8px] font-black uppercase tracking-[0.3em] mb-1.5 opacity-80">Target Stage</p>
                                                <span className="text-sm font-black uppercase tracking-widest">{aiSuggestion.stage}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 shrink-0">
                            <button 
                                onClick={() => setShowModal(false)}
                                className="flex-1 h-14 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleCreateLead}
                                disabled={isProcessing}
                                className="flex-[2] h-14 bg-primary-crm text-white rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-lg shadow-primary-crm/20 hover:scale-[1.01] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center group"
                            >
                                {isProcessing ? (
                                    <>
                                        <i className="fa-solid fa-spinner fa-spin mr-3"></i>
                                        Syncing Neural Identity...
                                    </>
                                ) : (
                                    <>
                                        Commit to Pipeline
                                        <i className="fa-solid fa-bolt ml-3 text-white/50"></i>
                                    </>
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
