
import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, addContact, addOpportunity, addDraftEmail } from '../store/store';
import { Contact, Opportunity } from '../types';
import { generateOutreachPackage } from '../services/geminiService';

const Contacts: React.FC = () => {
    const dispatch = useDispatch();
    const { contacts } = useSelector((state: RootState) => state.crm);
    const { tenant, user } = useSelector((state: RootState) => state.auth);
    
    const [isBulkProcessing, setIsBulkProcessing] = useState(false);
    const [bulkProgress, setBulkProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Modal State for Manual Lead
    const [showModal, setShowModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [form, setForm] = useState({ 
        first_name: '', last_name: '', email: '', phone: '', city: '', 
        description: '', value: 10000, category: 'smb'
    });

    const processCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsBulkProcessing(true);
        const reader = new FileReader();
        reader.onload = async (event) => {
            const text = event.target?.result as string;
            const lines = text.split('\n').filter(l => l.trim().length > 0);
            const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
            
            const leads = lines.slice(1).map(line => {
                const values = line.split(',').map(v => v.trim());
                const obj: any = {};
                headers.forEach((h, i) => obj[h] = values[i]);
                return obj;
            });

            setBulkProgress(0);
            for (let i = 0; i < leads.length; i++) {
                const lead = leads[i];
                const contactId = Math.random().toString(36).substr(2, 9);
                
                const contact: Contact = {
                    id: contactId,
                    tenant_id: tenant?.id || '',
                    first_name: lead.name?.split(' ')[0] || 'Lead',
                    last_name: lead.name?.split(' ').slice(1).join(' ') || '',
                    phone: lead.phone || '',
                    email: lead.email || '',
                    city: lead.city || 'Karachi',
                    description: lead.description || 'Bulk Import',
                    tags: ['Bulk Imported', 'AI Pending'],
                    assigned_to: user?.id || '',
                    created_at: new Date().toISOString()
                };

                const pkg = await generateOutreachPackage({
                    first_name: contact.first_name,
                    last_name: contact.last_name,
                    city: contact.city,
                    value: Number(lead.value) || 0,
                    description: contact.description || '',
                    category: 'corporate',
                    tone: 'Professional Roman Urdu mix',
                    tenant_name: tenant?.name || 'PakCRM'
                });

                dispatch(addContact(contact));
                dispatch(addDraftEmail({ contactId, subject: pkg.email_subject, body: pkg.email_body, generatedAt: new Date().toISOString() }));
                setBulkProgress(Math.round(((i + 1) / leads.length) * 100));
            }
            setIsBulkProcessing(false);
        };
        reader.readAsText(file);
    };

    const handleCreateManualLead = async () => {
        if (!form.first_name || !form.email || !form.phone) {
            alert("All primary fields are required.");
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
            tags: ['AI Agent Drafted'],
            assigned_to: user?.id || '',
            created_at: new Date().toISOString()
        };

        const pkg = await generateOutreachPackage({
            ...form,
            tone: 'Strictly Professional',
            tenant_name: tenant?.name || 'PakCRM'
        });

        dispatch(addContact(contact));
        dispatch(addDraftEmail({
            contactId,
            subject: pkg.email_subject,
            body: pkg.email_body,
            generatedAt: new Date().toISOString()
        }));

        setIsProcessing(false);
        setShowModal(false);
        setForm({ first_name: '', last_name: '', email: '', phone: '', city: '', description: '', value: 10000, category: 'smb' });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-950 dark:text-white uppercase tracking-tight">Lead Directory</h2>
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mt-1">Managing {contacts.length} regional entities</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <input type="file" ref={fileInputRef} onChange={processCSV} className="hidden" accept=".csv" />
                    <button onClick={() => fileInputRef.current?.click()} className="flex-1 sm:flex-none px-8 py-4 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center">
                        <i className="fa-solid fa-file-csv mr-3"></i> Bulk AI Import
                    </button>
                    <button 
                        onClick={() => setShowModal(true)}
                        className="flex-1 sm:flex-none px-8 py-4 bg-primary-crm text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary-crm/20"
                    >
                        <i className="fa-solid fa-user-plus mr-3"></i> Manual Lead
                    </button>
                </div>
            </div>

            {/* Bulk Loader */}
            {isBulkProcessing && (
                <div className="bg-white dark:bg-slate-900 border border-primary-crm/20 rounded-[3rem] p-10 shadow-2xl animate-pulse">
                    <div className="flex flex-col items-center space-y-6">
                        <i className="fa-solid fa-brain text-4xl text-primary-crm animate-bounce"></i>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Processing {bulkProgress}% of leads...</p>
                        <div className="w-full max-w-md h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-primary-crm transition-all duration-500" style={{ width: `${bulkProgress}%` }}></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
                        <tr>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Entity Identity</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Regional Hub</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Rail</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                        {contacts.map(c => (
                            <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                <td className="px-8 py-5">
                                    <div className="flex items-center space-x-4">
                                        <div className="h-12 w-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center font-black text-slate-400 uppercase">
                                            {c.first_name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 dark:text-white text-sm">{c.first_name} {c.last_name}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase">{c.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5"><span className="text-xs text-slate-600 dark:text-slate-400 font-black uppercase tracking-tight">{c.city || 'Regional'}</span></td>
                                <td className="px-8 py-5"><p className="text-sm font-black text-primary-crm">{c.phone}</p></td>
                                <td className="px-8 py-5 text-right"><span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Verified</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Manual Entry Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => !isProcessing && setShowModal(false)}></div>
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-3xl rounded-[3.5rem] p-10 sm:p-14 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-white/5">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Manual Lead Entry</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Gemini Agent is standby for auto-drafting</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="h-14 w-14 rounded-3xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-950 dark:hover:text-white transition-all"><i className="fa-solid fa-xmark text-xl"></i></button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Lead Full Name *</label>
                                    <input value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} placeholder="e.g. Aslam Khan" className="w-full bg-slate-50 dark:bg-slate-800/50 p-5 rounded-[1.5rem] text-sm font-bold outline-none focus:ring-2 focus:ring-primary-crm dark:text-white" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Contact Number *</label>
                                    <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+92 XXX XXXXXXX" className="w-full bg-slate-50 dark:bg-slate-800/50 p-5 rounded-[1.5rem] text-sm font-bold outline-none focus:ring-2 focus:ring-primary-crm dark:text-white" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Email Address *</label>
                                <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="lead@company.pk" className="w-full bg-slate-50 dark:bg-slate-800/50 p-5 rounded-[1.5rem] text-sm font-bold outline-none focus:ring-2 focus:ring-primary-crm dark:text-white" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Brief Context / Inquiry Description</label>
                                <textarea 
                                    value={form.description} 
                                    onChange={e => setForm({...form, description: e.target.value})} 
                                    placeholder="Describe lead requirements... (AI will use this for the email)"
                                    className="w-full h-32 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] text-sm font-bold outline-none focus:ring-2 focus:ring-primary-crm dark:text-white resize-none shadow-inner" 
                                />
                            </div>
                        </div>

                        <div className="pt-10 mt-6 border-t border-slate-100 dark:border-slate-800">
                            <button 
                                onClick={handleCreateManualLead}
                                disabled={isProcessing}
                                className="w-full h-20 bg-primary-crm text-white rounded-[1.5rem] text-xs font-black uppercase tracking-[0.4em] shadow-xl hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center"
                            >
                                {isProcessing ? "AI Agent Drafting..." : "Ingest Lead & Generate Outreach"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Contacts;
