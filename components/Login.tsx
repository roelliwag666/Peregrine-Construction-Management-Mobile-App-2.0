
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../contexts/AppContext';
import { UserRole } from '../types';
import { Briefcase, Mail, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';

const Login = () => {
  const { login } = useApp();
  const [role, setRole] = useState<UserRole>(UserRole.COO);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Auth Flow State
  const [step, setStep] = useState<'login' | 'otp'>('login');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer logic for OTP resend
  useEffect(() => {
    let interval: any;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleInitialLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending an email
    setStep('otp');
    setTimer(60);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = otp.join('');
    // For this mock, any 6 digits work
    if (enteredCode.length === 6) {
        login(email || `${role.toLowerCase()}@peregrine.com`, role);
    } else {
        alert("Please enter the full 6-digit verification code.");
    }
  };

  const handleResend = () => {
    setIsResending(true);
    setTimeout(() => {
        setTimer(60);
        setIsResending(false);
        setOtp(['', '', '', '', '', '']);
        otpRefs.current[0]?.focus();
    }, 1500);
  };

  const maskedEmail = (email || `${role.toLowerCase()}@peregrine.com`).replace(/(.{2})(.*)(?=@)/, (gp1, gp2, gp3) => {
    return gp2 + gp3.replace(/./g, '*');
  });

  return (
    <div className="min-h-screen bg-peregrine-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-peregrine-100 transition-all duration-500">
        
        {/* Progress Indicator */}
        <div className="flex justify-center mb-8 gap-2">
            <div className={`h-1 w-8 rounded-full transition-colors duration-300 ${step === 'login' ? 'bg-peregrine-600' : 'bg-peregrine-200'}`}></div>
            <div className={`h-1 w-8 rounded-full transition-colors duration-300 ${step === 'otp' ? 'bg-peregrine-600' : 'bg-peregrine-100'}`}></div>
        </div>

        {step === 'login' ? (
            <div className="animate-fade-in">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-peregrine-600 p-4 rounded-full text-white mb-4 shadow-lg shadow-peregrine-200">
                        <Briefcase size={40} />
                    </div>
                    <h1 className="text-2xl font-bold text-peregrine-900 tracking-wide">PEREGRINE</h1>
                    <p className="text-peregrine-600 font-medium">CONSTRUCTION MANAGEMENT</p>
                </div>

                <form onSubmit={handleInitialLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Select Role (Simulated)</label>
                        <select 
                            value={role} 
                            onChange={(e) => setRole(e.target.value as UserRole)}
                            className="w-full p-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-peregrine-500 appearance-none"
                        >
                            <option value={UserRole.COO}>COO / Executive</option>
                            <option value={UserRole.MANAGER}>Project Manager</option>
                            <option value={UserRole.HR}>HR Admin</option>
                            <option value={UserRole.EMPLOYEE}>Employee</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input 
                            type="email" 
                            placeholder="user@peregrine.com"
                            className="w-full p-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-peregrine-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            className="w-full p-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-peregrine-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-peregrine-600 text-white font-bold p-4 rounded-xl hover:bg-peregrine-700 transition-all shadow-md active:scale-95"
                    >
                        Login
                    </button>
                </form>
            </div>
        ) : (
            <div className="animate-fade-in">
                <button 
                    type="button"
                    onClick={() => setStep('login')}
                    className="flex items-center text-slate-500 hover:text-peregrine-600 transition-colors mb-6 text-sm font-medium"
                >
                    <ArrowLeft size={16} className="mr-1" /> Back to Login
                </button>

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-peregrine-100 text-peregrine-600 rounded-full mb-4">
                        <Mail size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Verify Your Email</h2>
                    <p className="text-slate-500 text-sm px-4">
                        We've sent a 6-digit authentication code to <br/>
                        <span className="font-bold text-slate-700">{maskedEmail}</span>
                    </p>
                </div>

                <form onSubmit={handleVerify} className="space-y-8">
                    <div className="flex justify-between gap-2">
                        {otp.map((digit, idx) => (
                            <input
                                key={idx}
                                // Fix: TypeScript error was occurring because assignment returns the value. Ref callback should return void.
                                ref={(el) => { otpRefs.current[idx] = el; }}
                                type="text"
                                maxLength={1}
                                className="w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 border-slate-100 bg-slate-50 text-slate-900 focus:border-peregrine-500 focus:bg-white focus:outline-none transition-all"
                                value={digit}
                                onChange={(e) => handleOtpChange(idx, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(idx, e)}
                                autoFocus={idx === 0}
                            />
                        ))}
                    </div>

                    <div className="space-y-4">
                        <button 
                            type="submit" 
                            className="w-full bg-peregrine-600 text-white font-bold p-4 rounded-xl hover:bg-peregrine-700 transition-all shadow-md active:scale-95 disabled:opacity-50"
                            disabled={otp.some(d => d === '')}
                        >
                            Verify Account
                        </button>
                        
                        <div className="text-center">
                            {timer > 0 ? (
                                <p className="text-sm text-slate-500">
                                    Resend code in <span className="font-bold text-peregrine-600">{timer}s</span>
                                </p>
                            ) : (
                                <button 
                                    type="button"
                                    onClick={handleResend}
                                    disabled={isResending}
                                    className="text-sm font-bold text-peregrine-600 hover:text-peregrine-700 transition-colors flex items-center justify-center mx-auto"
                                >
                                    {isResending ? (
                                        <RefreshCw size={16} className="mr-2 animate-spin" />
                                    ) : (
                                        <RefreshCw size={16} className="mr-2" />
                                    )}
                                    Resend Code
                                </button>
                            )}
                        </div>
                    </div>
                </form>

                <div className="mt-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex items-start gap-3">
                        <CheckCircle2 size={18} className="text-peregrine-500 mt-0.5" />
                        <p className="text-xs text-slate-600 leading-relaxed">
                            For security, this code will expire in 10 minutes. Please do not share this code with anyone.
                        </p>
                    </div>
                </div>
            </div>
        )}

        <p className="text-center text-[10px] text-slate-400 mt-8 uppercase tracking-widest font-bold">
            © 2025 Peregrine Construction & Management L.L.C Inc
        </p>
      </div>
    </div>
  );
};

export default Login;
