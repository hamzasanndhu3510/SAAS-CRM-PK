
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard: React.FC<{ title: string; value: string; icon: string; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-all hover:border-blue-200 group">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
        <h3 className="text-2xl font-black text-slate-900 mt-1">{value}</h3>
      </div>
      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 ${color}`}>
        <i className={icon}></i>
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { tenant } = useSelector((state: RootState) => state.auth);
  const { opportunities, contacts } = useSelector((state: RootState) => state.crm);

  const totalValue = opportunities.reduce((acc, curr) => acc + curr.value, 0);
  const wonValue = opportunities.filter(o => o.stage === 'closed').reduce((acc, curr) => acc + curr.value, 0);
  
  const chartData = [
    { name: 'Total Pipeline', value: totalValue / 1000 },
    { name: 'Closed Revenue', value: wonValue / 1000 },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-950 tracking-tight uppercase">Operational HQ</h2>
          <p className="text-slate-500 font-medium mt-1">Live metrics for {tenant?.name}</p>
        </div>
        <div className="flex space-x-3">
            <button onClick={() => window.location.hash = '#/pipelines'} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl">
                <i className="fa-solid fa-plus mr-2"></i> Create Data Point
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Pipeline Value" value={`Rs. ${(totalValue/1000).toFixed(1)}k`} icon="fa-solid fa-money-bill-trend-up" color="bg-blue-50 text-blue-600" />
        <StatCard title="Closed Revenue" value={`Rs. ${(wonValue/1000).toFixed(1)}k`} icon="fa-solid fa-vault" color="bg-emerald-50 text-emerald-600" />
        <StatCard title="Active Leads" value={contacts.length.toString()} icon="fa-solid fa-users" color="bg-slate-100 text-slate-900" />
        <StatCard title="Opportunities" value={opportunities.length.toString()} icon="fa-solid fa-briefcase" color="bg-blue-900 text-white" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm min-w-0">
          <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-8">Value Distribution (k PKR)</h3>
          {/* Fix: Explicit height and width on the wrapper div for Recharts calculation */}
          <div style={{ width: '100%', height: '300px' }} className="block">
            {opportunities.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}} 
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: '900', fontSize: '12px' }}
                    />
                    <Bar dataKey="value" fill="var(--primary-crm)" radius={[8, 8, 0, 0]} barSize={60} />
                  </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-100 rounded-3xl">
                    <i className="fa-solid fa-chart-simple text-4xl mb-2"></i>
                    <p className="text-xs font-black uppercase tracking-widest">No Data Points Yet</p>
                </div>
            )}
          </div>
        </div>

        <div className="bg-slate-950 text-white p-8 rounded-[2.5rem] shadow-2xl flex flex-col">
            <h3 className="text-lg font-black uppercase tracking-tight mb-6">Setup Wizard</h3>
            <div className="space-y-4">
                <div className={`p-4 rounded-2xl border ${contacts.length > 0 ? 'bg-blue-900/20 border-blue-500' : 'bg-white/5 border-white/10'}`}>
                    <div className="flex items-center space-x-3">
                        <i className={`fa-solid ${contacts.length > 0 ? 'fa-circle-check text-blue-400' : 'fa-circle-dot text-slate-600'}`}></i>
                        <span className="text-xs font-bold uppercase">1. Add your first Lead</span>
                    </div>
                </div>
                <div className={`p-4 rounded-2xl border ${opportunities.length > 0 ? 'bg-blue-900/20 border-blue-500' : 'bg-white/5 border-white/10'}`}>
                    <div className="flex items-center space-x-3">
                        <i className={`fa-solid ${opportunities.length > 0 ? 'fa-circle-check text-blue-400' : 'fa-circle-dot text-slate-600'}`}></i>
                        <span className="text-xs font-bold uppercase">2. Create a Pipeline Deal</span>
                    </div>
                </div>
                <div className={`p-4 rounded-2xl border bg-white/5 border-white/10`}>
                    <div className="flex items-center space-x-3">
                        <i className="fa-solid fa-circle-dot text-slate-600"></i>
                        <span className="text-xs font-bold uppercase">3. Perform AI Lead Scan</span>
                    </div>
                </div>
            </div>
            <div className="mt-auto pt-8">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-4">Quick Link</p>
                <button onClick={() => window.location.hash = '#/pipelines'} className="w-full py-4 bg-primary-crm rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary-crm/20">Start Tinkering</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
