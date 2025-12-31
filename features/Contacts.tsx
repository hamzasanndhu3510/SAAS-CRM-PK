
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, addContact } from '../store/store';
import { Contact } from '../types';

const Contacts: React.FC = () => {
    const dispatch = useDispatch();
    const contacts = useSelector((state: RootState) => state.crm.contacts);
    // Get both tenant and user from auth state
    const { tenant, user } = useSelector((state: RootState) => state.auth);

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ firstName: '', lastName: '', phone: '', email: '', city: '' });

    const handleAdd = () => {
        if (!formData.firstName || !formData.phone) return;
        
        // Fix: Added assigned_to property to comply with Contact interface
        const contact: Contact = {
            id: Math.random().toString(36).substr(2, 9),
            tenant_id: tenant?.id || 't1',
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            email: formData.email,
            city: formData.city,
            tags: ['New Lead'],
            assigned_to: user?.id || '',
            created_at: new Date().toISOString()
        };
        
        dispatch(addContact(contact));
        setShowForm(false);
        setFormData({ firstName: '', lastName: '', phone: '', email: '', city: '' });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-950 uppercase tracking-tight">Lead Directory</h2>
                    <p className="text-slate-500 text-sm font-medium">Managing {contacts.length} regional leads</p>
                </div>
                <button 
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest"
                >
                    <i className="fa-solid fa-user-plus mr-2"></i> Add Lead
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">City</th>
                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</th>
                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {contacts.map(c => (
                            <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-8 py-5 font-bold text-slate-900">{c.first_name} {c.last_name}</td>
                                <td className="px-8 py-5 text-sm text-slate-500 font-medium">{c.city || 'N/A'}</td>
                                <td className="px-8 py-5 text-sm font-bold text-blue-600">{c.phone}</td>
                                <td className="px-8 py-5 text-sm text-slate-400">{c.email}</td>
                                <td className="px-8 py-5 text-right">
                                    <button className="text-slate-300 hover:text-blue-600 transition-colors"><i className="fa-solid fa-pen-to-square"></i></button>
                                </td>
                            </tr>
                        ))}
                        {contacts.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-8 py-20 text-center text-slate-300">
                                    <div className="flex flex-col items-center">
                                        <i className="fa-solid fa-users-slash text-4xl mb-4"></i>
                                        <p className="text-xs font-black uppercase tracking-widest">No leads registered in this tenant.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowForm(false)}></div>
                    <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl">
                        <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">Manual Entry</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">First Name</label>
                                <input value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Last Name</label>
                                <input value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none" />
                            </div>
                        </div>
                        <div className="mt-4 space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Phone Number</label>
                                <input placeholder="+92..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">City</label>
                                <input placeholder="Lahore, Karachi..." value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none" />
                            </div>
                        </div>
                        <div className="mt-8 flex space-x-4">
                            <button onClick={() => setShowForm(false)} className="flex-1 font-black text-[10px] uppercase tracking-widest text-slate-400">Back</button>
                            <button onClick={handleAdd} className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">Save Lead</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Contacts;
