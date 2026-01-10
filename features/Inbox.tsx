
import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, addContact } from '../store/store';
import { Contact, Message } from '../types';
import { processChatTriage } from '../services/geminiService';

const Inbox: React.FC = () => {
    const dispatch = useDispatch();
    const contacts = useSelector((state: RootState) => state.crm.contacts);
    const { tenant } = useSelector((state: RootState) => state.auth);
    
    const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    
    // Simulate active conversations storage (in real app, this would be in Redux)
    const [conversations, setConversations] = useState<Record<string, { 
        messages: Message[], 
        status: 'ai_handling' | 'human_needed' 
    }>>({});

    const selectedContact = contacts.find(c => c.id === selectedContactId);
    const activeConversation = selectedContactId ? conversations[selectedContactId] : null;

    const [inputText, setInputText] = useState('');
    const [isAiThinking, setIsAiThinking] = useState(false);

    const startChat = (id: string) => {
        if (!conversations[id]) {
            setConversations(prev => ({
                ...prev,
                [id]: { messages: [], status: 'ai_handling' }
            }));
        }
        setSelectedContactId(id);
        setShowNewChatModal(false);
        setSearchTerm('');
    };

    const handleSendMessage = async (text: string, isLead: boolean = false) => {
        if (!selectedContactId || !text.trim()) return;

        const newMessage: Message = {
            id: Math.random().toString(36).substr(2, 9),
            sender: isLead ? 'lead' : 'user',
            text: text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            is_ai_generated: false
        };

        // Update conversation locally
        const updatedMessages = [...(conversations[selectedContactId]?.messages || []), newMessage];
        setConversations(prev => ({
            ...prev,
            [selectedContactId]: { 
                ...prev[selectedContactId], 
                messages: updatedMessages 
            }
        }));
        setInputText('');

        // If message is from lead and we are in AI mode, trigger AI Triage
        if (isLead && conversations[selectedContactId]?.status === 'ai_handling') {
            setIsAiThinking(true);
            const triage = await processChatTriage({
                messages: updatedMessages,
                tenant_name: tenant?.name || 'AH CRM',
                contact_name: selectedContact?.first_name || 'Customer'
            });

            const aiMessage: Message = {
                id: Math.random().toString(36).substr(2, 9),
                sender: 'user',
                text: triage.reply,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                is_ai_generated: true
            };

            setConversations(prev => ({
                ...prev,
                [selectedContactId]: {
                    messages: [...updatedMessages, aiMessage],
                    status: triage.human_needed ? 'human_needed' : 'ai_handling'
                }
            }));
            setIsAiThinking(false);
        }
    };

    return (
        <div className="mt-6 h-[calc(100vh-180px)] flex bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] animate-in fade-in zoom-in-95 duration-500 relative">
            
            {/* Conversations Sidebar */}
            <div className={`w-full lg:w-[380px] border-r border-slate-100 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-950/40 ${selectedContactId ? 'hidden lg:flex' : 'flex'}`}>
                <div className="p-8 pb-6 space-y-6 shrink-0">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">Neural <span className="text-primary-crm">Inbox</span></h2>
                            <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mt-2 flex items-center">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary-crm mr-2"></span>
                                AI Triage Active
                            </p>
                        </div>
                        <button 
                            onClick={() => setShowNewChatModal(true)}
                            className="h-12 w-12 bg-slate-900 dark:bg-primary-crm text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
                        >
                            <i className="fa-solid fa-plus"></i>
                        </button>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar px-4 space-y-3 pb-8">
                    {Object.keys(conversations).length > 0 ? Object.keys(conversations).map(id => {
                        const contact = contacts.find(c => c.id === id);
                        const conv = conversations[id];
                        if (!contact) return null;
                        return (
                            <div 
                                key={id} 
                                onClick={() => setSelectedContactId(id)}
                                className={`group p-5 flex items-center space-x-4 cursor-pointer transition-all rounded-[2.2rem] border-2 ${
                                    selectedContactId === id 
                                    ? 'bg-primary-crm border-primary-crm shadow-xl shadow-primary-crm/20' 
                                    : 'bg-white dark:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-md'
                                }`}
                            >
                                <div className="relative shrink-0">
                                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center font-black text-lg transition-colors ${
                                        selectedContactId === id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-300'
                                    }`}>
                                        {contact.first_name.charAt(0)}
                                    </div>
                                    {conv.status === 'ai_handling' ? (
                                        <span className="absolute -bottom-1 -right-1 h-5 w-5 border-2 border-white dark:border-slate-800 rounded-full bg-blue-500 flex items-center justify-center shadow-sm">
                                            <i className="fa-solid fa-brain text-[8px] text-white"></i>
                                        </span>
                                    ) : (
                                        <span className="absolute -bottom-1 -right-1 h-5 w-5 border-2 border-white dark:border-slate-800 rounded-full bg-rose-500 flex items-center justify-center shadow-sm animate-pulse">
                                            <i className="fa-solid fa-hand text-[8px] text-white"></i>
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <h4 className={`text-sm font-black truncate ${selectedContactId === id ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                                            {contact.first_name}
                                        </h4>
                                        <span className={`text-[8px] font-bold uppercase tracking-widest ${selectedContactId === id ? 'text-white/60' : 'text-slate-400'}`}>Active</span>
                                    </div>
                                    <p className={`text-[11px] truncate font-bold ${selectedContactId === id ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                                        {conv.status === 'ai_handling' ? 'AI Triage responding...' : 'Human intervention needed!'}
                                    </p>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="h-full flex flex-col items-center justify-center p-10 text-center space-y-6 opacity-60 grayscale">
                            <div className="h-20 w-20 bg-slate-100 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center">
                                <i className="fa-regular fa-message text-2xl text-slate-300"></i>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">No Conversations</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Canvas */}
            <div className={`flex-1 flex flex-col bg-white dark:bg-slate-900 ${!selectedContactId ? 'hidden lg:flex' : 'flex'}`}>
                {selectedContact && activeConversation ? (
                    <>
                        {/* Header */}
                        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center z-10">
                            <div className="flex items-center space-x-5">
                                <button onClick={() => setSelectedContactId(null)} className="lg:hidden h-10 w-10 text-slate-400 hover:text-slate-900 dark:hover:text-white">
                                    <i className="fa-solid fa-chevron-left"></i>
                                </button>
                                <div className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center font-black text-primary-crm shadow-inner">
                                    {selectedContact.first_name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-tight">{selectedContact.first_name} {selectedContact.last_name}</h3>
                                    <div className="flex items-center space-x-2 mt-0.5">
                                        {activeConversation.status === 'ai_handling' ? (
                                            <>
                                                <span className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                                                <p className="text-[9px] text-blue-600 dark:text-blue-400 font-black uppercase tracking-[0.2em]">AI Handled Mode</p>
                                            </>
                                        ) : (
                                            <>
                                                <span className="h-1.5 w-1.5 bg-rose-500 rounded-full animate-pulse"></span>
                                                <p className="text-[9px] text-rose-600 dark:text-rose-400 font-black uppercase tracking-[0.2em]">Manual Override Enabled</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <button 
                                    onClick={() => setConversations(prev => ({ ...prev, [selectedContactId]: { ...prev[selectedContactId], status: 'ai_handling' }}))}
                                    className={`h-11 px-6 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeConversation.status === 'ai_handling' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-blue-600'}`}
                                >
                                    Auto Mode
                                </button>
                                <button 
                                    onClick={() => setConversations(prev => ({ ...prev, [selectedContactId]: { ...prev[selectedContactId], status: 'human_needed' }}))}
                                    className={`h-11 px-6 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeConversation.status === 'human_needed' ? 'bg-rose-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-600'}`}
                                >
                                    Take Over
                                </button>
                            </div>
                        </div>

                        {/* Message Feed */}
                        <div className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-8 custom-scrollbar scroll-smooth bg-slate-50/30 dark:bg-slate-950/20">
                            {activeConversation.messages.map((msg, i) => (
                                <div key={msg.id} className={`flex items-end space-x-4 animate-in fade-in duration-300 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                    <div className={`h-10 w-10 rounded-xl shrink-0 shadow-sm flex items-center justify-center font-black ${msg.sender === 'user' ? (msg.is_ai_generated ? 'bg-blue-600 text-white' : 'bg-slate-950 text-white') : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400'}`}>
                                        {msg.sender === 'user' ? (msg.is_ai_generated ? <i className="fa-solid fa-brain text-[10px]"></i> : <i className="fa-solid fa-user-tie text-[10px]"></i>) : selectedContact.first_name.charAt(0)}
                                    </div>
                                    <div className={`p-6 rounded-[2.2rem] max-w-[85%] md:max-w-[70%] shadow-xl border ${msg.sender === 'user' ? (msg.is_ai_generated ? 'bg-blue-600 text-white border-blue-500 rounded-br-none' : 'bg-slate-950 text-white border-slate-800 rounded-br-none') : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 rounded-bl-none'}`}>
                                        <p className="text-[13px] font-bold leading-relaxed">{msg.text}</p>
                                        <div className="flex items-center justify-end space-x-2 mt-3 pt-3 border-t border-white/10">
                                            <span className={`text-[8px] font-black uppercase tracking-widest ${msg.sender === 'user' ? 'text-white/60' : 'text-slate-400'}`}>{msg.timestamp} {msg.is_ai_generated && '• AI Agent'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isAiThinking && (
                                <div className="flex items-center space-x-3 text-[10px] font-black text-blue-500 uppercase tracking-widest animate-pulse">
                                    <i className="fa-solid fa-brain fa-spin"></i>
                                    <span>AI Agent drafting reply...</span>
                                </div>
                            )}
                        </div>

                        {/* Input Rail */}
                        <div className="p-6 lg:p-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center space-x-5 max-w-5xl mx-auto">
                                <div className="flex-1 bg-white dark:bg-slate-800 rounded-[2rem] border-2 border-slate-100 dark:border-slate-700 shadow-inner flex items-center px-6 py-4">
                                    <input 
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                                        placeholder={activeConversation.status === 'ai_handling' ? "AI is in control. Type to override..." : "Type your manual message..."} 
                                        className="w-full bg-transparent outline-none text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600" 
                                    />
                                    <button 
                                        onClick={() => handleSendMessage("Simulation: Hi, tell me about your project.", true)}
                                        className="h-10 px-4 bg-slate-100 dark:bg-slate-700 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-primary-crm transition-colors"
                                    >
                                        Simulate Lead
                                    </button>
                                </div>
                                <button 
                                    onClick={() => handleSendMessage(inputText)}
                                    className="h-14 w-14 bg-slate-950 dark:bg-primary-crm text-white rounded-2xl shadow-xl flex items-center justify-center hover:scale-110 transition-all"
                                >
                                    <i className="fa-solid fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                        <div className="h-44 w-44 bg-slate-50 dark:bg-slate-800/50 rounded-[4.5rem] flex items-center justify-center">
                            <i className="fa-solid fa-brain text-5xl text-slate-200 dark:text-slate-700"></i>
                        </div>
                        <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Neural Comm Link</h4>
                    </div>
                )}
            </div>

            {/* New Chat Modal */}
            {showNewChatModal && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setShowNewChatModal(false)}></div>
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-[3.5rem] p-10 shadow-2xl border border-white/5 overflow-hidden">
                        <h3 className="text-2xl font-black text-slate-950 dark:text-white uppercase tracking-tight mb-8">Lead Directory</h3>
                        <div className="space-y-3 overflow-y-auto max-h-[400px] custom-scrollbar">
                            {contacts.map(contact => (
                                <div 
                                    key={contact.id} 
                                    onClick={() => startChat(contact.id)}
                                    className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] flex items-center space-x-5 cursor-pointer hover:bg-primary-crm group transition-all"
                                >
                                    <div className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center font-black text-primary-crm group-hover:bg-white/20 group-hover:text-white transition-colors">
                                        {contact.first_name.charAt(0)}
                                    </div>
                                    <p className="text-sm font-black text-slate-900 dark:text-white group-hover:text-white transition-colors uppercase">{contact.first_name} {contact.last_name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inbox;
