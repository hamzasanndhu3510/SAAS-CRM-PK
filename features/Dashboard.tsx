
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, updateDashboard, updateSalesTrend, updateFunnelStage } from '../store/store';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area 
} from 'recharts';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state: RootState) => state.crm);
  const [isTinkerOpen, setIsTinkerOpen] = useState(false);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  return (
    <div className="relative min-h-screen max-w-[1600px] mx-auto animate-in fade-in duration-700">
      
      {/* Tinker Sidebar Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-80 bg-slate-900 text-white shadow-2xl z-[150] transform transition-transform duration-500 ease-in-out p-6 sm:p-8 overflow-y-auto custom-scrollbar border-l border-white/10 ${isTinkerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center mb-10">
            <div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary-crm">Neural Lab</h3>
                <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Manual Override Engine</p>
            </div>
            <button onClick={() => setIsTinkerOpen(false)} className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                <i className="fa-solid fa-xmark text-lg"></i>
            </button>
        </div>

        <div className="space-y-12">
            <div className="space-y-6">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">Primary KPIs</h4>
                <div className="space-y-4">
                    {Object.entries(dashboard.summary).map(([key, value]) => (
                        <div key={key} className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400 uppercase">{key.replace(/([A-Z])/g, ' $1')}</label>
                            <input 
                                type="number" 
                                value={value}
                                onChange={(e) => dispatch(updateDashboard({ summary: { ...dashboard.summary, [key]: Number(e.target.value) } }))}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary-crm transition-all" 
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 lg:mb-12">
        <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-950 dark:text-white tracking-tight uppercase leading-none">Dashboard <span className="text-primary-crm">Core</span></h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">Real-time Neural Visualization</p>
        </div>
        <button 
          onClick={() => setIsTinkerOpen(true)}
          className="w-full sm:w-auto px-8 py-4 bg-slate-950 dark:bg-primary-crm text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center"
        >
          <i className="fa-solid fa-sliders mr-3"></i> Tinker Neural Lab
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-6 lg:mb-8">
        {/* FIXED: Added min-h and min-w-0 to the chart container to resolve Recharts dimension error */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col min-h-[450px] min-w-0">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
            <div>
              <p className="text-[12px] font-black text-slate-950 dark:text-white uppercase tracking-tight">Net Revenue Stream</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Growth Velocity Analytics</p>
            </div>
            <div className="text-left sm:text-right">
                <h3 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white">PKR {(dashboard.summary.revenue / 1000).toFixed(1)}K</h3>
                <p className="text-[10px] font-black text-emerald-500 uppercase mt-1">
                  <i className="fa-solid fa-arrow-trend-up mr-1"></i> +12.4% Target Pace
                </p>
            </div>
          </div>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="99%" height="100%">
                <AreaChart data={dashboard.salesTrend}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="opacity-10" />
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', background: '#0f172a', color: '#fff', fontSize: '10px', fontWeight: 'bold'}}
                  />
                  <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 lg:gap-8">
            <div className="bg-slate-950 text-white p-8 lg:p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden flex flex-col justify-center min-h-[180px]">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <i className="fa-solid fa-chart-line text-[5rem]"></i>
                </div>
                <p className="text-[10px] font-black text-primary-crm uppercase tracking-widest mb-2">Total Orders</p>
                <h4 className="text-4xl lg:text-5xl font-black">{dashboard.summary.orders.toLocaleString()}</h4>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 lg:p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center min-h-[180px]">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Avg Order Value</p>
                <h4 className="text-3xl lg:text-4xl font-black text-slate-950 dark:text-white">PKR {dashboard.summary.avgOrderValue.toLocaleString()}</h4>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
