import React from 'react';
import { Users, DollarSign, Activity, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, trendUp }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:scale-150"></div>
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div>
        <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-100">{value}</h3>
      </div>
      <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/50 text-purple-400">
        <Icon size={24} />
      </div>
    </div>
    <div className="flex items-center gap-2 text-sm relative z-10">
      <span className={`flex items-center gap-1 font-medium ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
        {trendUp ? <TrendingUp size={14} /> : <TrendingUp size={14} className="rotate-180" />}
        {trend}
      </span>
      <span className="text-slate-500">vs last month</span>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight mb-1">Overview</h1>
          <p className="text-slate-400 text-sm">Welcome to your dashboard summary.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-slate-100 border border-slate-700 hover:border-slate-600 rounded-lg text-sm font-medium transition-all">
            Export Report
          </button>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-purple-500/20 transition-all">
            New Campaign
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value="24,592" icon={Users} trend="+12.5%" trendUp={true} />
        <StatCard title="Revenue" value="$84,234" icon={DollarSign} trend="+8.2%" trendUp={true} />
        <StatCard title="Active Sessions" value="1,249" icon={Activity} trend="-2.4%" trendUp={false} />
        <StatCard title="Conversion Rate" value="3.42%" icon={TrendingUp} trend="+1.1%" trendUp={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-100">Revenue Analytics</h3>
            <select className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-1.5 outline-none">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="flex-1 flex items-center justify-center text-slate-500 border border-dashed border-slate-700/50 rounded-xl bg-slate-800/20">
            Chart Placeholder (Requires Recharts/Chart.js)
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-purple-500 ring-4 ring-slate-800 relative z-10">
                  {i !== 5 && <div className="absolute top-2 left-1/2 -ml-[1px] w-[2px] h-10 bg-slate-800"></div>}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-300">New user registered</p>
                  <p className="text-xs text-slate-500 mt-1">{i * 2} hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
