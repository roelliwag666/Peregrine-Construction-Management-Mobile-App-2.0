import React, { useEffect, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { generateIoTData } from '../services/mockData';
import { AlertCircle, TrendingUp, Thermometer, Megaphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser, announcements } = useApp();
  const navigate = useNavigate();
  const [data, setData] = useState(generateIoTData());
  const [activeAlerts, setActiveAlerts] = useState(2);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1)];
        const lastItem = prev[prev.length - 1];
        const now = new Date();
        newData.push({
          timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          temperature: 28 + Math.random() * 5,
          noiseLevel: 60 + Math.random() * 30,
          airQuality: 90 - Math.random() * 20,
          activeWorkers: 40 + Math.floor(Math.random() * 10)
        });
        return newData;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ title, value, subtext, icon: Icon, color }: any) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-start justify-between">
      <div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{value}</h3>
        <p className={`text-xs mt-2 ${color === 'red' ? 'text-red-500' : 'text-green-500'}`}>{subtext}</p>
      </div>
      <div className={`p-3 rounded-xl ${color === 'red' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'}`}>
        <Icon size={24} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-peregrine-900 dark:text-white">Executive Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400">Real-time site monitoring & analytics</p>
        </div>
        <div className="flex space-x-2">
            <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium px-3 py-1 rounded-full flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                IoT Sensors Active
            </span>
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium px-3 py-1 rounded-full flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                AI Analysis On
            </span>
        </div>
      </div>

      {/* Announcements Widget */}
      {announcements.length > 0 && (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/50 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-800 rounded-lg text-indigo-600 dark:text-indigo-200">
                    <Megaphone size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-indigo-900 dark:text-indigo-100">Latest Announcement</h3>
                    <p className="text-sm text-indigo-800 dark:text-indigo-300 font-medium">{announcements[0].title}</p>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 line-clamp-1">{announcements[0].content}</p>
                </div>
            </div>
            <button 
                onClick={() => navigate('/announcements')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-300 hover:underline whitespace-nowrap"
            >
                View All Announcements &rarr;
            </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard 
            title="Safety Incidents" 
            value={activeAlerts.toString()} 
            subtext="2 Pending Reviews" 
            icon={AlertCircle} 
            color="red"
        />
        <StatCard 
            title="Avg Site Temp" 
            value="31°C" 
            subtext="Within safety limits" 
            icon={Thermometer} 
            color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* IoT Temperature & Air Quality Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4">Live Environmental Metrics (IoT)</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorAir" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                        <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={12} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#1e293b', color: '#fff' }} 
                            itemStyle={{ color: '#fff' }}
                        />
                        <Area type="monotone" dataKey="temperature" stroke="#ef4444" fillOpacity={1} fill="url(#colorTemp)" name="Temp (°C)" />
                        <Area type="monotone" dataKey="airQuality" stroke="#22c55e" fillOpacity={1} fill="url(#colorAir)" name="Air Quality (AQI)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Predictive Analytics */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4">Resource Utilization (AI Prediction)</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                        <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={12} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                        <Tooltip 
                            cursor={{fill: '#334155', opacity: 0.2}} 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#1e293b', color: '#fff' }} 
                        />
                        <Legend />
                        <Bar dataKey="activeWorkers" name="Active Workers" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="noiseLevel" name="Noise Load" fill="#64748b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* AI Insights Panel */}
      <div className="bg-gradient-to-r from-peregrine-900 to-peregrine-800 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
             <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                 <TrendingUp size={20} />
             </div>
             <h3 className="font-bold text-lg">AI Project Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                <h4 className="font-semibold text-peregrine-200 text-sm">Schedule Risk</h4>
                <p className="text-xl font-bold mt-1">Low (12%)</p>
                <p className="text-xs text-white/70 mt-2">Weather forecast favorable for next 10 days.</p>
            </div>
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                <h4 className="font-semibold text-peregrine-200 text-sm">Budget Projection</h4>
                <p className="text-xl font-bold mt-1">+2.4% Variance</p>
                <p className="text-xs text-white/70 mt-2">Cement costs slightly higher than estimated.</p>
            </div>
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                <h4 className="font-semibold text-peregrine-200 text-sm">Safety Compliance</h4>
                <p className="text-xl font-bold mt-1">98.5%</p>
                <p className="text-xs text-white/70 mt-2">PPE detection active on 12 cameras.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;