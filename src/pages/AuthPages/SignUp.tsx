import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Mail, Lock, User, Phone, CheckCircle2, Shield } from 'lucide-react';
import { LanguageSelector } from '../../components/common/LanguageSelector';
import { ThemeToggleButton } from '../../components/common/ThemeToggleButton';
import { GoogleAccountModal } from '../../components/auth/GoogleAccountModal';

export default function SignUp() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const handleGoogleAccountSelected = (account: { name: string; email: string; avatar?: string }) => {
    const parts = (account.name || '').trim().split(' ');
    const fName = parts[0] || '';
    const lName = parts.slice(1).join(' ') || '';

    setFirstName(fName);
    setLastName(lName);
    setEmail(account.email || '');
    setStatusMsg({ text: `✓ Connected Google account (${account.email}). Please enter your mobile number and password to complete registration.`, isError: false });
  };

  useEffect(() => {
    if (location.state?.googleAccount) {
      handleGoogleAccountSelected(location.state.googleAccount);
    }
  }, [location.state]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setStatusMsg({ text: 'Please agree to the Terms and Privacy Policy.', isError: true });
      return;
    }
    if (!firstName || !lastName || !email || !password) {
      setStatusMsg({ text: 'Please fill all required fields.', isError: true });
      return;
    }

    setIsRegistering(true);
    setStatusMsg(null);

    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `${firstName} ${lastName}`, email, password })
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ text: 'OTP sent to your email! Please verify.', isError: false });
        setShowOtpModal(true);
      } else {
        setStatusMsg({ text: data.message || 'Registration failed', isError: true });
      }
    } catch (err: any) {
      setStatusMsg({ text: err.message || 'Network error', isError: true });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return;
    try {
      const res = await fetch('http://localhost:3001/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: otp })
      });
      const data = await res.json();
      if (data.success) {
        if (data.data && data.data.token && data.data.user) {
          localStorage.setItem('token', data.data.token);
          localStorage.setItem('user', JSON.stringify(data.data.user));
          // Store userName separately for backwards compatibility
          localStorage.setItem('userName', data.data.user.name);
            window.dispatchEvent(new Event('userUpdated'));
        }
        setStatusMsg({ text: 'Email verified successfully! Logging you in...', isError: false });
        setShowOtpModal(false);
        setTimeout(() => navigate('/'), 1000);
      } else {
        setStatusMsg({ text: data.message || 'Verification failed', isError: true });
      }
    } catch (err: any) {
      setStatusMsg({ text: err.message || 'Network error', isError: true });
    }
  };


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
        {/* Top fade */}
        <div className="absolute top-0 left-0 right-0 h-[35vh] bg-gradient-to-b from-[#f6f3eb] via-[#f6f3eb]/60 to-transparent dark:from-gray-900 dark:via-gray-900/60 pointer-events-none" />
        {/* Right fade for card readability */}
        <div className="absolute inset-0 bg-gradient-to-l from-white/65 via-white/10 to-transparent dark:from-gray-900/90 dark:via-gray-900/50 pointer-events-none" />
      </div>

      {/* ── PAGE CONTENT ── */}
      <div className="flex-1 flex flex-col lg:flex-row w-full relative z-10 pb-16">

        {/* LEFT */}
        <div className="w-full lg:w-7/12 flex flex-col p-8 lg:p-12 xl:p-16 opacity-0" style={{ animation: 'slide-up 0.8s ease-out forwards' }}>
                    <div className="max-w-3xl">
            {statusMsg && (
              <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${statusMsg.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {statusMsg.text}
              </div>
            )}
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
              {t('auth.signupHeroTitle1')}{' '}
              <span className="text-green-700 dark:text-emerald-400">{t('auth.signupHeroHighlight1')}</span>
              <br/>
              <span className="whitespace-nowrap">
                {t('auth.signupHeroTitle2')}{' '}
                <span className="text-gray-900 dark:text-gray-100">{t('auth.signupHeroHighlight2')}</span>
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

        {/* RIGHT — Sign Up Card */}
        <div className="w-full lg:w-5/12 flex flex-col justify-center items-center p-6 lg:p-8 relative z-20">

          {/* Language Selector & Theme Toggle */}
          <div className="absolute top-6 right-6 lg:top-8 lg:right-8 z-30 flex items-center gap-3">
            <LanguageSelector variant="auth" />
            <ThemeToggleButton />
          </div>

          <div className="bg-white rounded-[2rem] p-8 lg:p-9 w-full max-w-[440px] shadow-[0_20px_50px_rgb(0,0,0,0.08)] border border-gray-100 mt-12 lg:mt-0 opacity-0" style={{ animation: 'slide-up 0.8s ease-out 0.2s forwards, border-glow-once 1.5s ease-out 1s forwards' }}>
            <div className="text-center mb-7">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1.5 tracking-tight">
                {t('auth.createAccount')}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                {t('auth.signupSubtitle')}
              </p>
            </div>

            {/* Notifications / Feedback Messages */}
            {statusMsg?.isError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs rounded-xl font-medium text-center border border-red-100 dark:border-red-800/50">
                {statusMsg.text}
              </div>
            )}
            {statusMsg && !statusMsg.isError && (
              <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs rounded-xl font-medium text-center border border-emerald-200 dark:border-emerald-800/50">
                {statusMsg.text}
              </div>
            )}

            {/* Social signup */}
            <div className="mb-6">
              <button type="button" className="w-full group flex items-center justify-center gap-2 py-2.5 px-3 border border-gray-200 rounded-xl bg-white text-[12px] font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-4 w-4 group-hover:scale-110 transition-transform" />
                {t('auth.signUpWithGoogle')}
              </button>
            </div>

            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100 dark:border-gray-700" /></div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-400 font-medium">{t('auth.orSignUpWithEmail')}</span>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleRegister}>
              {/* First & Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div className="group">
                  <label className="block text-[12px] font-semibold text-gray-700 dark:text-gray-300 mb-1 group-focus-within:text-green-700 dark:group-focus-within:text-emerald-400 transition-colors">
                    {t('auth.firstName')} <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-600 dark:group-focus-within:text-emerald-400 transition-colors">
                      <User size={15} strokeWidth={2.5} />
                    </div>
                    <input type="text"
                      className="block w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl focus:border-green-600 placeholder-gray-400 transition-all bg-gray-50/50 focus:bg-white text-gray-900 text-sm font-medium outline-none"
                      placeholder={t('auth.firstNamePlaceholder')} value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                  </div>
                </div>
                <div className="group">
                  <label className="block text-[12px] font-semibold text-gray-700 dark:text-gray-300 mb-1 group-focus-within:text-green-700 dark:group-focus-within:text-emerald-400 transition-colors">
                    {t('auth.lastName')} <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-600 dark:group-focus-within:text-emerald-400 transition-colors">
                      <User size={15} strokeWidth={2.5} />
                    </div>
                    <input type="text"
                      className="block w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl focus:border-green-600 placeholder-gray-400 transition-all bg-gray-50/50 focus:bg-white text-gray-900 text-sm font-medium outline-none"
                      placeholder={t('auth.lastNamePlaceholder')} value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                  </div>
                </div>
              </div>

              {/* Mobile */}
              <div className="group">
                <label className="block text-[12px] font-semibold text-gray-700 dark:text-gray-300 mb-1 group-focus-within:text-green-700 dark:group-focus-within:text-emerald-400 transition-colors">
                  {t('auth.mobileNumber')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-600 dark:group-focus-within:text-emerald-400 transition-colors">
                    <Phone size={16} strokeWidth={2.5} />
                  </div>
                  <input type="tel"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:border-green-600 placeholder-gray-400 transition-all bg-gray-50/50 focus:bg-white text-gray-900 text-sm font-medium outline-none"
                    placeholder={t('auth.mobilePlaceholder')} value={mobile} onChange={(e) => setMobile(e.target.value)} required />
                </div>
              </div>

              {/* Email */}
              <div className="group">
                <label className="block text-[12px] font-semibold text-gray-700 dark:text-gray-300 mb-1 group-focus-within:text-green-700 dark:group-focus-within:text-emerald-400 transition-colors">
                  {t('auth.email')} <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-600 dark:group-focus-within:text-emerald-400 transition-colors">
                    <Mail size={16} strokeWidth={2.5} />
                  </div>
                  <input type="email"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:border-green-600 placeholder-gray-400 transition-all bg-gray-50/50 focus:bg-white text-gray-900 text-sm font-medium outline-none"
                    placeholder={t('auth.emailPlaceholder')} value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>

              {/* Password */}
              <div className="group">
                <label className="block text-[12px] font-semibold text-gray-700 dark:text-gray-300 mb-1 group-focus-within:text-green-700 dark:group-focus-within:text-emerald-400 transition-colors">
                  {t('auth.password')} <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-600 dark:group-focus-within:text-emerald-400 transition-colors">
                    <Lock size={16} strokeWidth={2.5} />
                  </div>
                  <input type={showPassword ? 'text' : 'password'}
                    className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:border-green-600 placeholder-gray-400 transition-all bg-gray-50/50 focus:bg-white text-gray-900 text-sm font-medium outline-none"
                    placeholder={t('auth.createPasswordPlaceholder')} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                  <button type="button"
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-green-600 dark:hover:text-emerald-400 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={16} strokeWidth={2.5} /> : <Eye size={16} strokeWidth={2.5} />}
                  </button>
                </div>
              </div>

              {/* Terms checkbox */}
              <label className="flex items-start gap-3 cursor-pointer mt-1">
                <div className="relative flex-shrink-0 mt-0.5">
                  <input type="checkbox" className="sr-only" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${agreed ? 'bg-green-700 dark:bg-emerald-600 border-green-700 dark:border-emerald-600' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900'}`}>
                    {agreed && <CheckCircle2 size={10} className="text-white" strokeWidth={3} />}
                  </div>
                </div>
                <span className="text-[12px] text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                  {t('auth.termsAgree')}{' '}
                  <a href="#" className="text-green-700 dark:text-emerald-400 font-bold hover:text-green-800 dark:hover:text-emerald-300">{t('auth.termsAndConditions')}</a>
                  {' '}{t('auth.and')}{' '}
                  <a href="#" className="text-green-700 dark:text-emerald-400 font-bold hover:text-green-800 dark:hover:text-emerald-300">{t('auth.privacyPolicy')}</a>
                </span>
              </label>

              <button type="submit"
                disabled={isRegistering}
                className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#0A4222] hover:bg-green-900 transition-all mt-2 tracking-wide hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2">
                <CheckCircle2 size={17} strokeWidth={2.5} className="mr-2 opacity-90" /> {isRegistering ? 'Processing...' : t('auth.signupButton')}
              </button>
            </form>

            <p className="mt-6 text-center text-[13px] font-medium text-gray-600 dark:text-gray-400">
              {t('auth.haveAccount')}{' '}
              <Link to="/signin" className="font-bold text-green-700 dark:text-emerald-400 hover:text-green-800 dark:hover:text-emerald-300 ml-1 transition-colors">
                {t('auth.login')}
              </Link>
            </p>
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
      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Verify Your Email</h3>
            <p className="text-sm text-gray-500 mb-6">We've sent a 6-digit OTP to {email}. Please enter it below to verify your account.</p>
            
            <input 
              type="text" 
              className="w-full text-center text-2xl tracking-[0.5em] font-bold p-4 border border-gray-300 rounded-xl mb-6 focus:border-green-600 focus:ring-2 focus:ring-green-600/20 outline-none transition-all"
              placeholder="------"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            
            <button 
              type="button"
              onClick={handleVerifyOtp}
              className="w-full py-3 bg-[#0A4222] text-white font-bold rounded-xl hover:bg-green-900 transition-all shadow-lg shadow-green-900/20 active:scale-[0.98]"
            >
              Verify OTP & Login
            </button>
            <button 
              type="button"
              onClick={() => setShowOtpModal(false)}
              className="w-full mt-3 py-3 text-gray-500 font-medium hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Google Account Modal */}
      <GoogleAccountModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSelectAccount={handleGoogleAccountSelected}
      />
    </div>
  );
}