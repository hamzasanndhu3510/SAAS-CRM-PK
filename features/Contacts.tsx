
import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, addContactsBatch, addOpportunity } from '../store/store';
import { Contact, Opportunity } from '../types';
import { batchProcessLeads } from '../services/geminiService';
import * as XLSX from 'xlsx';

const STAGES = [
  { id: 'lead', label: 'New Leads' },
  { id: 'contacted', label: 'In Outreach' },
  { id: 'qualified', label: 'Qualified' },
  { id: 'closed', label: 'Won Deal' }
];

const Contacts: React.FC = () => {
    const dispatch = useDispatch();
    const { contacts } = useSelector((state: RootState) => state.crm);
    const { tenant, user } = useSelector((state: RootState) => state.auth);
    
    const [isBulkProcessing, setIsBulkProcessing] = useState(false);
    const [bulkProgress, setBulkProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [showModal, setShowModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const [form, setForm] = useState({ 
        first_name: '', last_name: '', email: '', phone: '', city: '', 
        description: '', value: '10000', category: 'smb', stage: 'lead'
    });

    const processUniversalFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsBulkProcessing(true);
        setBulkProgress(2);

        const reader = new FileReader();
        reader.onload = async (evt) => {
            try {
                const bstr = evt.target?.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);

                setBulkProgress(10);

                const chunkSize = 50;
                const mappedLeads: Contact[] = [];

                for (let i = 0; i < data.length; i += chunkSize) {
                    const chunk = data.slice(i, i + chunkSize);
                    const aiMapped = await batchProcessLeads(chunk, tenant?.name || 'AH CRM');
                    
                    aiMapped.forEach((lead: any) => {
                        mappedLeads.push({
                            id: Math.random().toString(36).substr(2, 9),
                            tenant_id: tenant?.id || '',
                            first_name: lead.first_name || 'Imported',
                            last_name: lead.last_name || 'Lead',
                            phone: lead.phone || '',
                            email: lead.email || '',
                            city: lead.city || 'Regional Hub',
                            description: lead.description || 'Neural Spreadsheet Import',
                            lead_category: (lead.lead_category?.toLowerCase() as any) || 'individual',
                            tags: ['Neural AI Mapped', 'Regional Link'],
                            assigned_to: user?.id || '',
                            created_at: new Date().toISOString()
                        });
                    });

                    setBulkProgress(Math.min(98, Math.round(((i + chunkSize) / data.length) * 100)));
                }

                dispatch(addContactsBatch(mappedLeads));
                setBulkProgress(100);
                setTimeout(() => {
                    setIsBulkProcessing(false);
                    setBulkProgress(0);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                }, 800);
            } catch (err) {
                console.error("Spreadsheet Parse Error", err);
                setIsBulkProcessing(false);
                alert("File processing failed.");
            }
        };
        reader.readAsBinaryString(file);
    };

    const handleCreateManualLead = async () => {
        if (!form.first_name || !form.phone || !form.email) {
            alert("Name, Phone, and Email are mandatory.");
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
            tags: ['Manual Identity'],
            assigned_to: user?.id || '',
            created_at: new Date().toISOString()
        };

        const opportunity: Opportunity = {
            id: Math.random().toString(36).substr(2, 9),
            tenant_id: tenant?.id || '',
            contact_id: contactId,
            title: `Opportunity: ${form.first_name}`,
            value: Number(form.value) || 0,
            stage: form.stage,
            assigned_to: user?.id || '',
            last_activity: new Date().toISOString()
        };

        dispatch(addContactsBatch([contact]));
        dispatch(addOpportunity(opportunity));

        setIsProcessing(false);
        setShowModal(false);
        setForm({ first_name: '', last_name: '', email: '', phone: '', city: '', description: '', value: '10000', category: 'smb', stage: 'lead' });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-950 dark:text-white uppercase tracking-tight">Identity <span className="text-primary-crm">Directory</span></h2>
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mt-1">Regional Lead Hub • {contacts.length} Total</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <input type="file" ref={fileInputRef} onChange={processUniversalFile} className="hidden" accept=".csv, .xlsx, .xls, .ods" />
                    <button 
                        onClick={() => fileInputRef.current?.click()} 
                        disabled={isBulkProcessing}
                        className="flex-1 sm:flex-none h-14 px-6 bg-slate-950 dark:bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center hover:bg-slate-800 transition-all disabled:opacity-50"
                    >
                        {isBulkProcessing ? (
                            <><i className="fa-solid fa-brain fa-spin mr-3"></i> NEURAL SCANNING {bulkProgress}%</>
                        ) : (
                            <><i className="fa-solid fa-file-excel mr-3"></i> UNIVERSAL AI IMPORT</>
                        )}
                    </button>
                    <button 
                        onClick={() => setShowModal(true)}
                        className="flex-1 sm:flex-none h-14 px-8 bg-primary-crm text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-all"
                    >
                        <i className="fa-solid fa-user-plus mr-3"></i> MANUAL
                    </button>
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm relative min-h-[450px]">
                {isBulkProcessing && (
                    <div className="absolute inset-0 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md z-[60] flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-300">
                        <div className="relative mb-8">
                            <div className="h-24 w-24 bg-primary-crm text-white rounded-[2.5rem] flex items-center justify-center animate-bounce shadow-[0_0_50px_rgba(37,99,235,0.4)]">
                                <i className="fa-solid fa-microchip text-4xl"></i>
                            </div>
                        </div>
                        <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">Neural Lead Ingestion</h4>
                        <div className="w-full max-w-md h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-primary-crm transition-all duration-700 ease-out" style={{ width: `${bulkProgress}%` }}></div>
                        </div>
                    </div>
                )}
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Entity Link</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Regional Hub</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Rail</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {contacts.length > 0 ? contacts.map(c => (
                                <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-12 w-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center font-black text-slate-400 uppercase border border-slate-100 dark:border-slate-700">
                                                {c.first_name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight">{c.first_name} {c.last_name}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{c.email || 'MOCK_ID'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5"><span className="text-xs text-slate-600 dark:text-slate-400 font-black uppercase tracking-tight">{c.city || 'Hub'}</span></td>
                                    <td className="px-8 py-5"><p className="text-sm font-black text-primary-crm">{c.phone}</p></td>
                                    <td className="px-8 py-5 text-right"><span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Synchronized</span></td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="px-8 py-32 text-center text-slate-400 uppercase tracking-widest text-[10px] font-black">No Active Identity Links</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Manual Entry Modal - UPDATED */}
            {showModal && (
                <div className="fixed inset-0 lg:left-[var(--sidebar-width,80px)] lg:w-[calc(100%-var(--sidebar-width,80px))] z-[250] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => !isProcessing && setShowModal(false)}></div>
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh] border border-slate-100 dark:border-slate-800 overflow-hidden">
                        <div className="p-8 sm:p-10 flex flex-col h-full overflow-y-auto custom-scrollbar">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Manual Lead Entry</h3>
                                <button onClick={() => setShowModal(false)} className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-950 transition-colors"><i className="fa-solid fa-xmark"></i></button>
                            </div>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-3 tracking-widest">Lead Name *</label>
                                        <input 
                                            value={form.first_name} 
                                            onChange={e => setForm({...form, first_name: e.target.value})} 
                                            placeholder="Full Name"
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl text-sm font-bold border-none outline-none dark:text-white ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-primary-crm" 
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-3 tracking-widest">Contact *</label>
                                        <input 
                                            value={form.phone} 
                                            onChange={e => setForm({...form, phone: e.target.value})} 
                                            placeholder="+92 XXX XXXXXXX"
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl text-sm font-bold border-none outline-none dark:text-white ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-primary-crm" 
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-3 tracking-widest">Email Identity *</label>
                                        <input 
                                            type="email"
                                            value={form.email} 
                                            onChange={e => setForm({...form, email: e.target.value})} 
                                            placeholder="lead@example.com"
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl text-sm font-bold border-none outline-none dark:text-white ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-primary-crm" 
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-3 tracking-widest">Lead Status (Funnel)</label>
                                        <select 
                                            value={form.stage} 
                                            onChange={e => setForm({...form, stage: e.target.value})}
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl text-sm font-bold border-none outline-none dark:text-white ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-primary-crm"
                                        >
                                            {STAGES.map(s => (
                                                <option key={s.id} value={s.id}>{s.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-3 tracking-widest">Intent Description</label>
                                    <textarea 
                                        value={form.description} 
                                        onChange={e => setForm({...form, description: e.target.value})} 
                                        placeholder="Detailed requirements or intent markers..."
                                        className="w-full h-28 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-[1.5rem] text-sm font-bold border-none outline-none dark:text-white resize-none ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-primary-crm" 
                                    />
                                </div>
                            </div>
                            <div className="pt-8 mt-6 border-t border-slate-50 dark:border-slate-800 flex gap-4">
                                <button onClick={() => setShowModal(false)} className="flex-1 h-14 rounded-xl text-[10px] font-black uppercase text-slate-400 tracking-widest transition-colors hover:text-slate-900 dark:hover:text-white">Cancel</button>
                                <button 
                                    onClick={handleCreateManualLead} 
                                    disabled={isProcessing}
                                    className="flex-[2] h-14 bg-primary-crm text-white rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-lg hover:scale-[1.01] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center"
                                >
                                    {isProcessing ? <i className="fa-solid fa-spinner fa-spin mr-3"></i> : null}
                                    Commit To Pipeline
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Contacts;
