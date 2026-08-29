import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Mail, Lock, Shield, CheckCircle2 } from 'lucide-react';
import { LanguageSelector } from '../../components/common/LanguageSelector';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setStatusMsg({ text: 'Please enter your email', isError: true });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ text: "OTP sent to your email!", isError: false });
        setStep(2);
      } else {
        setStatusMsg({ text: data.message || "Failed to send OTP", isError: true });
      }
    } catch (err) {
      setStatusMsg({ text: "Network error", isError: true });
    }
    setLoading(false);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setStatusMsg({ text: 'Enter valid OTP', isError: true });
      return;
    }
    setStep(3);
    setStatusMsg(null);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setStatusMsg({ text: 'Password must be at least 6 characters', isError: true });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: otp, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ text: "Password reset successful! Redirecting to login...", isError: false });
        setTimeout(() => navigate('/signin'), 2000);
      } else {
        setStatusMsg({ text: data.message || "Failed to reset password", isError: true });
      }
    } catch (err) {
      setStatusMsg({ text: "Network error", isError: true });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col relative font-sans overflow-hidden bg-[#f6f3eb]">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#0f2e22]/95" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <nav className="flex items-center justify-between p-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-emerald-500 rounded-lg p-2">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">VyaparMitra</span>
          </Link>
          <LanguageSelector />
        </nav>

        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
                <p className="text-gray-600">Enter your email to receive an OTP.</p>
              </div>

              {statusMsg && (
                <div className={`p-4 rounded-xl mb-6 text-sm flex gap-3 ${statusMsg.isError ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <p>{statusMsg.text}</p>
                </div>
              )}

              {step === 1 && (
                <form onSubmit={handleRequestOtp} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-70"
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </button>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Enter OTP</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-center tracking-[0.5em] font-mono text-xl outline-none"
                      placeholder="------"
                      maxLength={6}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all active:scale-[0.98]"
                  >
                    Verify OTP
                  </button>
                </form>
              )}

              {step === 3 && (
                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                        placeholder="••••••••"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-70"
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </form>
              )}
              
              <div className="mt-8 text-center">
                <Link to="/signin" className="text-emerald-600 font-semibold hover:text-emerald-700">
                  Back to Sign In
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
