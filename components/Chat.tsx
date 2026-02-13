
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../contexts/AppContext';
import { Send, Search, ArrowLeft, MoreVertical, User, Check, CheckCheck } from 'lucide-react';

const Chat = () => {
  const { 
    currentUser, users, conversations, messages, 
    startConversation, sendMessage 
  } = useApp();

  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState('');
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Derived state
  const activeConversation = conversations.find(c => c.id === activeConvId);
  const activePartner = activeConversation 
    ? users.find(u => u.id === activeConversation.partnerId) 
    : null;
  
  const currentMessages = messages.filter(m => m.conversationId === activeConvId);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeConvId) {
        scrollToBottom();
    }
  }, [activeConvId, messages]);

  // Search users who are NOT current user
  const searchResults = userSearch 
    ? users.filter(u => 
        u.id !== currentUser?.id && 
        u.status === 'active' &&
        u.name.toLowerCase().includes(userSearch.toLowerCase())
      )
    : [];

  const handleStartChat = (partnerId: string) => {
    const convId = startConversation(partnerId);
    setActiveConvId(convId);
    setUserSearch('');
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeConvId && inputText.trim()) {
      sendMessage(activeConvId, inputText);
      setInputText('');
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden transition-all duration-300">
      
      {/* Sidebar / Conversation List - Hidden on mobile if a chat is active */}
      <div className={`w-full md:w-85 border-r border-slate-100 dark:border-slate-700 flex flex-col transition-all duration-300 ${activeConvId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-5 border-b border-slate-100 dark:border-slate-700">
              <div className="flex justify-between items-center mb-4">
                  <h2 className="font-black text-2xl text-peregrine-900 dark:text-white tracking-tight">Messages</h2>
                  <div className="w-8 h-8 bg-peregrine-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-peregrine-600">{conversations.length}</span>
                  </div>
              </div>
              <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                      type="text"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-700 border-none text-sm focus:ring-2 focus:ring-peregrine-500 text-slate-900 dark:text-white"
                      placeholder="Search people..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                  />
              </div>
          </div>
          
          <div className="flex-1 overflow-y-auto no-scrollbar">
              {userSearch ? (
                  <div className="p-3">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-3">Suggested Contacts</h3>
                      {searchResults.length === 0 && (
                        <div className="text-center py-10">
                            <p className="text-sm text-slate-400">No matching colleagues found.</p>
                        </div>
                      )}
                      {searchResults.map(user => (
                          <button 
                            key={user.id}
                            onClick={() => handleStartChat(user.id)}
                            className="w-full flex items-center p-3 hover:bg-peregrine-50 dark:hover:bg-slate-700/50 rounded-2xl transition-all active:scale-[0.98]"
                          >
                              <img src={user.avatar} alt="" className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-white dark:border-slate-600 shadow-sm" />
                              <div className="text-left">
                                  <p className="font-bold text-slate-900 dark:text-white">{user.name}</p>
                                  <p className="text-xs text-slate-500 font-medium">{user.position}</p>
                              </div>
                          </button>
                      ))}
                  </div>
              ) : (
                  <div className="p-2 space-y-1">
                      {conversations.length === 0 && (
                          <div className="text-center p-12">
                              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <User size={24} className="text-slate-300" />
                              </div>
                              <p className="text-sm text-slate-400 font-medium">No active chats.</p>
                              <p className="text-xs text-slate-400 mt-1 px-4 text-balance">Search for a team member to start a discussion.</p>
                          </div>
                      )}
                      {conversations.map(conv => {
                          const partner = users.find(u => u.id === conv.partnerId);
                          if (!partner) return null;
                          const isSelected = activeConvId === conv.id;
                          return (
                              <button 
                                key={conv.id}
                                onClick={() => setActiveConvId(conv.id)}
                                className={`w-full flex items-center p-4 rounded-2xl transition-all active:scale-[0.98] ${isSelected ? 'bg-peregrine-600 text-white shadow-lg shadow-peregrine-100 dark:shadow-none' : 'hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                              >
                                  <div className="relative mr-4 shrink-0">
                                      <img src={partner.avatar} alt="" className={`w-14 h-14 rounded-full object-cover border-2 ${isSelected ? 'border-white/30' : 'border-transparent bg-slate-200'}`} />
                                      <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-4 border-white dark:border-slate-800"></span>
                                      {conv.unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 min-w-5 h-5 bg-red-500 text-[10px] font-bold text-white rounded-full border-2 border-white flex items-center justify-center px-1">
                                            {conv.unreadCount}
                                        </span>
                                      )}
                                  </div>
                                  <div className="flex-1 text-left min-w-0">
                                      <div className="flex justify-between items-baseline mb-1">
                                          <span className="font-bold truncate text-sm tracking-tight">{partner.name}</span>
                                          <span className={`text-[10px] font-bold uppercase shrink-0 ml-2 ${isSelected ? 'text-white/60' : 'text-slate-400'}`}>
                                            {conv.timestamp}
                                          </span>
                                      </div>
                                      <p className={`text-xs truncate font-medium ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                                        {conv.lastMessage || 'Start a conversation...'}
                                      </p>
                                  </div>
                              </button>
                          );
                      })}
                  </div>
              )}
          </div>
      </div>

      {/* Chat Area - Visible on mobile if activeConvId is set */}
      <div className={`flex-1 flex flex-col bg-white dark:bg-slate-800 transition-all duration-300 ${!activeConvId ? 'hidden md:flex items-center justify-center bg-slate-50 dark:bg-slate-900/50' : 'flex'}`}>
          {!activeConvId ? (
              <div className="text-center p-10 max-w-sm">
                  <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border border-slate-100 dark:border-slate-700">
                      <Send size={40} className="text-peregrine-600 ml-1 rotate-[-12deg]" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Team Hub</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed text-balance">
                    Select a conversation from the sidebar to view messages or coordinate with your project team.
                  </p>
              </div>
          ) : (
              <>
                  <div className="p-4 md:p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800 shadow-sm z-10">
                      <div className="flex items-center">
                          {/* Back Button for Mobile */}
                          <button 
                            onClick={() => setActiveConvId(null)} 
                            className="md:hidden p-2 -ml-2 mr-2 text-slate-500 hover:text-peregrine-600 transition-colors"
                          >
                              <ArrowLeft size={24} />
                          </button>
                          
                          <div className="relative">
                            <img src={activePartner?.avatar} alt="" className="w-10 h-10 md:w-12 md:h-12 rounded-full mr-3 bg-slate-200 object-cover border border-slate-100 dark:border-slate-600" />
                            <span className="absolute bottom-0 right-3 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></span>
                          </div>
                          
                          <div>
                              <h3 className="font-bold text-slate-900 dark:text-white text-sm md:text-base leading-tight">{activePartner?.name}</h3>
                              <p className="text-[10px] md:text-xs font-bold text-green-600 uppercase tracking-wider">
                                Active Now
                              </p>
                          </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                            <MoreVertical size={20} />
                        </button>
                      </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-[#f8fafc] dark:bg-slate-900/40 no-scrollbar">
                      {currentMessages.length === 0 ? (
                        <div className="h-full flex items-center justify-center opacity-40">
                             <div className="text-center">
                                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <MessageSquare size={20} className="text-slate-500" />
                                </div>
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">End-to-end encrypted</p>
                             </div>
                        </div>
                      ) : (
                        currentMessages.map((msg, index) => {
                          const isMe = msg.senderId === currentUser?.id;
                          const nextMsg = currentMessages[index + 1];
                          const isLastInGroup = !nextMsg || nextMsg.senderId !== msg.senderId;

                          return (
                              <div key={msg.id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} ${isLastInGroup ? 'mb-2' : 'mb-1'}`}>
                                  <div className={`max-w-[85%] md:max-w-[70%] px-4 py-3 shadow-sm transition-all duration-200 ${
                                      isMe 
                                      ? `bg-peregrine-600 text-white ${isLastInGroup ? 'rounded-3xl rounded-br-none' : 'rounded-3xl'}` 
                                      : `bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-600 ${isLastInGroup ? 'rounded-3xl rounded-bl-none' : 'rounded-3xl'}`
                                  }`}>
                                      <p className="text-sm leading-relaxed">{msg.text}</p>
                                      <div className={`flex items-center justify-end mt-1.5 gap-1.5`}>
                                          <span className={`text-[9px] font-bold uppercase tracking-tighter ${isMe ? 'text-white/60' : 'text-slate-400'}`}>
                                            {msg.timestamp}
                                          </span>
                                          {isMe && <CheckCheck size={12} className="text-white/60" />}
                                      </div>
                                  </div>
                              </div>
                          );
                        })
                      )}
                      <div ref={messagesEndRef} />
                  </div>

                  <form onSubmit={handleSend} className="p-4 md:p-5 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/50 p-2 rounded-3xl border border-slate-100 dark:border-slate-600 focus-within:ring-2 focus-within:ring-peregrine-500 focus-within:border-transparent transition-all">
                          <input 
                              type="text" 
                              className="flex-1 px-4 py-2 bg-transparent border-none text-sm focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400 font-medium outline-none"
                              placeholder="Type a message..."
                              value={inputText}
                              onChange={e => setInputText(e.target.value)}
                          />
                          <button 
                              type="submit"
                              disabled={!inputText.trim()}
                              className={`p-3 rounded-full transition-all shadow-md active:scale-90 ${inputText.trim() ? 'bg-peregrine-600 text-white' : 'bg-slate-200 dark:bg-slate-600 text-slate-400 cursor-not-allowed'}`}
                          >
                              <Send size={18} className="translate-x-[1px]" />
                          </button>
                      </div>
                  </form>
              </>
          )}
      </div>
    </div>
  );
};

const MessageSquare = ({ className, size }: { className?: string, size?: number }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size || 24} 
        height={size || 24} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);

export default Chat;
