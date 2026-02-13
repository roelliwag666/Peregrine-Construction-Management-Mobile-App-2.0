
import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { UserRole, LeaveRequest } from '../types';
import { AlertCircle, Calendar, Clock, Info, User, CheckCircle, XCircle, MessageSquare, History, FileText, Banknote, Search, ChevronDown } from 'lucide-react';

const TimeSheet = () => {
  const { currentUser, leaveRequests, submitLeaveRequest, updateLeaveStatus, users } = useApp();
  const [activeTab, setActiveTab] = useState<'leave' | 'approvals' | 'history'>('leave');
  
  const [leaveType, setLeaveType] = useState('Vacation');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [hrComment, setHrComment] = useState('');
  const [historySearch, setHistorySearch] = useState('');

  if (!currentUser) return null;

  const isHR = currentUser.role === UserRole.HR;
  const canApprove = isHR;
  const today = new Date().toISOString().split('T')[0];

  const leaveDuration = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 0;
  }, [startDate, endDate]);

  const handleLeaveSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (leaveDuration <= 0) return alert('End date must be after start date.');
      submitLeaveRequest({
          id: `lr_${Date.now()}`,
          userId: currentUser.id,
          type: leaveType as any,
          startDate,
          endDate,
          reason,
          status: 'pending'
      });
      alert(leaveType === 'Service Incentive' ? 'Request submitted (Unpaid).' : 'Request submitted (Paid).');
      setStartDate(''); setEndDate(''); setReason('');
  };

  const handleStatusUpdate = (status: 'approved' | 'rejected') => {
      if (reviewingId) {
          updateLeaveStatus(reviewingId, status, hrComment);
          setReviewingId(null); setHrComment('');
      }
  };

  const selectedReview = leaveRequests.find(l => l.id === reviewingId);
  const employeeInReview = users.find(u => u.id === selectedReview?.userId);

  const processedHistory = leaveRequests
    .filter(l => l.status !== 'pending')
    .filter(l => {
      if (!historySearch) return true;
      const u = users.find(usr => usr.id === l.userId);
      return u?.name.toLowerCase().includes(historySearch.toLowerCase());
    })
    .sort((a, b) => (b.processedDate || '').localeCompare(a.processedDate || ''));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Attendance & Leave</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Personal request portal & workforce management</p>
          </div>
          {isHR && (
              <div className="hidden md:flex items-center gap-2 bg-peregrine-900 text-white px-4 py-2 rounded-xl border-b-2 border-peregrine-700 shadow-lg">
                  <User size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">HR Command Station</span>
              </div>
          )}
      </div>
      
      <div className="flex space-x-1 bg-white dark:bg-slate-800 p-1 rounded-xl w-full md:w-fit shadow-sm border border-slate-200 dark:border-slate-700">
          <button onClick={() => setActiveTab('leave')} className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'leave' ? 'bg-peregrine-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
              <Calendar size={16} className="mr-2" /> Request
          </button>
          {canApprove && (
            <>
              <button onClick={() => setActiveTab('approvals')} className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center ${activeTab === 'approvals' ? 'bg-peregrine-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                  <Clock size={16} className="mr-2" /> Review
                  {leaveRequests.filter(l => l.status === 'pending').length > 0 && (
                      <span className="ml-2 w-5 h-5 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-black">{leaveRequests.filter(l => l.status === 'pending').length}</span>
                  )}
              </button>
              <button onClick={() => setActiveTab('history')} className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center ${activeTab === 'history' ? 'bg-peregrine-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                  <History size={16} className="mr-2" /> History Log
              </button>
            </>
          )}
      </div>

      {activeTab === 'leave' && (
          <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 h-fit">
                  <h3 className="font-black text-xs uppercase tracking-widest mb-6 text-slate-400 flex items-center"><FileText size={18} className="mr-2 text-peregrine-600" /> New Requisition</h3>
                  <form onSubmit={handleLeaveSubmit} className="space-y-5">
                      <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Leave Category</label>
                          <select className="w-full p-4 border rounded-2xl bg-slate-50 dark:bg-slate-900/50 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-peregrine-500 outline-none font-bold text-sm" value={leaveType} onChange={e => setLeaveType(e.target.value)}>
                              <option value="Vacation">Vacation Leave (Paid)</option>
                              <option value="Sick">Sick Leave (Paid)</option>
                              <option value="Emergency">Emergency Leave (Paid)</option>
                              <option value="Service Incentive">Service Incentive Leave (Unpaid)</option>
                          </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Start Date</label>
                              <input type="date" required min={today} className="w-full p-4 border rounded-2xl bg-slate-50 dark:bg-slate-900/50 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-peregrine-500 outline-none text-xs font-bold" value={startDate} onChange={e => setStartDate(e.target.value)} />
                          </div>
                          <div>
                              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">End Date</label>
                              <input type="date" required min={startDate || today} className="w-full p-4 border rounded-2xl bg-slate-50 dark:bg-slate-900/50 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-peregrine-500 outline-none text-xs font-bold" value={endDate} onChange={e => setEndDate(e.target.value)} />
                          </div>
                      </div>
                      {leaveDuration > 0 && (
                          <div className={`${leaveType === 'Service Incentive' ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200'} border p-4 rounded-2xl animate-in zoom-in duration-200`}>
                              <div className="flex items-start gap-3">
                                  {leaveType === 'Service Incentive' ? <AlertCircle size={20} className="text-orange-600" /> : <Banknote size={20} className="text-blue-600" />}
                                  <div>
                                      <h4 className="text-xs font-black uppercase tracking-tight">{leaveType === 'Service Incentive' ? 'No Salary/Payslip Impact' : 'Full Payment Applied'}</h4>
                                      <p className="text-[10px] mt-1 font-bold leading-relaxed">{leaveType === 'Service Incentive' ? 'This leave will not be compensated.' : 'Standard salary will be disbursed for these days.'}</p>
                                  </div>
                              </div>
                          </div>
                      )}
                      <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Reasoning / Supporting Remarks</label>
                          <textarea required className="w-full p-4 border rounded-2xl bg-slate-50 dark:bg-slate-900/50 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-peregrine-500 outline-none text-sm leading-relaxed" rows={3} value={reason} onChange={e => setReason(e.target.value)} placeholder="..." />
                      </div>
                      <button type="submit" disabled={leaveDuration <= 0} className="w-full bg-peregrine-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-peregrine-700 shadow-xl shadow-peregrine-100 dark:shadow-none transition-all active:scale-95 disabled:opacity-50">Submit Requisition</button>
                  </form>
              </div>

              <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col">
                  <h3 className="font-black text-xs uppercase tracking-widest mb-6 text-slate-400 flex items-center"><History size={18} className="mr-2 text-peregrine-600" /> My Request Log</h3>
                  <div className="space-y-4 flex-1 overflow-y-auto max-h-[500px] pr-2 no-scrollbar">
                      {leaveRequests.filter(r => r.userId === currentUser.id).length === 0 ? (
                          <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-[10px]">No logs found</div>
                      ) : (
                          leaveRequests.filter(r => r.userId === currentUser.id).sort((a,b) => b.id.localeCompare(a.id)).map(req => (
                              <div key={req.id} className="p-5 bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-700 rounded-2xl">
                                  <div className="flex justify-between items-start mb-2">
                                      <div>
                                          <div className="flex items-center gap-2 mb-1">
                                              <span className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-wider">{req.type}</span>
                                              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${req.status === 'approved' ? 'bg-green-100 text-green-700' : req.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{req.status}</span>
                                          </div>
                                          <p className="text-[10px] text-slate-500 font-black uppercase">{req.startDate} → {req.endDate}</p>
                                      </div>
                                  </div>
                                  {req.hrComment && (
                                      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                                          <p className="text-[9px] font-black text-blue-600 uppercase mb-1">HR Note:</p>
                                          <p className="text-xs text-blue-800 dark:text-blue-300 font-bold leading-tight">{req.hrComment}</p>
                                      </div>
                                  )}
                              </div>
                          ))
                      )}
                  </div>
              </div>
          </div>
      )}

      {activeTab === 'approvals' && canApprove && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in fade-in duration-300">
              <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 flex justify-between items-center">
                <h3 className="font-black text-lg text-slate-900 dark:text-white uppercase tracking-tighter">Review Station</h3>
                <span className="text-[10px] bg-white dark:bg-slate-600 px-3 py-1 rounded-full border font-black text-slate-500 uppercase">{leaveRequests.filter(l => l.status === 'pending').length} Actionable</span>
              </div>
              <div className="overflow-x-auto">
                  <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
                          <tr>
                              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Employee</th>
                              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Request Details</th>
                              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Timeline</th>
                              <th className="p-4 text-right"></th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                          {leaveRequests.filter(l => l.status === 'pending').map(req => {
                              const u = users.find(user => user.id === req.userId);
                              return (
                                  <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                      <td className="p-4">
                                          <div className="flex items-center">
                                              <img src={u?.avatar} className="w-10 h-10 rounded-full mr-3 border-2 border-white shadow-sm" alt="" />
                                              <div><span className="font-black text-slate-900 dark:text-white text-sm block leading-tight">{u?.name}</span><span className="text-[10px] text-slate-500 font-bold uppercase">{u?.position}</span></div>
                                          </div>
                                      </td>
                                      <td className="p-4">
                                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg ${req.type === 'Service Incentive' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'}`}>{req.type}</span>
                                          <div className="text-xs text-slate-400 font-bold mt-1 max-w-xs truncate">"{req.reason}"</div>
                                      </td>
                                      <td className="p-4">
                                          <div className="text-sm font-black text-slate-700 dark:text-slate-200">{req.startDate}</div>
                                          <div className="text-[9px] text-slate-400 font-black uppercase">To {req.endDate}</div>
                                      </td>
                                      <td className="p-4 text-right">
                                          <button onClick={() => setReviewingId(req.id)} className="bg-peregrine-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-peregrine-700 transition-all active:scale-95">Evaluate</button>
                                      </td>
                                  </tr>
                              );
                          })}
                      </tbody>
                  </table>
              </div>
          </div>
      )}

      {activeTab === 'history' && canApprove && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in fade-in duration-300">
              <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h3 className="font-black text-lg text-slate-900 dark:text-white uppercase tracking-tighter">Processed History Log</h3>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Audit trail of all finalized leave requests</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    <input 
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:ring-2 focus:ring-peregrine-500 outline-none" 
                        placeholder="Search employee..."
                        value={historySearch}
                        onChange={e => setHistorySearch(e.target.value)}
                    />
                </div>
              </div>
              <div className="overflow-x-auto">
                  <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
                          <tr>
                              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Employee</th>
                              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Leave Period</th>
                              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Processed On</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                          {processedHistory.map(req => {
                              const u = users.find(usr => usr.id === req.userId);
                              return (
                                  <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                                      <td className="p-4">
                                          <div className="flex items-center">
                                              <img src={u?.avatar} className="w-8 h-8 rounded-full mr-3 border border-slate-100 shadow-xs" alt="" />
                                              <div>
                                                  <span className="font-bold text-slate-800 dark:text-white text-xs block leading-tight">{u?.name}</span>
                                                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">{req.type}</span>
                                              </div>
                                          </div>
                                      </td>
                                      <td className="p-4">
                                          <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{req.startDate} → {req.endDate}</div>
                                      </td>
                                      <td className="p-4">
                                          <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${req.status === 'approved' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                              {req.status === 'approved' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                                              {req.status}
                                          </div>
                                      </td>
                                      <td className="p-4 text-right md:text-left">
                                          <span className="text-[10px] font-black uppercase text-slate-400">{req.processedDate || 'Archive'}</span>
                                      </td>
                                  </tr>
                              );
                          })}
                          {processedHistory.length === 0 && (
                              <tr><td colSpan={4} className="p-20 text-center text-slate-400 font-black uppercase text-[10px] tracking-widest">No processed records found</td></tr>
                          )}
                      </tbody>
                  </table>
              </div>
          </div>
      )}

      {reviewingId && selectedReview && employeeInReview && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in duration-200">
                  <div className={`p-6 ${selectedReview.type === 'Service Incentive' ? 'bg-orange-600' : 'bg-peregrine-900'} text-white flex items-center justify-between`}>
                      <div className="flex items-center gap-4">
                          <img src={employeeInReview.avatar} className="w-14 h-14 rounded-full border-2 border-white/20 shadow-lg" alt="" />
                          <div><h3 className="text-xl font-black uppercase tracking-tighter leading-tight">{employeeInReview.name}</h3><p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Employee Review</p></div>
                      </div>
                      <button onClick={() => {setReviewingId(null); setHrComment('');}} className="p-2 hover:bg-white/10 rounded-full transition-colors"><XCircle size={24} /></button>
                  </div>
                  <div className="p-8 space-y-6">
                      <div className="grid grid-cols-2 gap-8">
                          <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Leave Type</label><div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl font-black text-xs uppercase text-slate-700 dark:text-slate-300">{selectedReview.type}</div></div>
                          <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Span</label><div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl font-black text-xs uppercase text-slate-700 dark:text-slate-300">{selectedReview.startDate} → {selectedReview.endDate}</div></div>
                      </div>
                      <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Reason / Justification</label><div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border italic text-sm text-slate-700 dark:text-slate-300 leading-relaxed">"{selectedReview.reason}"</div></div>
                      <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">HR Audit Remarks</label>
                          <textarea className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-peregrine-500 outline-none text-sm font-bold text-slate-900 dark:text-white" placeholder="Provide feedback or rejection reason..." rows={3} value={hrComment} onChange={e => setHrComment(e.target.value)} />
                      </div>
                      <div className="flex gap-4 pt-2">
                          <button onClick={() => handleStatusUpdate('rejected')} className="flex-1 py-4 bg-slate-100 text-red-600 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-red-50 transition-all active:scale-95 flex items-center justify-center gap-2">Reject</button>
                          <button onClick={() => handleStatusUpdate('approved')} className="flex-1 py-4 bg-green-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-green-700 shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2">Approve</button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default TimeSheet;
