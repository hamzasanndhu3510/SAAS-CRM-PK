
import React, { useState } from 'react';

const ChatBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-8 right-8 z-[200]">
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-3xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
                    <div className="p-6 bg-slate-950 text-white flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 bg-primary-crm rounded-xl flex items-center justify-center text-xs">
                                <i className="fa-solid fa-brain"></i>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest">Neural Agent</h4>
                                <div className="flex items-center space-x-2">
                                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                    <span className="text-[8px] font-bold text-slate-500 uppercase">Always Ready</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white"><i className="fa-solid fa-xmark"></i></button>
                    </div>
                    <div className="h-80 p-6 flex flex-col justify-center items-center text-center space-y-4">
                        <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-700">
                            <i className="fa-solid fa-message text-2xl"></i>
                        </div>
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Comm Link Initializing...</p>
                    </div>
                    <div className="p-6 border-t border-slate-50 dark:border-slate-800">
                        <div className="flex bg-slate-50 dark:bg-slate-800 p-2 rounded-2xl items-center border border-slate-100 dark:border-slate-700">
                            <input placeholder="Ask Gemini..." className="flex-1 bg-transparent px-4 py-2 text-xs font-bold outline-none dark:text-white" />
                            <button className="h-10 w-10 bg-primary-crm text-white rounded-xl flex items-center justify-center shadow-lg"><i className="fa-solid fa-paper-plane text-[10px]"></i></button>
                        </div>
                    </div>
                </div>
            )}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="h-16 w-16 bg-slate-950 dark:bg-primary-crm text-white rounded-[1.5rem] flex items-center justify-center shadow-3xl hover:scale-110 active:scale-95 transition-all relative group"
            >
                <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-wand-magic-sparkles'} text-xl transition-transform duration-500`}></i>
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
                
                {!isOpen && (
                    <div className="absolute right-20 bg-slate-900 text-white text-[9px] font-black uppercase px-4 py-2 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl tracking-widest">
                        Neural Support Online
                    </div>
                )}
            </button>
        </div>
    );
};

export default ChatBot;
