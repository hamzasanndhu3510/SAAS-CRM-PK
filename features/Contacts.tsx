
import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, addContactsBatch } from '../store/store';
import { Contact } from '../types';
import { batchProcessLeads } from '../services/geminiService';
import * as XLSX from 'xlsx';

const STAGES = [
  { id: 'lead', label: 'New Lead' },
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
    
    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const [form, setForm] = useState({ 
        first_name: '', 
        last_name: '', 
        email: '', 
        phone: '', 
        city: '', 
        description: '', 
        value: '10000', 
        category: 'smb',
        stage: 'lead'
    });

    const processFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsBulkProcessing(true);
        setBulkProgress(10); // Initializing

        const reader = new FileReader();
        reader.onload = async (evt) => {
            const bstr = evt.target?.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws);

            setBulkProgress(30); // File Read

            // AI Batch Processing
            // We process in chunks of 15 to stay within token limits while being extremely fast
            const chunkSize = 15;
            const mappedLeads: Contact[] = [];

            for (let i = 0; i < data.length; i += chunkSize) {
                const chunk = data.slice(i, i + chunkSize);
                const aiMapped = await batchProcessLeads(chunk, tenant?.name || 'PakCRM');
                
                aiMapped.forEach((lead: any) => {
                    mappedLeads.push({
                        id: Math.random().toString(36).substr(2, 9),
                        tenant_id: tenant?.id || '',
                        first_name: lead.first_name || 'Imported',
                        last_name: lead.last_name || 'Lead',
                        phone: lead.phone || '',
                        email: lead.email || '',
                        city: lead.city || 'Karachi',
                        description: lead.description || 'Neural Spreadsheet Import',
                        lead_category: lead.lead_category || 'individual',
                        tags: ['AI Processed', 'Regional Lead'],
                        assigned_to: user?.id || '',
                        created_at: new Date().toISOString()
                    });
                });

                setBulkProgress(Math.round(((i + chunkSize) / data.length) * 100));
            }

            dispatch(addContactsBatch(mappedLeads));
            setIsBulkProcessing(false);
            setBulkProgress(0);
        };
        reader.readAsBinaryString(file);
    };

    const handleCreateManualLead = async () => {
        if (!form.first_name || !form.email || !form.phone) {
            alert("Mandatory Fields Missing.");
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
            tags: ['Manual Entry'],
            assigned_to: user?.id || '',
            created_at: new Date().toISOString()
        };

        dispatch(addContactsBatch([contact]));
        setIsProcessing(false);
        setShowModal(false);
        setForm({ first_name: '', last_name: '', email: '', phone: '', city: '', description: '', value: '10000', category: 'smb', stage: 'lead' });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-950 dark:text-white uppercase tracking-tight">Lead <span className="text-primary-crm">Directory</span></h2>
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mt-1">Managed Regional Entities • {contacts.length} Total</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <input type="file" ref={fileInputRef} onChange={processFile} className="hidden" accept=".csv, .xlsx, .xls, .ods" />
                    <button 
                        onClick={() => fileInputRef.current?.click()} 
                        disabled={isBulkProcessing}
                        className="flex-1 sm:flex-none h-14 px-6 bg-slate-950 dark:bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center hover:bg-slate-800 transition-all disabled:opacity-50"
                    >
                        {isBulkProcessing ? (
                            <><i className="fa-solid fa-spinner fa-spin mr-3"></i> {bulkProgress}%</>
                        ) : (
                            <><i className="fa-solid fa-file-import mr-3"></i> UNIVERSAL IMPORT</>
                        )}
                    </button>
                    <button 
                        onClick={() => setShowModal(true)}
                        className="flex-1 sm:flex-none h-14 px-8 bg-primary-crm text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary-crm/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        <i className="fa-solid fa-user-plus mr-3"></i> MANUAL LEAD
                    </button>
                </div>
            </div>

            {/* Contacts Table */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm relative">
                {isBulkProcessing && (
                    <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center space-y-4">
                        <div className="h-16 w-16 bg-primary-crm text-white rounded-3xl flex items-center justify-center animate-bounce shadow-2xl">
                            <i className="fa-solid fa-brain text-2xl"></i>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 dark:text-slate-300">Neural Calibration in Progress...</p>
                        <div className="w-48 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-primary-crm transition-all duration-500" style={{ width: `${bulkProgress}%` }}></div>
                        </div>
                    </div>
                )}
                <div className="overflow-x-auto">
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
                            {contacts.length > 0 ? contacts.map(c => (
                                <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-12 w-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center font-black text-slate-400 uppercase">
                                                {c.first_name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight">{c.first_name} {c.last_name}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{c.email || 'NO_EMAIL'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5"><span className="text-xs text-slate-600 dark:text-slate-400 font-black uppercase tracking-tight">{c.city || 'Regional Hub'}</span></td>
                                    <td className="px-8 py-5"><p className="text-sm font-black text-primary-crm">{c.phone}</p></td>
                                    <td className="px-8 py-5 text-right"><span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Verified</span></td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center text-slate-400 uppercase tracking-widest text-[10px] font-black">No Leads in Hub</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Manual Entry Modal - PERFECTLY CENTERED */}
            {showModal && (
                <div className="fixed inset-0 lg:left-[var(--sidebar-width,80px)] lg:w-[calc(100%-var(--sidebar-width,80px))] z-[250] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => !isProcessing && setShowModal(false)}></div>
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh] border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-300">
                        <div className="p-8 sm:p-10 flex flex-col h-full overflow-y-auto custom-scrollbar">
                            <div className="flex justify-between items-center mb-8 shrink-0">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Manual Lead <span className="text-primary-crm">Entry</span></h3>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 flex items-center"><span className="h-1.5 w-1.5 bg-primary-crm rounded-full mr-2"></span>Calibration Active</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-950 flex items-center justify-center"><i className="fa-solid fa-xmark text-lg"></i></button>
                            </div>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                                    <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Name *</label><div className="ring-1 ring-slate-100 dark:ring-slate-800 rounded-2xl focus-within:ring-2 focus-within:ring-primary-crm transition-all"><input value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} placeholder="Name" className="w-full bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl text-sm font-bold outline-none dark:text-white" /></div></div>
                                    <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Last Name</label><div className="ring-1 ring-slate-100 dark:ring-slate-800 rounded-2xl focus-within:ring-2 focus-within:ring-primary-crm transition-all"><input value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} placeholder="Last Name" className="w-full bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl text-sm font-bold outline-none dark:text-white" /></div></div>
                                    <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">WhatsApp / Phone *</label><div className="ring-1 ring-slate-100 dark:ring-slate-800 rounded-2xl focus-within:ring-2 focus-within:ring-primary-crm transition-all"><input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="WhatsApp / Phone" className="w-full bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl text-sm font-bold outline-none dark:text-white" /></div></div>
                                    <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Email *</label><div className="ring-1 ring-slate-100 dark:ring-slate-800 rounded-2xl focus-within:ring-2 focus-within:ring-primary-crm transition-all"><input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Email Address" className="w-full bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl text-sm font-bold outline-none dark:text-white" /></div></div>
                                </div>
                                <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Inquiry Intent</label><div className="ring-1 ring-slate-100 dark:ring-slate-800 rounded-[1.5rem] focus-within:ring-2 focus-within:ring-primary-crm transition-all"><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Notes..." className="w-full h-28 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-[1.5rem] text-sm font-bold outline-none dark:text-white resize-none" /></div></div>
                            </div>
                            <div className="pt-6 mt-4 border-t border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row gap-4 shrink-0">
                                <button onClick={() => setShowModal(false)} className="flex-1 h-14 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Cancel</button>
                                <button onClick={handleCreateManualLead} disabled={isProcessing} className="flex-[2] h-14 bg-primary-crm text-white rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-lg shadow-primary-crm/20 hover:scale-[1.01] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center">{isProcessing ? <><i className="fa-solid fa-spinner fa-spin mr-3"></i> Syncing...</> : <>Deploy To Pipeline</>}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Contacts;
