import React from 'react';
import PageMeta from '../components/common/PageMeta';
import { Mail, Phone, LifeBuoy, MapPin, Building, Globe, Clock, ShieldCheck } from 'lucide-react';

export default function Support() {
  const contacts = [
    { name: 'Namra Dabhi', phone: '+91 9023091858', email: 'namradabhi1613@gmail.com' },
    { name: 'Sneh Bhikadiya', phone: '+91 8799370676', email: 'snehbhikadiya872@gmail.com' },
    { name: 'Rohan Desai', phone: '+91 9265566887', email: 'rohandesai898@gmail.com' },
    { name: 'Dhruv Paramar', phone: '+91 8799613886', email: 'dhruvparamar000@gmail.com' }
  ];

  return (
    <>
      <PageMeta title="Support & Contact | VyaparMitra" description="Get help and contact the VyaparMitra support team." />
      
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="h-20 w-20 rounded-2xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center shrink-0 border border-brand-100 dark:border-brand-800/50">
              <LifeBuoy className="w-10 h-10 text-brand-500" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">How can we help you today?</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-2xl text-sm md:text-base leading-relaxed">
                Whether you have a question about the What-If Simulator, need help generating a business report, or are facing technical issues, our dedicated support team is here to assist you.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links & Office Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Phone className="w-5 h-5 text-gray-400" /> 
              Direct Contact Team
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contacts.map((contact, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all duration-200 group">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{contact.name}</h3>
                    <span className="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xs font-bold">0{idx + 1}</span>
                  </div>
                  <div className="space-y-3">
                    <a href={`tel:${contact.phone}`} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/20">
                        <Phone className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{contact.phone}</span>
                    </a>
                    <a href={`mailto:${contact.email}`} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/20">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span className="font-medium truncate">{contact.email}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Office & Timings</h2>
              <ul className="space-y-4">
                <li className="flex gap-3 text-sm text-gray-600 dark:text-gray-300">
                  <Clock className="w-5 h-5 text-gray-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Support Hours</p>
                    <p>Monday - Friday: 9:00 AM to 6:00 PM (IST)</p>
                  </div>
                </li>
                <li className="flex gap-3 text-sm text-gray-600 dark:text-gray-300">
                  <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Headquarters</p>
                    <p>VyaparMitra Inc.<br/>Ahmedabad, Gujarat, India</p>
                  </div>
                </li>
                <li className="flex gap-3 text-sm text-gray-600 dark:text-gray-300">
                  <Globe className="w-5 h-5 text-gray-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Website</p>
                    <a href="https://vyaparmitra.in" className="text-brand-600 hover:underline">www.vyaparmitra.in</a>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-brand-900/40 rounded-3xl p-6 shadow-sm border border-blue-100 dark:border-brand-800 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
               <ShieldCheck className="w-8 h-8 text-brand-600 dark:text-brand-400 mb-3" />
               <h3 className="font-bold text-lg mb-2 text-blue-900 dark:text-white">Secure & Confidential</h3>
               <p className="text-blue-800/80 dark:text-gray-300 text-sm leading-relaxed">
                 All your business and financial data is strictly confidential. Our support team will never ask for your passwords or OTPs.
               </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
