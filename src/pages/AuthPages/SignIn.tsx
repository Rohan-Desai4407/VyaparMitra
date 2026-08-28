import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Mail, Lock, CheckCircle2, Map, Shield } from 'lucide-react';
import { LanguageSelector } from '../../components/common/LanguageSelector';

export default function SignIn() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('admin@vyaparmitra.in');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError(t('auth.enterCredentials'));
      return;
    }
    setError('');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col relative font-sans overflow-hidden bg-[#f6f3eb]">

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
        <div className="absolute top-0 left-0 right-0 h-[35vh] bg-gradient-to-b from-[#f6f3eb] via-[#f6f3eb]/60 to-transparent pointer-events-none" />
        {/* Right fade for login card readability */}
        <div className="absolute inset-0 bg-gradient-to-l from-white/65 via-white/10 to-transparent pointer-events-none" />
      </div>

      {/* ── PAGE CONTENT ── */}
      <div className="flex-1 flex flex-col lg:flex-row w-full relative z-10 pb-16">

        {/* LEFT */}
        <div className="w-full lg:w-7/12 flex flex-col p-8 lg:p-12 xl:p-16 opacity-0" style={{ animation: 'slide-up 0.8s ease-out forwards' }}>
          <div className="max-w-3xl">
            {/* Logo */}
            <div className="mb-8">
              <img src="/logo.png" alt="VyaparMitra"
                className="h-20 lg:h-24 object-contain"
                style={{ mixBlendMode: 'multiply' }} />
            </div>

            <h2 className="text-3xl lg:text-4xl xl:text-[2.5rem] font-extrabold text-gray-900 leading-[1.2]">
              {t('auth.heroTitle1')}{' '}
              <span className="text-green-700">{t('auth.heroHighlight1')}</span>
              <br/>
              <span className="whitespace-nowrap">
                {t('auth.heroTitle2')}{' '}
                <span className="text-gray-900">{t('auth.heroHighlight2')}</span>
              </span>
            </h2>
          </div>
        </div>

        {/* STATS BAR — bottom-left above footer */}
        <div className="hidden lg:flex absolute bottom-[52px] left-8 xl:left-12 z-30 bg-[#0A4222] text-white px-4 py-4 rounded-2xl items-center shadow-2xl border border-green-800/30">
          {[
            { val: t('auth.stat1Val'), label: t('auth.stat1Label') },
            { val: t('auth.stat2Val'), label: t('auth.stat2Label') },
            { val: t('auth.stat3Val'), label: t('auth.stat3Label') },
            { val: t('auth.stat4Val'), label: t('auth.stat4Label') },
          ].map((s, i, arr) => (
            <div key={i}
              className={`text-center px-5 hover:scale-105 transition-transform cursor-default ${i < arr.length - 1 ? 'border-r border-green-700/50' : ''}`}>
              <div className="font-bold text-[1.5rem] leading-none">{s.val}</div>
              <div className="text-[9px] uppercase tracking-wider text-green-100/80 mt-1.5 font-semibold whitespace-pre-line">{s.label}</div>
            </div>
          ))}
        </div>

        {/* RIGHT — Sign In Card */}
        <div className="w-full lg:w-5/12 flex flex-col justify-center items-center p-6 lg:p-8 relative z-20">

          {/* Language Selector */}
          <div className="absolute top-8 right-8 z-30">
            <LanguageSelector variant="auth" />
          </div>

          <div className="bg-white rounded-[2rem] p-8 lg:p-10 w-full max-w-[420px] shadow-[0_20px_50px_rgb(0,0,0,0.08)] border border-gray-100 mt-12 lg:mt-0 opacity-0" style={{ animation: 'slide-up 0.8s ease-out 0.2s forwards' }}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
                {t('auth.welcomeBack')}
              </h2>
              <p className="text-gray-500 text-sm font-medium">
                {t('auth.loginSubtitle')}
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl font-medium text-center border border-red-100">
                  {error}
                </div>
              )}
              <div className="group">
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5 group-focus-within:text-green-700 transition-colors">
                  {t('auth.emailOrMobile')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-600 transition-colors">
                    <Mail size={18} strokeWidth={2.5} />
                  </div>
                  <input type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:border-green-600 placeholder-gray-400 transition-all bg-gray-50/50 focus:bg-white text-gray-900 text-sm font-medium outline-none"
                    placeholder={t('auth.emailOrMobilePlaceholder')} />
                </div>
              </div>

              <div className="group">
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5 group-focus-within:text-green-700 transition-colors">
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-600 transition-colors">
                    <Lock size={18} strokeWidth={2.5} />
                  </div>
                  <input type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:border-green-600 placeholder-gray-400 transition-all bg-gray-50/50 focus:bg-white text-gray-900 text-sm font-medium outline-none"
                    placeholder={t('auth.passwordPlaceholder')} />
                  <button type="button"
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-green-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} strokeWidth={2.5} /> : <Eye size={18} strokeWidth={2.5} />}
                  </button>
                </div>
                <div className="flex justify-end mt-2">
                  <a href="#" className="text-[12px] text-green-700 font-bold hover:text-green-800 transition-colors">
                    {t('auth.forgotPassword')}
                  </a>
                </div>
              </div>

              <button type="submit"
                className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-[#0A4222] hover:bg-green-900 transition-all mt-6 tracking-wide hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2">
                <CheckCircle2 size={18} strokeWidth={2.5} className="mr-2 opacity-90" /> {t('auth.loginButton')}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-4 bg-white text-gray-400 font-medium">{t('auth.orContinueWith')}</span>
                </div>
              </div>
              <div className="space-y-3">
                <button type="button" onClick={() => navigate('/')} className="group w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl bg-white text-[13px] font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  {t('auth.continueWithGoogle')}
                </button>
                <button type="button" onClick={() => navigate('/')} className="group w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl bg-white text-[13px] font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
                  <Map size={18} className="text-gray-500 group-hover:text-green-600 transition-all" strokeWidth={2.5} />
                  {t('auth.continueWithMobile')}
                </button>
              </div>
            </div>

            <p className="mt-8 text-center text-[13px] font-medium text-gray-600">
              {t('auth.noAccount')}{' '}
              <Link to="/signup" className="font-bold text-green-700 hover:text-green-800 ml-1 transition-colors">
                {t('auth.signup')}
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200/60 py-3.5 px-8 lg:px-16 flex flex-col md:flex-row justify-between items-center z-30">
        <div className="flex items-center gap-2.5 mb-3 md:mb-0">
          <Shield className="text-gray-400" size={18} strokeWidth={2.5} />
          <div>
            <p className="text-[13px] font-bold text-gray-800 leading-tight">{t('auth.dataSafe')}</p>
            <p className="text-[11px] text-gray-500 font-medium">{t('auth.dataSafeDesc')}</p>
          </div>
        </div>
        <div className="flex gap-5 text-[11px] font-bold text-gray-500 tracking-wide">
          {[
            { key: 'about', label: t('auth.aboutUs') },
            { key: 'privacy', label: t('auth.privacyPolicy') },
            { key: 'terms', label: t('auth.termsAndConditions') },
            { key: 'contact', label: t('auth.contactUs') }
          ].map((item, i, arr) => (
            <React.Fragment key={item.key}>
              <a href="#" className="hover:text-green-700 transition-colors">{item.label}</a>
              {i < arr.length - 1 && <span className="text-gray-300">|</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

    </div>
  );
}
