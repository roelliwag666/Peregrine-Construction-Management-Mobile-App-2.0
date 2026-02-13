
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowRight, 
  Flag, 
  FileText, 
  ShieldAlert, 
  Users, 
  MoreHorizontal,
  ChevronRight,
  Filter,
  // Fix: Added CheckSquare to the lucide-react import list
  CheckSquare
} from 'lucide-react';

const ExecutiveDecisionCenter = () => {
  const { executiveDecisions, processExecutiveDecision, projects, users } = useApp();
  const [filter, setFilter] = useState<'all' | 'pending' | 'processed'>('pending');

  const filteredDecisions = executiveDecisions.filter(d => {
    if (filter === 'all') return true;
    if (filter === 'pending') return d.status === 'pending';
    return d.status !== 'pending';
  });

  const getIcon = (type: string) => {
    switch(type) {
      case 'MILESTONE': return <Flag size={20} className="text-blue-500" />;
      case 'DOC_SIGN_OFF': return <FileText size={20} className="text-indigo-500" />;
      case 'HSE_CLOSURE': return <ShieldAlert size={20} className="text-red-500" />;
      case 'RESOURCE_TRANSFER': return <Users size={20} className="text-orange-500" />;
      default: return <Clock size={20} className="text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Executive Decision Center</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Bottleneck resolution & strategic project oversight</p>
        </div>
        <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          {['pending', 'processed', 'all'].map(t => (
            <button 
              key={t}
              onClick={() => setFilter(t as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${filter === t ? 'bg-peregrine-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredDecisions.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-100 dark:border-slate-700">
            <CheckCircle size={48} className="mx-auto mb-4 text-slate-200" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No items currently awaiting decision</p>
          </div>
        ) : (
          filteredDecisions.map(decision => {
            const project = projects.find(p => p.id === decision.projectId);
            const requester = users.find(u => u.id === decision.requestedBy);

            return (
              <div key={decision.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all animate-in fade-in slide-in-from-bottom-2">
                <div className="p-6 flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-slate-50 dark:bg-slate-700 rounded-xl">
                        {getIcon(decision.type)}
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{decision.type.replace(/_/g, ' ')}</span>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{decision.title}</h3>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                      {decision.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-50 dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-peregrine-100 text-peregrine-700 flex items-center justify-center text-[10px] font-black">P</div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{project?.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <img src={requester?.avatar} className="w-6 h-6 rounded-full border border-white dark:border-slate-600" alt="" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Requested by {requester?.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">
                        {decision.timestamp}
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col justify-end gap-3 md:min-w-[160px] md:border-l border-slate-100 dark:border-slate-700 md:pl-6">
                    {decision.status === 'pending' ? (
                      <>
                        <button 
                          onClick={() => processExecutiveDecision(decision.id, 'approved')}
                          className="flex-1 md:flex-none py-3 px-4 bg-peregrine-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-peregrine-100 dark:shadow-none hover:bg-peregrine-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={16} /> Approve
                        </button>
                        <button 
                          onClick={() => processExecutiveDecision(decision.id, 'rejected')}
                          className="flex-1 md:flex-none py-3 px-4 bg-white dark:bg-slate-700 text-slate-500 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-600 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                          <XCircle size={16} /> Send Back
                        </button>
                      </>
                    ) : (
                      <div className={`py-2 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 ${decision.status === 'approved' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                        {decision.status === 'approved' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                        {decision.status}
                      </div>
                    )}
                    <button className="hidden md:flex items-center justify-center py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">
                      View Details <ChevronRight size={14} className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="bg-slate-900 dark:bg-slate-800 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h4 className="text-xl font-black uppercase tracking-tighter mb-2">Strategy Overview</h4>
            <p className="text-white/70 text-sm leading-relaxed max-w-lg">
              These requests represent cross-departmental bottlenecks. Your decision here clears the path for Project Managers to proceed with high-risk site activities.
            </p>
          </div>
          <div className="flex gap-4">
             <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10 text-center min-w-[120px]">
                <p className="text-2xl font-black mb-1">{executiveDecisions.filter(d => d.status === 'pending').length}</p>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Pending Gates</p>
             </div>
             <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10 text-center min-w-[120px]">
                <p className="text-2xl font-black mb-1">{executiveDecisions.filter(d => d.status === 'approved').length}</p>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Cleared Today</p>
             </div>
          </div>
        </div>
        <div className="absolute top-[-20px] right-[-20px] opacity-10">
          <CheckSquare size={140} />
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDecisionCenter;
