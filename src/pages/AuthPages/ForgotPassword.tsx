import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Mail, Lock, Shield, CheckCircle2 } from 'lucide-react';
import { LanguageSelector } from '../../components/common/LanguageSelector';
import { ThemeToggleButton } from '../../components/common/ThemeToggleButton';
import { useTranslation } from 'react-i18next';
import { authApiService } from '../../services/apiServices';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
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
      const data = await authApiService.forgotPassword(email);
      if (data.success) {
        setStatusMsg({ text: "OTP sent to your email!", isError: false });
        setOtp(""); // Clear OTP input
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
      const data = await authApiService.resetPassword(otp, newPassword);
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
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col relative font-sans overflow-hidden bg-[#f6f3eb] dark:bg-gray-900 transition-colors duration-300">

      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/bg-landscape.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Top fade to blend sky into page */}
        <div className="absolute top-0 left-0 right-0 h-[35vh] bg-gradient-to-b from-[#f6f3eb] via-[#f6f3eb]/60 to-transparent dark:from-gray-900 dark:via-gray-900/60 pointer-events-none" />
        {/* Right fade for login card readability */}
        <div className="absolute inset-0 bg-gradient-to-l from-white/65 via-white/10 to-transparent dark:from-gray-900/90 dark:via-gray-900/50 pointer-events-none" />
      </div>

      {/* ── PAGE CONTENT ── */}
      <div className="flex-1 flex flex-col lg:flex-row w-full relative z-10 pb-16">

        {/* LEFT */}
        <div className="w-full lg:w-7/12 flex flex-col p-8 lg:p-12 xl:p-16 opacity-0" style={{ animation: 'slide-up 0.8s ease-out forwards' }}>
          <div className="max-w-3xl">
            {/* Logo */}
            <div className="mb-8 flex items-center gap-4">
              <img
                src="/images/logo/vyapar-mitra-icon.png"
                alt="VyaparMitra Logo"
                className="h-16 lg:h-20 object-contain drop-shadow-md"
              />
              <div className="flex flex-col">
                <span className="text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900 leading-none drop-shadow-sm">
                  Vyapar<span className="text-emerald-700">Mitra</span>
                </span>
                <span className="text-xs font-bold text-gray-700 tracking-widest uppercase mt-2 drop-shadow-sm">
                  Plan • Grow • Prosper
                </span>
              </div>
            </div>

            <h2 className="text-3xl lg:text-4xl xl:text-[2.5rem] font-extrabold text-gray-900 dark:text-white leading-[1.2]">
              {t('auth.heroTitle1')}{' '}
              <span className="text-green-700 dark:text-emerald-400">{t('auth.heroHighlight1')}</span>
              <br/>
              <span className="whitespace-nowrap">
                {t('auth.heroTitle2')}{' '}
                <span className="text-gray-900 dark:text-gray-100">{t('auth.heroHighlight2')}</span>
              </span>
            </h2>
          </div>
        </div>

        {/* STATS BAR — bottom-left above footer */}
        <div className="hidden lg:flex absolute bottom-[52px] left-8 xl:left-12 z-30 bg-[#0A4222] dark:bg-emerald-950/90 text-white px-4 py-4 rounded-2xl items-center shadow-2xl border border-green-800/30 dark:border-emerald-800/50 backdrop-blur-md">
          {[
            { val: t('auth.stat1Val'), label: t('auth.stat1Label') },
            { val: t('auth.stat2Val'), label: t('auth.stat2Label') },
            { val: t('auth.stat3Val'), label: t('auth.stat3Label') },
            { val: t('auth.stat4Val'), label: t('auth.stat4Label') },
          ].map((s, i, arr) => (
            <div key={i}
              className={`text-center px-5 hover:scale-105 transition-transform cursor-default ${i < arr.length - 1 ? 'border-r border-green-700/50 dark:border-emerald-700/50' : ''}`}>
              <div className="font-bold text-[1.5rem] leading-none">{s.val}</div>
              <div className="text-[9px] uppercase tracking-wider text-green-100/80 dark:text-emerald-200/80 mt-1.5 font-semibold whitespace-pre-line">{s.label}</div>
            </div>
          ))}
        </div>

        {/* RIGHT — Sign In Card */}
        <div className="w-full lg:w-5/12 flex flex-col justify-center items-center p-6 lg:p-8 relative z-20">

          {/* Language Selector & Theme Toggle */}
          <div className="absolute top-6 right-6 lg:top-8 lg:right-8 z-30 flex items-center gap-3">
            <LanguageSelector variant="auth" />
            <ThemeToggleButton />
          </div>

          <div className="bg-white rounded-[2rem] p-8 lg:p-10 w-full max-w-[420px] shadow-[0_20px_50px_rgb(0,0,0,0.08)] border border-gray-100 mt-12 lg:mt-0 opacity-0" style={{ animation: 'slide-up 0.8s ease-out 0.2s forwards, border-glow-once 1.5s ease-out 1s forwards' }}>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Reset Password</h1>
                <p className="text-gray-500 dark:text-gray-400">Enter your email to receive an OTP.</p>
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
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50/50 dark:bg-gray-900/60 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#0A4222] dark:bg-emerald-600 hover:bg-green-900 dark:hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-70"
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </button>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Enter OTP</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/60 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-center tracking-[0.5em] font-mono text-xl outline-none"
                      placeholder="------"
                      maxLength={6}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#0A4222] dark:bg-emerald-600 hover:bg-green-900 dark:hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all active:scale-[0.98]"
                  >
                    Verify OTP
                  </button>
                </form>
              )}

              {step === 3 && (
                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50/50 dark:bg-gray-900/60 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                        placeholder="••••••••"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#0A4222] dark:bg-emerald-600 hover:bg-green-900 dark:hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-70"
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </form>
              )}
              
              <div className="mt-8 text-center">
                <Link to="/signin" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:text-emerald-700 dark:hover:text-emerald-300">
                  Back to Sign In
                </Link>
              </div>
            </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200/60 dark:border-gray-800/80 py-3.5 px-8 lg:px-16 flex flex-col md:flex-row justify-between items-center z-30">
        <div className="flex items-center gap-2.5 mb-3 md:mb-0">
          <Shield className="text-gray-400 dark:text-gray-500" size={18} strokeWidth={2.5} />
          <div>
            <p className="text-[13px] font-bold text-gray-800 dark:text-gray-200 leading-tight">{t('auth.dataSafe')}</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">{t('auth.dataSafeDesc')}</p>
          </div>
        </div>
        <div className="flex gap-5 text-[11px] font-bold text-gray-500 dark:text-gray-400 tracking-wide">
          {[
            { key: 'about', label: t('auth.aboutUs') },
            { key: 'privacy', label: t('auth.privacyPolicy') },
            { key: 'terms', label: t('auth.termsAndConditions') },
            { key: 'contact', label: t('auth.contactUs') }
          ].map((item, i, arr) => (
            <React.Fragment key={item.key}>
              <a href="#" className="hover:text-green-700 dark:hover:text-emerald-400 transition-colors">{item.label}</a>
              {i < arr.length - 1 && <span className="text-gray-300 dark:text-gray-700">|</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

          </div>
  );
}