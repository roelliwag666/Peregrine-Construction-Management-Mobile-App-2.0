
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { File, Printer, Search, User, Download } from 'lucide-react';

const HRAdmin = () => {
  const { addAdminDoc, users } = useApp();
  
  // Doc Form
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState('Policy');

  // COE State
  const [coeSearch, setCoeSearch] = useState('');
  const [selectedUserForCoe, setSelectedUserForCoe] = useState<any>(null);

  const handleAddDoc = (e: React.FormEvent) => {
      e.preventDefault();
      addAdminDoc({
          id: `ad_${Date.now()}`,
          category: docCategory as any,
          title: docTitle,
          uploadDate: new Date().toISOString().split('T')[0],
          url: '#'
      });
      setDocTitle('');
      alert("Document uploaded successfully.");
  };

  const filteredUsers = users.filter(u => 
    u.status === 'active' && 
    u.name.toLowerCase().includes(coeSearch.toLowerCase())
  );

  const handleGenerateCOE = () => {
      if(!selectedUserForCoe) return;
      // Simulate generation
      const coeContent = `
        CERTIFICATE OF EMPLOYMENT

        To Whom It May Concern:

        This is to certify that ${selectedUserForCoe.name} is employed with PEREGRINE CONSTRUCTION INC.
        holding the position of ${selectedUserForCoe.position}.
        
        Date Joined: ${selectedUserForCoe.joinDate}
        Status: Active

        This certification is issued upon the request of the employee for whatever legal purpose it may serve.

        Issued on: ${new Date().toLocaleDateString()}
      `;
      
      const blob = new Blob([coeContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `COE_${selectedUserForCoe.name.replace(/\s+/g, '_')}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      
      setSelectedUserForCoe(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-peregrine-900 dark:text-white">HR Administration</h2>
      <p className="text-slate-500 dark:text-slate-400">Manage employee certificates and documents</p>
      
      <div className="grid md:grid-cols-3 gap-6">
          {/* COE Section (Replaces Repository) */}
          <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 flex flex-col">
              <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white flex items-center">
                  <Printer className="mr-2 text-peregrine-600" size={24} />
                  Certificate of Employment (COE)
              </h3>
              <p className="text-sm text-slate-500 mb-6">Generate and print COE for active employees.</p>

              <div className="relative mb-4">
                  <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                      className="w-full pl-10 p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-peregrine-500"
                      placeholder="Search employee name..."
                      value={coeSearch}
                      onChange={e => setCoeSearch(e.target.value)}
                  />
              </div>

              <div className="flex-1 overflow-y-auto max-h-[500px] space-y-3">
                  {filteredUsers.length === 0 ? (
                      <p className="text-center text-slate-400 py-4">No employees found.</p>
                  ) : (
                      filteredUsers.map(user => (
                          <div key={user.id} className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                              <div className="flex items-center">
                                  <div className="bg-slate-100 dark:bg-slate-600 p-2 rounded-full mr-3">
                                      <User size={20} className="text-slate-600 dark:text-slate-300" />
                                  </div>
                                  <div>
                                      <p className="font-bold text-slate-800 dark:text-white">{user.name}</p>
                                      <p className="text-xs text-slate-500">{user.position}</p>
                                  </div>
                              </div>
                              <button 
                                onClick={() => setSelectedUserForCoe(user)}
                                className="px-4 py-2 bg-peregrine-100 dark:bg-slate-600 text-peregrine-700 dark:text-white rounded-lg text-sm font-medium hover:bg-peregrine-200 dark:hover:bg-slate-500 transition-colors"
                              >
                                  Generate
                              </button>
                          </div>
                      ))
                  )}
              </div>
          </div>

          {/* Upload Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 h-fit">
              <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Upload Document</h3>
              <form onSubmit={handleAddDoc} className="space-y-4">
                  <div>
                      <label className="block text-sm font-medium mb-1 dark:text-slate-300">Title</label>
                      <input required className="w-full p-2 border rounded-lg bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white" value={docTitle} onChange={e => setDocTitle(e.target.value)} />
                  </div>
                  <div>
                      <label className="block text-sm font-medium mb-1 dark:text-slate-300">Category</label>
                      <select className="w-full p-2 border rounded-lg bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white" value={docCategory} onChange={e => setDocCategory(e.target.value)}>
                          <option>Policy</option>
                          <option>Form</option>
                          <option>Training</option>
                          <option>Compliance</option>
                          <option>Minutes</option>
                          <option>COE</option>
                      </select>
                  </div>
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center text-slate-500 text-sm">
                      <File size={24} className="mx-auto mb-2 opacity-50" />
                      Click to select PDF/Doc
                  </div>
                  <button type="submit" className="w-full bg-peregrine-600 text-white py-2 rounded-lg font-medium hover:bg-peregrine-700">Upload</button>
              </form>
          </div>
      </div>

      {/* COE Preview Modal */}
      {selectedUserForCoe && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Generate COE</h3>
                  <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-xl mb-4 text-sm font-mono text-slate-600 dark:text-slate-300 leading-relaxed">
                      <p className="text-center font-bold mb-4">CERTIFICATE OF EMPLOYMENT</p>
                      <p className="mb-4">To Whom It May Concern:</p>
                      <p className="mb-4">This is to certify that <strong>{selectedUserForCoe.name}</strong> is employed with PEREGRINE CONSTRUCTION INC. holding the position of <strong>{selectedUserForCoe.position}</strong>.</p>
                      <p className="mb-4">Date Joined: {selectedUserForCoe.joinDate}<br/>Status: Active</p>
                      <p>Issued on: {new Date().toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-3">
                      <button onClick={() => setSelectedUserForCoe(null)} className="flex-1 py-3 text-slate-600 dark:text-slate-300">Cancel</button>
                      <button onClick={handleGenerateCOE} className="flex-1 py-3 bg-peregrine-600 text-white rounded-xl font-medium hover:bg-peregrine-700 flex justify-center items-center">
                          <Download size={18} className="mr-2" /> Download
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default HRAdmin;
