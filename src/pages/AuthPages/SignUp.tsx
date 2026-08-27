import React, { useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Mail, Lock, User, Phone, CheckCircle2, Map, Shield } from 'lucide-react';
import { LanguageSelector } from '../../components/common/LanguageSelector';

export default function SignUp() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

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
        {/* Top fade */}
        <div className="absolute top-0 left-0 right-0 h-[35vh] bg-gradient-to-b from-[#f6f3eb] via-[#f6f3eb]/60 to-transparent pointer-events-none" />
        {/* Right fade for card readability */}
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
              {t('auth.signupHeroTitle1')}{' '}
              <span className="text-green-700">{t('auth.signupHeroHighlight1')}</span>
              <br/>
              <span className="whitespace-nowrap">
                {t('auth.signupHeroTitle2')}{' '}
                <span className="text-gray-900">{t('auth.signupHeroHighlight2')}</span>
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

        {/* RIGHT — Sign Up Card */}
        <div className="w-full lg:w-5/12 flex flex-col justify-center items-center p-6 lg:p-8 relative z-20">

          {/* Language Selector */}
          <div className="absolute top-8 right-8 z-30">
            <LanguageSelector variant="auth" />
          </div>

          <div className="bg-white rounded-[2rem] p-8 lg:p-9 w-full max-w-[440px] shadow-[0_20px_50px_rgb(0,0,0,0.08)] border border-gray-100 mt-12 lg:mt-0 opacity-0" style={{ animation: 'slide-up 0.8s ease-out 0.2s forwards' }}>
            <div className="text-center mb-7">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-1.5 tracking-tight">
                {t('auth.createAccount')}
              </h2>
              <p className="text-gray-500 text-sm font-medium">
                {t('auth.signupSubtitle')}
              </p>
            </div>

            {/* Social signup */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button type="button" className="group flex items-center justify-center gap-2 py-2.5 px-3 border border-gray-200 rounded-xl bg-white text-[12px] font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-4 w-4 group-hover:scale-110 transition-transform" />
                {t('auth.signUpWithGoogle')}
              </button>
              <button type="button" className="group flex items-center justify-center gap-2 py-2.5 px-3 border border-gray-200 rounded-xl bg-white text-[12px] font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
                <Map size={15} className="text-gray-500 group-hover:text-green-600 transition-all" strokeWidth={2.5} />
                {t('auth.mobileOtp')}
              </button>
            </div>

            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-white text-gray-400 font-medium">{t('auth.orSignUpWithEmail')}</span>
              </div>
            </div>

            <form className="space-y-4">
              {/* First & Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div className="group">
                  <label className="block text-[12px] font-semibold text-gray-700 mb-1 group-focus-within:text-green-700 transition-colors">
                    {t('auth.firstName')} <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-600 transition-colors">
                      <User size={15} strokeWidth={2.5} />
                    </div>
                    <input type="text"
                      className="block w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl focus:border-green-600 placeholder-gray-400 transition-all bg-gray-50/50 focus:bg-white text-gray-900 text-sm font-medium outline-none"
                      placeholder={t('auth.firstNamePlaceholder')} />
                  </div>
                </div>
                <div className="group">
                  <label className="block text-[12px] font-semibold text-gray-700 mb-1 group-focus-within:text-green-700 transition-colors">
                    {t('auth.lastName')} <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-600 transition-colors">
                      <User size={15} strokeWidth={2.5} />
                    </div>
                    <input type="text"
                      className="block w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl focus:border-green-600 placeholder-gray-400 transition-all bg-gray-50/50 focus:bg-white text-gray-900 text-sm font-medium outline-none"
                      placeholder={t('auth.lastNamePlaceholder')} />
                  </div>
                </div>
              </div>

              {/* Mobile */}
              <div className="group">
                <label className="block text-[12px] font-semibold text-gray-700 mb-1 group-focus-within:text-green-700 transition-colors">
                  {t('auth.mobileNumber')} <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-600 transition-colors">
                    <Phone size={16} strokeWidth={2.5} />
                  </div>
                  <input type="tel"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:border-green-600 placeholder-gray-400 transition-all bg-gray-50/50 focus:bg-white text-gray-900 text-sm font-medium outline-none"
                    placeholder={t('auth.mobilePlaceholder')} />
                </div>
              </div>

              {/* Email */}
              <div className="group">
                <label className="block text-[12px] font-semibold text-gray-700 mb-1 group-focus-within:text-green-700 transition-colors">
                  {t('auth.email')} <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-600 transition-colors">
                    <Mail size={16} strokeWidth={2.5} />
                  </div>
                  <input type="email"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:border-green-600 placeholder-gray-400 transition-all bg-gray-50/50 focus:bg-white text-gray-900 text-sm font-medium outline-none"
                    placeholder={t('auth.emailPlaceholder')} />
                </div>
              </div>

              {/* Password */}
              <div className="group">
                <label className="block text-[12px] font-semibold text-gray-700 mb-1 group-focus-within:text-green-700 transition-colors">
                  {t('auth.password')} <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-600 transition-colors">
                    <Lock size={16} strokeWidth={2.5} />
                  </div>
                  <input type={showPassword ? 'text' : 'password'}
                    className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:border-green-600 placeholder-gray-400 transition-all bg-gray-50/50 focus:bg-white text-gray-900 text-sm font-medium outline-none"
                    placeholder={t('auth.createPasswordPlaceholder')} />
                  <button type="button"
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-green-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={16} strokeWidth={2.5} /> : <Eye size={16} strokeWidth={2.5} />}
                  </button>
                </div>
              </div>

              {/* Terms checkbox */}
              <label className="flex items-start gap-3 cursor-pointer mt-1">
                <div className="relative flex-shrink-0 mt-0.5">
                  <input type="checkbox" className="sr-only" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${agreed ? 'bg-green-700 border-green-700' : 'border-gray-300 bg-white'}`}>
                    {agreed && <CheckCircle2 size={10} className="text-white" strokeWidth={3} />}
                  </div>
                </div>
                <span className="text-[12px] text-gray-600 font-medium leading-relaxed">
                  {t('auth.termsAgree')}{' '}
                  <a href="#" className="text-green-700 font-bold hover:text-green-800">{t('auth.termsAndConditions')}</a>
                  {' '}{t('auth.and')}{' '}
                  <a href="#" className="text-green-700 font-bold hover:text-green-800">{t('auth.privacyPolicy')}</a>
                </span>
              </label>

              <button type="button"
                className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#0A4222] hover:bg-green-900 transition-all mt-2 tracking-wide hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2">
                <CheckCircle2 size={17} strokeWidth={2.5} className="mr-2 opacity-90" /> {t('auth.signupButton')}
              </button>
            </form>

            <p className="mt-6 text-center text-[13px] font-medium text-gray-600">
              {t('auth.haveAccount')}{' '}
              <Link to="/signin" className="font-bold text-green-700 hover:text-green-800 ml-1 transition-colors">
                {t('auth.login')}
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
