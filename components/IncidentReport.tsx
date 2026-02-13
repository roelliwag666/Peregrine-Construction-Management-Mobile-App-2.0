
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Camera, MapPin, AlertTriangle, ShieldAlert, Activity, ArrowLeft, Send, CheckCircle, Clock, Lock, XCircle } from 'lucide-react';
import { IncidentReport as IncidentType, UserRole } from '../types';

const IncidentReport = () => {
  const { addIncident, currentUser, incidents, users, updateIncidentStatus, replyToIncident } = useApp();
  const [activeType, setActiveType] = useState<'NEAR_MISS' | 'ACCIDENT' | 'SECURITY' | null>(null);
  const [viewMode, setViewMode] = useState<'form' | 'list' | 'detail'>('form');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  
  // Form State
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Permission Logic - UPDATED: Strictly limited to HSE designated personnel
  const isHSE = currentUser?.position.toLowerCase().includes('hse') || 
                currentUser?.position.toLowerCase().includes('safety');

  const selectedIncident = incidents.find(i => i.id === selectedIncidentId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeType || !currentUser) return;
    
    setIsSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
        addIncident({
            id: `inc_${Date.now()}`,
            type: activeType,
            description,
            location,
            date: new Date().toLocaleString(),
            reporterId: currentUser.id,
            status: 'pending',
            replies: []
        });
        setIsSubmitting(false);
        setActiveType(null); // Reset
        setDescription('');
        setLocation('');
        setPhoto(null);
        alert('Report submitted successfully. The HSE Officer has been notified for review.');
        setViewMode('list');
    }, 1500);
  };

  const handleReply = (e: React.FormEvent) => {
      e.preventDefault();
      if (selectedIncidentId && replyText.trim()) {
          replyToIncident(selectedIncidentId, replyText);
          setReplyText('');
      }
  };

  const handlePhotoCapture = () => {
      // Simulate camera capture
      setPhoto('https://picsum.photos/400/300?grayscale');
  };

  // Render Detailed View (Read/Reply)
  if (viewMode === 'detail' && selectedIncident) {
      const reporter = users.find(u => u.id === selectedIncident.reporterId);
      const isReporter = selectedIncident.reporterId === currentUser?.id;

      // SECURITY CHECK: Only the designated HSE officer or the original reporter can view details
      if (!isHSE && !isReporter) {
          return (
              <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-3xl p-12 text-center shadow-xl border border-red-100 dark:border-red-900/30">
                  <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Lock size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">Access Restricted</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-8">You are not authorized to view or evaluate this incident report as it was not submitted by you.</p>
                  <button 
                    onClick={() => setViewMode('list')} 
                    className="bg-peregrine-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-peregrine-700 transition-all active:scale-95"
                  >
                      Return to My Reports
                  </button>
              </div>
          );
      }
      
      return (
          <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 flex flex-col h-[calc(100vh-140px)]">
              <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-700/50 rounded-t-2xl">
                  <button onClick={() => setViewMode('list')} className="text-slate-500 hover:text-slate-700 flex items-center text-sm font-medium transition-colors">
                      <ArrowLeft size={16} className="mr-1" /> Back to Log
                  </button>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${selectedIncident.status === 'reviewed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {selectedIncident.status}
                  </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
                  {/* Report Header */}
                  <div className="flex items-start mb-6">
                      <div className={`p-3 rounded-xl mr-4 ${
                          selectedIncident.type === 'ACCIDENT' ? 'bg-red-100 text-red-600' :
                          selectedIncident.type === 'SECURITY' ? 'bg-slate-100 text-slate-600' :
                          'bg-yellow-100 text-yellow-600'
                      }`}>
                          {selectedIncident.type === 'ACCIDENT' && <AlertTriangle size={24} />}
                          {selectedIncident.type === 'SECURITY' && <ShieldAlert size={24} />}
                          {selectedIncident.type === 'NEAR_MISS' && <Activity size={24} />}
                      </div>
                      <div>
                          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1 uppercase tracking-tight">{selectedIncident.type.replace('_', ' ')}</h2>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                              Reported by <span className="font-bold text-slate-700 dark:text-slate-200">{reporter?.name}</span>
                          </p>
                          <p className="text-xs text-slate-400 flex items-center mt-1">
                              <Clock size={12} className="mr-1" /> {selectedIncident.date}
                          </p>
                          <p className="text-xs text-slate-400 flex items-center mt-1">
                              <MapPin size={12} className="mr-1" /> {selectedIncident.location}
                          </p>
                      </div>
                  </div>

                  {/* Report Body */}
                  <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl mb-6 border border-slate-100 dark:border-slate-700/50">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Incident Description</h4>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{selectedIncident.description}</p>
                  </div>
                  
                  {/* Action for HSE Only - UPDATED */}
                  {isHSE && selectedIncident.status === 'pending' ? (
                      <div className="flex justify-center mb-8">
                          <button 
                            onClick={() => {
                                updateIncidentStatus(selectedIncident.id, 'reviewed');
                                alert("Report marked as reviewed by HSE Officer.");
                            }}
                            className="bg-green-600 text-white px-8 py-3 rounded-xl flex items-center text-sm font-bold hover:bg-green-700 shadow-lg shadow-green-100 dark:shadow-none transition-all active:scale-95"
                          >
                              <CheckCircle size={18} className="mr-2" /> Mark as Reviewed
                          </button>
                      </div>
                  ) : selectedIncident.status === 'pending' && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 mb-6 flex items-center gap-3">
                          <Lock size={16} className="text-blue-600" />
                          <p className="text-xs text-blue-700 dark:text-blue-300 font-medium italic">Pending evaluation by the designated HSE Officer.</p>
                      </div>
                  )}

                  <hr className="border-slate-100 dark:border-slate-700 mb-6" />

                  {/* Comments / Replies */}
                  <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">Feedback & Investigation Log</h4>
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full font-bold text-slate-500">
                          {selectedIncident.replies?.length || 0} Entries
                      </span>
                  </div>
                  
                  <div className="space-y-4 mb-4">
                      {selectedIncident.replies && selectedIncident.replies.length > 0 ? (
                          selectedIncident.replies.map(rep => {
                              const isMe = rep.senderId === currentUser?.id;
                              const sender = users.find(u => u.id === rep.senderId);
                              return (
                                  <div key={rep.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                      <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm border ${
                                          isMe 
                                          ? 'bg-peregrine-600 text-white border-peregrine-500 rounded-tr-none' 
                                          : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white border-slate-100 dark:border-slate-600 rounded-tl-none'
                                      }`}>
                                          <div className="flex justify-between items-center mb-1 gap-4">
                                              <span className="text-[10px] font-black uppercase tracking-tighter opacity-80">{sender?.name}</span>
                                              <span className="text-[9px] opacity-60">{rep.timestamp.split(',')[1]}</span>
                                          </div>
                                          <p className="text-sm leading-tight">{rep.text}</p>
                                      </div>
                                  </div>
                              );
                          })
                      ) : (
                          <div className="text-center py-6">
                              <p className="text-xs text-slate-400 italic">No feedback entries yet.</p>
                          </div>
                      )}
                  </div>
              </div>

              {/* Reply Input */}
              <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 rounded-b-2xl">
                  <form onSubmit={handleReply} className="flex gap-2 bg-slate-50 dark:bg-slate-900/50 p-1 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <input 
                          className="flex-1 p-3 bg-transparent text-sm text-slate-900 dark:text-white outline-none placeholder:text-slate-400"
                          placeholder="Add a comment or investigation note..."
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                      />
                      <button type="submit" disabled={!replyText.trim()} className="bg-peregrine-600 disabled:bg-slate-300 text-white p-3 rounded-xl hover:bg-peregrine-700 transition-all active:scale-90">
                          <Send size={18} />
                      </button>
                  </form>
              </div>
          </div>
      );
  }

  // Render List View
  if (viewMode === 'list') {
      // FILTER LOGIC - UPDATED: HSE sees all, standard users see only their own submissions.
      const displayIncidents = isHSE 
        ? incidents 
        : incidents.filter(i => i.reporterId === currentUser?.id);

      return (
          <div className="max-w-3xl mx-auto">
              <div className="flex justify-between items-end mb-8">
                  <div>
                      <h2 className="text-2xl font-black text-peregrine-900 dark:text-white tracking-tight">{isHSE ? 'HSE Official Audit Log' : 'My Reported Incidents'}</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                          {isHSE ? 'Full oversight of all reported site safety and security events.' : 'Track the review status of safety reports you have submitted.'}
                      </p>
                  </div>
                  <button 
                    onClick={() => setViewMode('form')} 
                    className="bg-peregrine-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-peregrine-700 shadow-md transition-all active:scale-95"
                  >
                      + File New Report
                  </button>
              </div>

              <div className="space-y-3">
                  {displayIncidents.length === 0 ? (
                      <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-100 dark:border-slate-700">
                          <AlertTriangle size={48} className="mx-auto mb-4 text-slate-200" />
                          <p className="text-slate-400 font-medium">No records found for your account.</p>
                      </div>
                  ) : (
                      displayIncidents.map(inc => (
                          <div 
                            key={inc.id}
                            onClick={() => { setSelectedIncidentId(inc.id); setViewMode('detail'); }}
                            className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 cursor-pointer hover:border-peregrine-300 dark:hover:border-peregrine-600 transition-all hover:shadow-md group"
                          >
                              <div className="flex justify-between items-start">
                                  <div className="flex items-start">
                                      <div className={`p-2.5 rounded-xl mr-4 transition-colors ${
                                          inc.type === 'ACCIDENT' ? 'bg-red-100 text-red-600' :
                                          inc.type === 'SECURITY' ? 'bg-slate-100 text-slate-600' :
                                          'bg-yellow-100 text-yellow-600'
                                      }`}>
                                          {inc.type === 'ACCIDENT' && <AlertTriangle size={20} />}
                                          {inc.type === 'SECURITY' && <ShieldAlert size={20} />}
                                          {inc.type === 'NEAR_MISS' && <Activity size={20} />}
                                      </div>
                                      <div>
                                          <div className="flex items-center gap-2 mb-0.5">
                                              <h4 className="font-bold text-slate-900 dark:text-white uppercase text-xs tracking-wider">{inc.type.replace('_', ' ')}</h4>
                                              <span className="text-[10px] text-slate-400">• {inc.date.split(',')[0]}</span>
                                          </div>
                                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1 pr-4">{inc.description}</p>
                                          {isHSE && (
                                              <p className="text-[10px] text-peregrine-600 font-black mt-1 uppercase">
                                                  Reporter: {users.find(u => u.id === inc.reporterId)?.name || 'Unknown'}
                                              </p>
                                          )}
                                      </div>
                                  </div>
                                  <div className="flex flex-col items-end gap-2">
                                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${inc.status === 'reviewed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                          {inc.status}
                                      </span>
                                      {inc.replies && inc.replies.length > 0 && (
                                          <div className="flex items-center text-[10px] text-blue-500 font-bold">
                                              <Send size={10} className="mr-1" /> {inc.replies.length}
                                          </div>
                                      )}
                                  </div>
                              </div>
                          </div>
                      ))
                  )}
              </div>
          </div>
      );
  }

  // Render Submit Form (Default Entry Point)
  if (!activeType) {
    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-black text-peregrine-900 dark:text-white tracking-tight uppercase">HSE Compliance Module</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Securely submit reports for exclusive evaluation by the Site HSE Officer.</p>
                </div>
                <button onClick={() => setViewMode('list')} className="text-peregrine-600 hover:text-peregrine-700 text-sm font-bold flex items-center transition-colors">
                    <Clock size={16} className="mr-1.5" /> History
                </button>
            </div>
            
            <div className="grid gap-4">
                <button 
                    onClick={() => setActiveType('NEAR_MISS')}
                    className="flex items-center p-6 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-3xl hover:bg-yellow-100 transition-all hover:shadow-lg hover:-translate-y-1 text-left group"
                >
                    <div className="bg-yellow-500 p-5 rounded-2xl mr-6 shadow-md shadow-yellow-200 dark:shadow-none group-hover:scale-110 transition-transform">
                        <Activity className="text-white" size={32} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-yellow-900 dark:text-yellow-100 uppercase tracking-tight">Near Miss</h3>
                        <p className="text-yellow-700 dark:text-yellow-400 text-sm font-medium">Potential hazards identified with no resulting injury.</p>
                    </div>
                </button>

                <button 
                    onClick={() => setActiveType('ACCIDENT')}
                    className="flex items-center p-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-3xl hover:bg-red-100 transition-all hover:shadow-lg hover:-translate-y-1 text-left group"
                >
                    <div className="bg-red-500 p-5 rounded-2xl mr-6 shadow-md shadow-red-200 dark:shadow-none group-hover:scale-110 transition-transform">
                        <AlertTriangle className="text-white" size={32} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-red-900 dark:text-red-100 uppercase tracking-tight">Accident</h3>
                        <p className="text-red-700 dark:text-red-400 text-sm font-medium">Physical harm to personnel or substantial property damage.</p>
                    </div>
                </button>

                <button 
                    onClick={() => setActiveType('SECURITY')}
                    className="flex items-center p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl hover:bg-slate-100 transition-all hover:shadow-lg hover:-translate-y-1 text-left group"
                >
                    <div className="bg-slate-700 p-5 rounded-2xl mr-6 shadow-md group-hover:scale-110 transition-transform">
                        <ShieldAlert className="text-white" size={32} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Security Incident</h3>
                        <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">Theft, equipment loss, or unauthorized perimeter access.</p>
                    </div>
                </button>
            </div>
        </div>
    );
  }

  const typeConfig = {
      'NEAR_MISS': { color: 'yellow', label: 'Near Miss Report', theme: 'bg-yellow-600' },
      'ACCIDENT': { color: 'red', label: 'Accident Report', theme: 'bg-red-600' },
      'SECURITY': { color: 'slate', label: 'Security Report', theme: 'bg-slate-800' },
  };

  const config = typeConfig[activeType];

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700 animate-fade-in">
        <div className={`${config.theme} p-8 text-white relative overflow-hidden`}>
            <div className="relative z-10">
                <h2 className="text-3xl font-black uppercase tracking-tighter mb-1">{config.label}</h2>
                <p className="opacity-80 text-sm font-medium">Direct secure submission to HSE Office</p>
            </div>
            {/* Background Icon Decoration */}
            <div className="absolute right-[-20px] bottom-[-20px] opacity-10 rotate-[-15deg]">
                {activeType === 'ACCIDENT' && <AlertTriangle size={160} />}
                {activeType === 'SECURITY' && <ShieldAlert size={160} />}
                {activeType === 'NEAR_MISS' && <Activity size={160} />}
            </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Occurrence Details</label>
                <textarea 
                    rows={4}
                    required
                    className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-peregrine-500 transition-all text-sm leading-relaxed"
                    placeholder="Provide a clear and accurate description of the event..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Location Information</label>
                <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text"
                        required
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-peregrine-500 text-sm transition-all"
                        placeholder="e.g., Riverside Site, Sector B-4"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>
                <button type="button" className="text-[10px] text-peregrine-600 dark:text-peregrine-400 font-black uppercase mt-2 ml-1 hover:underline tracking-tighter" onClick={() => setLocation("GPS: 16.4023N, 120.5960E")}>
                    Grab Current GPS Coordinates
                </button>
            </div>

            <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Photographic Evidence</label>
                {!photo ? (
                    <button 
                        type="button"
                        onClick={handlePhotoCapture}
                        className="w-full h-44 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-all group"
                    >
                        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-3 group-hover:scale-110 transition-transform">
                            <Camera size={28} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest">Tap to Scan/Photo</span>
                    </button>
                ) : (
                    <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
                        <img src={photo} alt="Evidence" className="w-full h-64 object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <button 
                            type="button"
                            onClick={() => setPhoto(null)}
                            className="absolute top-4 right-4 bg-white/90 backdrop-blur text-red-600 font-bold text-[10px] px-3 py-1.5 rounded-full shadow-xl uppercase tracking-widest active:scale-95 transition-all"
                        >
                            Change Photo
                        </button>
                        <div className="absolute bottom-4 left-4">
                            <span className="text-white text-[10px] font-black uppercase tracking-widest flex items-center">
                                <CheckCircle size={14} className="mr-1.5 text-green-400" /> Image Captured
                            </span>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex gap-4 pt-6">
                <button 
                    type="button" 
                    onClick={() => setActiveType(null)}
                    className="flex-1 p-4 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm uppercase tracking-widest hover:bg-slate-200 transition-colors"
                >
                    Discard
                </button>
                <button 
                    type="submit" 
                    disabled={isSubmitting || !description || !location}
                    className={`flex-1 p-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white shadow-xl transition-all active:scale-95 flex justify-center items-center ${isSubmitting ? 'bg-slate-400' : 'bg-peregrine-600 hover:bg-peregrine-700 shadow-peregrine-100 dark:shadow-none'}`}
                >
                    {isSubmitting ? 'Syncing...' : 'Submit Report'}
                </button>
            </div>
        </form>
    </div>
  );
};

export default IncidentReport;
