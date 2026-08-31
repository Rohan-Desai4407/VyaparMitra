import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import "./i18n";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";


const originalToLocaleString = Number.prototype.toLocaleString;
Number.prototype.toLocaleString = function(locales, options) {
  if (locales === 'en-IN') {
    try {
      const lang = window.localStorage.getItem('vyaparmitra_language') || window.localStorage.getItem('i18nextLng') || 'en';
      const map: Record<string, string> = { hi: 'deva', gu: 'gujr', mr: 'deva', bn: 'beng', ta: 'tamldec', te: 'telu', kn: 'knda', ml: 'mlym', pa: 'guru', or: 'orya' };
      const code = lang.split('-')[0];
      if (code && code !== 'en') {
        const ext = map[code] ? '-u-nu-' + map[code] : '';
        return originalToLocaleString.call(this, code + '-IN' + ext, options);
      }
    } catch(e) {}
  }
  return originalToLocaleString.call(this, locales, options);
};


const googleClientId =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "309270348427-2edbuvphstl51a1v4es85d3m7vh210la.apps.googleusercontent.com";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <ThemeProvider>
        <AppWrapper>
          <App />
        </AppWrapper>
      </ThemeProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
