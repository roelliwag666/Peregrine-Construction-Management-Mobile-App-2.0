
import React, { useState } from 'react';
import { Wifi, Signal, Battery, Bird } from 'lucide-react';

export const Onboarding = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(1);

  if (step === 1) {
    return (
      <div className="relative min-h-screen bg-peregrine-800 overflow-hidden flex flex-col font-sans">
        {/* Background Image with Overlay to simulate construction site silhouette */}
        <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 mix-blend-overlay"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")' }}
        />
        
        {/* Status Bar Mock */}
        <div className="relative z-10 px-6 py-3 flex justify-between items-center text-white/90 text-xs font-semibold">
            <span>08:00</span>
            <div className="flex gap-1.5 items-center">
                <Signal size={14} />
                <Wifi size={14} />
                <Battery size={14} />
            </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 text-center pb-32">
            {/* Logo Circle */}
            <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center mb-10 shadow-2xl border-[6px] border-peregrine-600">
                <div className="flex flex-col items-center justify-center">
                    {/* Abstract Bird Logo representing Peregrine */}
                    <Bird size={64} className="text-peregrine-700 mb-2" strokeWidth={1.5} />
                    <span className="font-bold text-peregrine-900 tracking-[0.2em] text-sm">PEREGRINE</span>
                </div>
            </div>

            {/* Title Text */}
            <h1 className="text-white font-black text-2xl md:text-3xl uppercase tracking-wide leading-tight drop-shadow-lg max-w-sm">
                Peregrine Construction <br/>
                <span className="text-xl md:text-2xl">& Management L.L.C INC</span>
            </h1>
        </div>

        {/* Get Started Button */}
        <div className="relative z-10 p-8 pb-16 w-full max-w-md mx-auto">
            <button 
                onClick={() => setStep(2)}
                className="w-full bg-peregrine-600 hover:bg-peregrine-500 text-white font-black text-xl py-4 rounded-xl shadow-xl border-b-4 border-peregrine-800 active:border-b-0 active:translate-y-1 transition-all"
            >
                GET STARTED!
            </button>
        </div>
      </div>
    );
  }

  // Step 2: Terms of Service
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
        {/* Header Bar Mock */}
        <div className="bg-peregrine-600 text-white px-6 py-3 flex justify-between items-center text-xs font-semibold">
            <span>08:00</span>
            <div className="flex gap-1.5 items-center">
                <Signal size={14} />
                <Wifi size={14} />
                <Battery size={14} />
            </div>
        </div>

        <div className="flex-1 flex flex-col p-8 pt-12 max-w-md mx-auto w-full h-full">
            <h1 className="text-3xl font-bold text-peregrine-900 mb-8 leading-tight">
                Terms of Service and <br/>Privacy Policy
            </h1>

            <div className="flex-1 space-y-5 text-sm md:text-base text-slate-600 leading-relaxed overflow-y-auto pr-2 custom-scrollbar">
                <p>
                    By using the PCML Management App, you agree to follow all applicable rules and company policies. Any copying, editing, or sharing of content from the app without permission is not allowed. PCML may update or change features of the app at any time without prior notice.
                </p>
                <p>
                    We are committed to protecting your privacy—any personal or work-related information you provide will only be used to improve your experience and support company operations. Your data will not be shared with anyone outside the company without your consent, unless required by law.
                </p>
                <p>
                    By continuing to use this app, you accept these terms and any future updates.
                </p>
            </div>

            <div className="mt-8 flex gap-4 pt-4 border-t border-slate-200">
                <button 
                    onClick={() => setStep(1)} // Go back or decline logic
                    className="flex-1 py-3.5 border-2 border-peregrine-900 text-peregrine-900 font-bold rounded-full hover:bg-slate-100 transition-colors"
                >
                    Decline
                </button>
                <button 
                    onClick={onComplete}
                    className="flex-1 py-3.5 bg-peregrine-800 text-white font-bold rounded-full hover:bg-peregrine-900 shadow-lg transition-transform active:scale-95"
                >
                    Accept
                </button>
            </div>
        </div>
    </div>
  );
};

export default Onboarding;
