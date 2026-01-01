
import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Contact } from '../types';

const Inbox: React.FC = () => {
    const contacts = useSelector((state: RootState) => state.crm.contacts);
    const { tenant } = useSelector((state: RootState) => state.auth);
    
    const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [activeConversationIds, setActiveConversationIds] = useState<string[]>([]);

    // Filtered list of contacts for the "New Chat" search
    const filteredSearch = useMemo(() => {
        return contacts.filter(c => 
            !activeConversationIds.includes(c.id) &&
            (c.first_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
             c.phone.includes(searchTerm))
        );
    }, [contacts, activeConversationIds, searchTerm]);

    // Contacts that have an active conversation
    const activeChats = useMemo(() => {
        return contacts.filter(c => activeConversationIds.includes(c.id));
    }, [contacts, activeConversationIds]);

    const selectedContact = contacts.find(c => c.id === selectedContactId);

    const startChat = (id: string) => {
        if (!activeConversationIds.includes(id)) {
            setActiveConversationIds(prev => [id, ...prev]);
        }
        setSelectedContactId(id);
        setShowNewChatModal(false);
        setSearchTerm('');
    };

    return (
        <div className="h-[calc(100vh-140px)] lg:h-[calc(100vh-100px)] flex bg-white/70 backdrop-blur-2xl rounded-[3rem] border border-slate-200/60 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-500 relative">
            
            {/* Conversations Sidebar */}
            <div className={`w-full lg:w-[400px] border-r border-slate-100/80 flex flex-col bg-white/40 ${selectedContactId ? 'hidden lg:flex' : 'flex'}`}>
                <div className="p-8 pb-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Neural <span className="text-primary-crm">Inbox</span></h2>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Omnichannel Flow</p>
                        </div>
                        <button 
                            onClick={() => setShowNewChatModal(true)}
                            className="h-12 w-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all"
                        >
                            <i className="fa-solid fa-plus"></i>
                        </button>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar px-4 space-y-2">
                    {activeChats.length > 0 ? (
                        activeChats.map(contact => (
                            <div 
                                key={contact.id} 
                                onClick={() => setSelectedContactId(contact.id)}
                                className={`group p-5 flex items-center space-x-4 cursor-pointer transition-all rounded-[2rem] border ${
                                    selectedContactId === contact.id 
                                    ? 'bg-primary-crm shadow-xl shadow-primary-crm/20 border-primary-crm' 
                                    : 'hover:bg-white border-transparent hover:border-slate-100 hover:shadow-sm'
                                }`}
                            >
                                <div className="relative shrink-0">
                                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center font-black text-lg transition-colors ${
                                        selectedContactId === contact.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
                                    }`}>
                                        {contact.first_name.charAt(0)}
                                    </div>
                                    <span className={`absolute -bottom-1 -right-1 h-4 w-4 border-2 border-white rounded-full ${
                                        selectedContactId === contact.id ? 'bg-emerald-400' : 'bg-emerald-500'
                                    }`}></span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <h4 className={`text-sm font-black truncate ${selectedContactId === contact.id ? 'text-white' : 'text-slate-900'}`}>
                                            {contact.first_name} {contact.last_name}
                                        </h4>
                                        <span className={`text-[8px] font-bold uppercase tracking-widest ${selectedContactId === contact.id ? 'text-white/60' : 'text-slate-400'}`}>Now</span>
                                    </div>
                                    <p className={`text-xs truncate font-medium ${selectedContactId === contact.id ? 'text-white/80' : 'text-slate-400'}`}>
                                        Tap to continue analysis...
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-10 text-center space-y-6 opacity-60">
                            <div className="h-20 w-20 bg-slate-100 rounded-[2rem] flex items-center justify-center">
                                <i className="fa-regular fa-message text-2xl text-slate-300"></i>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">No active streams</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase mt-2">Add a lead from your directory to start</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Canvas */}
            <div className={`flex-1 flex flex-col bg-slate-50/30 ${!selectedContactId ? 'hidden lg:flex' : 'flex'}`}>
                {selectedContact ? (
                    <>
                        {/* Header */}
                        <div className="bg-white/80 backdrop-blur-md px-8 py-5 border-b border-slate-100 flex justify-between items-center z-10">
                            <div className="flex items-center space-x-5">
                                <button onClick={() => setSelectedContactId(null)} className="lg:hidden h-10 w-10 text-slate-400 hover:text-slate-900">
                                    <i className="fa-solid fa-chevron-left"></i>
                                </button>
                                <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-primary-crm shadow-inner">
                                    {selectedContact.first_name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-slate-950 uppercase tracking-tight">{selectedContact.first_name} {selectedContact.last_name}</h3>
                                    <div className="flex items-center space-x-2 mt-0.5">
                                        <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                        <p className="text-[9px] text-emerald-600 font-black uppercase tracking-[0.2em]">Regional Link Active</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <button className="hidden sm:flex h-12 px-5 bg-white border border-slate-100 rounded-2xl items-center justify-center text-slate-400 hover:text-primary-crm transition-all shadow-sm">
                                    <i className="fa-solid fa-phone mr-3 text-xs"></i>
                                    <span className="text-[9px] font-black uppercase tracking-widest">Call Rail</span>
                                </button>
                                <a 
                                    href={`https://wa.me/${selectedContact.phone}`} 
                                    target="_blank"
                                    rel="noreferrer"
                                    className="h-12 w-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 hover:scale-110 active:scale-95 transition-all"
                                >
                                    <i className="fa-brands fa-whatsapp text-lg"></i>
                                </a>
                            </div>
                        </div>

                        {/* Message Feed */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar scroll-smooth">
                            <div className="flex justify-center mb-4">
                                <span className="bg-slate-200/50 backdrop-blur-sm text-[8px] font-black text-slate-500 px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border border-slate-100">Synchronized with {selectedContact.city || 'HQ'}</span>
                            </div>
                            
                            <div className="flex items-end space-x-4 animate-in slide-in-from-left-4 duration-500">
                                <div className="h-10 w-10 rounded-xl bg-slate-200 shrink-0 shadow-sm"></div>
                                <div className="bg-white p-6 rounded-[2rem] rounded-bl-none shadow-xl shadow-slate-200/10 border border-slate-100 max-w-[85%] md:max-w-[70%]">
                                    <p className="text-sm font-medium text-slate-700 leading-relaxed">Assalam-o-Alaikum {selectedContact.first_name}, umeed hai aap khairiyat se hongay. We are reviewing your requirements from {selectedContact.city}.</p>
                                    <div className="flex items-center justify-end space-x-2 mt-3">
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">System • 09:40 AM</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row-reverse items-end space-x-4 space-x-reverse animate-in slide-in-from-right-4 duration-500 delay-100">
                                <div className="h-10 w-10 rounded-xl bg-primary-crm/20 shrink-0 shadow-sm flex items-center justify-center text-primary-crm">
                                    <i className="fa-solid fa-user-ninja text-xs"></i>
                                </div>
                                <div className="bg-primary-crm text-white p-6 rounded-[2rem] rounded-br-none shadow-2xl shadow-primary-crm/30 max-w-[85%] md:max-w-[70%] relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                        <i className="fa-solid fa-bolt text-4xl"></i>
                                    </div>
                                    <p className="text-sm font-medium leading-relaxed">Umeed hai deals finalize ho jayen gi aaj. Please update me about the final quotation.</p>
                                    <div className="flex items-center justify-end space-x-2 mt-3">
                                        <span className="text-[8px] font-black text-white/60 uppercase tracking-widest">You • 10:42 AM</span>
                                        <i className="fa-solid fa-check-double text-[8px] text-white/40"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Neural Input Rail */}
                        <div className="p-6 lg:p-10 bg-white/50 backdrop-blur-xl border-t border-slate-100">
                            <div className="flex items-center space-x-5 max-w-5xl mx-auto">
                                <div className="flex space-x-2">
                                    <button className="h-14 w-14 rounded-2xl hover:bg-white text-slate-400 hover:text-primary-crm transition-all hover:shadow-sm">
                                        <i className="fa-solid fa-paperclip text-lg"></i>
                                    </button>
                                </div>
                                <div className="flex-1 bg-white/80 rounded-3xl border border-slate-200/60 shadow-inner-lg flex items-center px-6 py-4 transition-all focus-within:border-primary-crm focus-within:shadow-xl focus-within:shadow-primary-crm/5">
                                    <input 
                                        placeholder={`Message ${selectedContact.first_name}...`} 
                                        className="w-full bg-transparent outline-none text-sm font-bold text-slate-900 placeholder:text-slate-300" 
                                    />
                                    <button className="text-primary-crm/40 hover:text-primary-crm transition-colors ml-4">
                                        <i className="fa-solid fa-wand-magic-sparkles text-lg"></i>
                                    </button>
                                </div>
                                <button className="h-14 w-14 bg-slate-950 text-white rounded-2xl shadow-2xl shadow-slate-950/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
                                    <i className="fa-solid fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-10">
                        <div className="relative">
                            <div className="h-40 w-40 bg-slate-100 rounded-[4rem] flex items-center justify-center animate-pulse">
                                <i className="fa-regular fa-comment-dots text-5xl text-slate-300"></i>
                            </div>
                            <div className="absolute -bottom-4 -right-4 h-16 w-16 bg-primary-crm/10 rounded-3xl flex items-center justify-center">
                                <i className="fa-solid fa-shield-halved text-primary-crm text-xl"></i>
                            </div>
                        </div>
                        <div className="text-center space-y-3 px-10">
                            <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Neural Comm Link</h4>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest max-w-xs leading-relaxed">Secure P2P communication channel. Select a regional lead to initiate neural analysis.</p>
                            <button 
                                onClick={() => setShowNewChatModal(true)}
                                className="mt-6 px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
                            >
                                Open Connection Rail
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* New Chat Modal */}
            {showNewChatModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 sm:p-10 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setShowNewChatModal(false)}></div>
                    <div className="relative bg-white w-full max-w-lg rounded-[3rem] p-8 sm:p-12 shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex flex-col max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom-10">
                        
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-2xl font-black text-slate-950 uppercase tracking-tight">Active Contacts</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Selecting from Lead Directory</p>
                            </div>
                            <button onClick={() => setShowNewChatModal(false)} className="h-12 w-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-colors">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <div className="relative mb-8">
                            <i className="fa-solid fa-search absolute left-6 top-1/2 -translate-y-1/2 text-slate-300"></i>
                            <input 
                                placeholder="Search leads by name or phone..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 pl-14 pr-6 py-5 rounded-[2rem] text-sm font-bold outline-none focus:ring-2 focus:ring-primary-crm/20 transition-all shadow-inner" 
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 px-1">
                            {filteredSearch.length > 0 ? (
                                filteredSearch.map(contact => (
                                    <div 
                                        key={contact.id} 
                                        onClick={() => startChat(contact.id)}
                                        className="group p-5 bg-slate-50 border border-slate-100/50 rounded-3xl flex items-center space-x-5 cursor-pointer hover:bg-primary-crm hover:scale-[1.02] transition-all hover:shadow-xl hover:shadow-primary-crm/20"
                                    >
                                        <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center font-black text-primary-crm group-hover:bg-white/20 group-hover:text-white transition-colors">
                                            {contact.first_name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900 group-hover:text-white transition-colors uppercase tracking-tight">
                                                {contact.first_name} {contact.last_name}
                                            </p>
                                            <p className="text-[10px] font-bold text-slate-400 group-hover:text-white/60 transition-colors uppercase tracking-widest">
                                                {contact.city || 'Remote'} • {contact.phone}
                                            </p>
                                        </div>
                                        <i className="fa-solid fa-chevron-right ml-auto text-slate-200 group-hover:text-white transition-colors"></i>
                                    </div>
                                ))
                            ) : (
                                <div className="py-10 text-center space-y-4 opacity-50">
                                    <i className="fa-solid fa-user-slash text-2xl text-slate-300"></i>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        {contacts.length === 0 ? "No leads in directory" : "No matching streams"}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inbox;
