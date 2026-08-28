import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import hi from './locales/hi.json';
import gu from './locales/gu.json';
import mr from './locales/mr.json';
import bn from './locales/bn.json';
import ta from './locales/ta.json';
import te from './locales/te.json';
import kn from './locales/kn.json';
import ml from './locales/ml.json';
import pa from './locales/pa.json';

export const supportedLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
];

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  gu: { translation: gu },
  mr: { translation: mr },
  bn: { translation: bn },
  ta: { translation: ta },
  te: { translation: te },
  kn: { translation: kn },
  ml: { translation: ml },
  pa: { translation: pa },
};

const getInitialLanguage = (): string => {
  try {
    const saved = localStorage.getItem('vyaparmitra_language') || localStorage.getItem('i18nextLng');
    if (saved) {
      const code = saved.split('-')[0];
      if (resources[code as keyof typeof resources]) {
        return code;
      }
    }
  } catch (e) {
    console.error('Error reading saved language:', e);
  }
  return 'en';
};

const initialLang = getInitialLanguage();

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLang,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'vyaparmitra_language',
    },
  });

export const setAppLanguage = (langCode: string) => {
  i18n.changeLanguage(langCode);
  try {
    localStorage.setItem('vyaparmitra_language', langCode);
    localStorage.setItem('i18nextLng', langCode);
  } catch (e) {
    console.error('Error storing language:', e);
  }
};

export default i18n;
