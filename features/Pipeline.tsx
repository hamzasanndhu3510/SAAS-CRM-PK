
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, addOpportunity, addContact, updateOpportunityStage, updateOpportunityAI } from '../store/store';
import { Opportunity, Contact, UserRole, AIAnalysis } from '../types';
import { performFullLeadAnalysis, generateOutreachPackage } from '../services/geminiService';

const STAGES = [
  { id: 'lead', label: 'New Leads', color: 'bg-slate-400' },
  { id: 'contacted', label: 'Contacted', color: 'bg-blue-600' },
  { id: 'qualified', label: 'Qualified', color: 'bg-amber-600' },
  { id: 'closed', label: 'Closed/Won', color: 'bg-emerald-600' }
];

const Pipeline: React.FC = () => {
    const dispatch = useDispatch();
    const { opportunities, contacts } = useSelector((state: RootState) => state.crm);
    const { tenant, user } = useSelector((state: RootState) => state.auth);
    
    const [showModal, setShowModal] = useState(false);
    const [modalStep, setModalStep] = useState(1); 
    const [selectedOppId, setSelectedOppId] = useState<string | null>(null);
    const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);

    // Extended Form State
    const [newLead, setNewLead] = useState({ 
        first_name: '', last_name: '', email: '', phone: '', city: '', 
        description: '', value: 0, stage: 'lead',
        category: 'smb', tone: 'Formal'
    });
    
    const [aiPackage, setAiPackage] = useState({ 
        email_body: '', 
        email_subject: '', 
        probability: 0, 
        post_reply_probability: 0, 
        strategy: '' 
    });

    const filteredOpportunities = user?.role === UserRole.ADMIN 
        ? opportunities 
        : opportunities.filter(o => o.assigned_to === user?.id);

    const proceedToAILab = async () => {
        if (!newLead.first_name || !newLead.phone) return;
        setIsGeneratingEmail(true);
        setModalStep(2);
        
        const pkg = await generateOutreachPackage({
            first_name: newLead.first_name,
            last_name: newLead.last_name,
            city: newLead.city,
            value: newLead.value,
            description: newLead.description,
            category: newLead.category,
            tone: newLead.tone,
            tenant_name: tenant?.name || 'PakCRM'
        });
        
        setAiPackage(pkg);
        setIsGeneratingEmail(false);
    };

    const handleFinalCommit = () => {
        const contactId = Math.random().toString(36).substr(2, 9);
        const contact: Contact = {
            id: contactId,
            tenant_id: tenant?.id || '',
            first_name: newLead.first_name,
            last_name: newLead.last_name,
            email: newLead.email,
            phone: newLead.phone,
            city: newLead.city,
            description: newLead.description,
            lead_category: newLead.category as any,
            tags: ['AI Prospect'],
            assigned_to: user?.id || '',
            created_at: new Date().toISOString()
        };

        const opportunity: Opportunity = {
            id: Math.random().toString(36).substr(2, 9),
            tenant_id: tenant?.id || '',
            contact_id: contactId,
            title: `${newLead.category.toUpperCase()} Deal - ${contact.first_name}`,
            value: Number(newLead.value),
            stage: newLead.stage,
            assigned_to: user?.id || '',
            last_activity: new Date().toISOString(),
            ai_analysis: {
                score: aiPackage.probability,
                sentiment: 'neutral',
                summary: 'AI initiated prospecting with professional outreach.',
                strategy: aiPackage.strategy,
                intent_markers: ['Professional Scripted', 'Predictive Scored'],
                last_analyzed: new Date().toISOString(),
                closing_probability: aiPackage.probability,
                post_reply_probability: aiPackage.post_reply_probability,
                email_subject: aiPackage.email_subject,
                personalized_email_draft: aiPackage.email_body,
                lead_persona: newLead.category
            }
        };

        dispatch(addContact(contact));
        dispatch(addOpportunity(opportunity));
        
        setShowModal(false);
        setModalStep(1);
        setNewLead({ first_name: '', last_name: '', email: '', phone: '', city: '', description: '', value: 0, stage: 'lead', category: 'smb', tone: 'Formal' });
    };

    const getSentimentConfig = (sentiment: string) => {
        switch (sentiment) {
            case 'positive': return { icon: 'fa-face-smile', color: 'text-emerald-500', bg: 'bg-emerald-50' };
            case 'negative': return { icon: 'fa-face-frown', color: 'text-rose-500', bg: 'bg-rose-50' };
            default: return { icon: 'fa-face-meh', color: 'text-amber-500', bg: 'bg-amber-50' };
        }
    };

    return (
        <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-950 uppercase tracking-tight">Lead Pipelines</h2>
                    <p className="text-slate-500 text-sm font-medium">Smart workflows for {tenant?.name}</p>
                </div>
                <button 
                    onClick={() => { setModalStep(1); setShowModal(true); }}
                    className="bg-primary-crm text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary-crm/20 transition-all hover:scale-105"
                >
                    <i className="fa-solid fa-bolt mr-2"></i> Add Lead with AI
                </button>
            </div>

            <div className="flex-1 overflow-x-auto pb-8 custom-scrollbar">
                <div className="flex space-x-8 min-w-max h-full">
                    {STAGES.map(stage => (
                        <div key={stage.id} className="w-80 flex flex-col">
                            <div className="flex items-center space-x-3 mb-6 px-2">
                                <div className={`h-3 w-3 rounded-full ${stage.color} ring-4 ring-slate-100`}></div>
                                <h3 className="font-black text-slate-500 uppercase text-[11px] tracking-widest">{stage.label}</h3>
                            </div>
                            
                            <div className="flex-1 bg-slate-100/40 rounded-[2.5rem] p-4 border border-slate-200/50 space-y-4">
                                {filteredOpportunities.filter(o => o.stage === stage.id).map(opp => {
                                    const contact = contacts.find(c => c.id === opp.contact_id);
                                    const analysis = opp.ai_analysis;
                                    const sentiment = analysis ? getSentimentConfig(analysis.sentiment) : null;

                                    return (
                                        <div 
                                            key={opp.id} 
                                            className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:scale-[1.02] hover:border-primary-crm/40 transition-all cursor-pointer group"
                                            onClick={() => setSelectedOppId(opp.id)}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="text-sm font-black text-slate-900 group-hover:text-primary-crm">{contact?.first_name} {contact?.last_name}</h4>
                                                {analysis && (
                                                    <div className={`h-6 w-6 rounded-lg ${sentiment?.bg} ${sentiment?.color} flex items-center justify-center text-[10px]`}>
                                                        <i className={`fa-solid ${sentiment?.icon}`}></i>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-[10px] text-slate-400 font-bold mb-3 uppercase tracking-tighter">{contact?.phone} • {contact?.city}</p>
                                            
                                            {analysis?.closing_probability && (
                                                <div className="mb-3 space-y-1">
                                                    <div className="flex justify-between items-center text-[8px] font-black uppercase text-slate-400">
                                                        <span>Closing Probability</span>
                                                        <span>{analysis.closing_probability}%</span>
                                                    </div>
                                                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-primary-crm" style={{ width: `${analysis.closing_probability}%` }}></div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex justify-between items-end">
                                                <p className="text-lg font-black text-slate-950">Rs. {(opp.value / 1000).toFixed(0)}k</p>
                                                <div className="h-6 w-6 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 text-[8px] font-black uppercase">AI</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Lead Multi-Step Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in" onClick={() => setShowModal(false)}></div>
                    <div className="relative bg-white w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 overflow-hidden">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center space-x-3">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-black ${modalStep >= 1 ? 'bg-primary-crm text-white' : 'bg-slate-100 text-slate-400'}`}>1</div>
                                <div className="h-px w-8 bg-slate-100"></div>
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-black ${modalStep >= 2 ? 'bg-primary-crm text-white' : 'bg-slate-100 text-slate-400'}`}>2</div>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{modalStep === 1 ? 'Lead Profiling' : 'AI Outreach Lab'}</h3>
                        </div>

                        {modalStep === 1 ? (
                            <div className="space-y-6 animate-in slide-in-from-left-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">First Name</label>
                                        <input placeholder="Ahmad" value={newLead.first_name} onChange={e => setNewLead({...newLead, first_name: e.target.value})} className="w-full bg-slate-50 p-4 rounded-xl text-sm font-bold ring-1 ring-slate-100 outline-none focus:ring-2 focus:ring-primary-crm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Name</label>
                                        <input placeholder="Ali" value={newLead.last_name} onChange={e => setNewLead({...newLead, last_name: e.target.value})} className="w-full bg-slate-50 p-4 rounded-xl text-sm font-bold ring-1 ring-slate-100 outline-none focus:ring-2 focus:ring-primary-crm" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lead Category</label>
                                        <select value={newLead.category} onChange={e => setNewLead({...newLead, category: e.target.value})} className="w-full bg-slate-50 p-4 rounded-xl text-sm font-bold ring-1 ring-slate-100 outline-none">
                                            <option value="corporate">Corporate Enterprise</option>
                                            <option value="smb">Small/Medium Business</option>
                                            <option value="individual">High-Net-Worth Individual</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Tone</label>
                                        <select value={newLead.tone} onChange={e => setNewLead({...newLead, tone: e.target.value})} className="w-full bg-slate-50 p-4 rounded-xl text-sm font-bold ring-1 ring-slate-100 outline-none">
                                            <option value="Formal">Highly Formal</option>
                                            <option value="Persuasive">Persuasive / Direct</option>
                                            <option value="Consultative">Consultative / Friendly</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">City</label>
                                        <input placeholder="Lahore" value={newLead.city} onChange={e => setNewLead({...newLead, city: e.target.value})} className="w-full bg-slate-50 p-4 rounded-xl text-sm font-bold ring-1 ring-slate-100 outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Deal Value (PKR)</label>
                                        <input type="number" placeholder="50000" value={newLead.value} onChange={e => setNewLead({...newLead, value: Number(e.target.value)})} className="w-full bg-slate-50 p-4 rounded-xl text-sm font-bold ring-1 ring-slate-100 outline-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lead Description / Need</label>
                                    <textarea 
                                        placeholder="Describe exactly what the lead wants (e.g., Software development for a real estate firm, 10-user license, etc.)" 
                                        value={newLead.description} 
                                        onChange={e => setNewLead({...newLead, description: e.target.value})} 
                                        className="w-full h-32 bg-slate-50 p-4 rounded-xl text-sm font-bold ring-1 ring-slate-100 outline-none focus:ring-2 focus:ring-primary-crm"
                                    />
                                </div>
                                <div className="pt-4 flex space-x-4">
                                    <button onClick={() => setShowModal(false)} className="flex-1 py-4 text-[10px] font-black uppercase text-slate-400">Cancel</button>
                                    <button onClick={proceedToAILab} className="flex-[2] py-4 bg-primary-crm text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary-crm/20">Generate Outreach</button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-in slide-in-from-right-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                                {isGeneratingEmail ? (
                                    <div className="py-20 text-center space-y-6">
                                        <div className="h-20 w-20 bg-primary-crm/10 rounded-full flex items-center justify-center mx-auto">
                                            <i className="fa-solid fa-wand-magic-sparkles text-3xl text-primary-crm animate-pulse"></i>
                                        </div>
                                        <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Gemini AI is drafting...</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="bg-slate-950 text-white p-6 rounded-3xl">
                                                <p className="text-[10px] font-black text-primary-crm uppercase tracking-widest mb-1">Cold Intent</p>
                                                <h4 className="text-3xl font-black">{aiPackage.probability}%</h4>
                                                <p className="text-[9px] text-slate-500 uppercase mt-2">Chance of closing today</p>
                                            </div>
                                            <div className="bg-emerald-600 text-white p-6 rounded-3xl">
                                                <p className="text-[10px] font-black text-emerald-100 uppercase tracking-widest mb-1">Reply Forecast</p>
                                                <h4 className="text-3xl font-black">{aiPackage.post_reply_probability}%</h4>
                                                <p className="text-[9px] text-emerald-200 uppercase mt-2">Chance of closing after reply</p>
                                            </div>
                                        </div>

                                        <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
                                            <div className="bg-slate-50 px-8 py-4 border-b border-slate-200 flex items-center space-x-4">
                                                <div className="h-3 w-3 rounded-full bg-rose-400"></div>
                                                <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                                                <div className="h-3 w-3 rounded-full bg-emerald-400"></div>
                                                <div className="flex-1 text-center">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Personalized Email Draft</span>
                                                </div>
                                            </div>
                                            <div className="p-8 space-y-4">
                                                <div className="flex border-b border-slate-100 pb-3">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase w-20">Subject:</span>
                                                    <span className="text-xs font-bold text-slate-900">{aiPackage.email_subject}</span>
                                                </div>
                                                <textarea 
                                                    value={aiPackage.email_body}
                                                    onChange={(e) => setAiPackage({...aiPackage, email_body: e.target.value})}
                                                    className="w-full h-80 bg-transparent text-sm font-medium text-slate-700 leading-relaxed outline-none resize-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex space-x-4">
                                            <button onClick={() => setModalStep(1)} className="flex-1 py-4 text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 transition-colors">Modify Context</button>
                                            <button onClick={handleFinalCommit} className="flex-[3] py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-black transition-all">Provision & Send Draft</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pipeline;
