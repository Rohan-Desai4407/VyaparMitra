import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { useState, useEffect } from "react";
import { VyaparProvider } from "./context/VyaparContext";
import { NotificationProvider } from "./context/NotificationContext";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";

// VyaparMitra Module Pages
import Home from "./pages/Dashboard/Home";
import BusinessAssessmentForm from "./pages/BusinessAssessmentForm";
import MarketAnalysis from "./pages/MarketAnalysis";
import FinancialPlanner from "./pages/FinancialPlanner";
import SchemeRouter from "./pages/SchemeRouter";
import RepaymentSchedule from "./pages/RepaymentSchedule";
import AiAdvisor from "./pages/AiAdvisor";
import SwotMatrix from "./pages/SwotMatrix";
import FinalReport from "./pages/FinalReport";
import Notifications from "./pages/Notifications";

// Other Pages
import UserProfiles from "./pages/UserProfiles";
import NotFound from "./pages/OtherPage/NotFound";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import LandingPage from "./pages/LandingPage";

function RootRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };

    checkAuth();
    // Listen for storage events (e.g. login/logout)
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  if (isAuthenticated === null) {
    return null; // Initial load check
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <LandingPage />;
}

export default function App() {
  return (
    <VyaparProvider>
      <NotificationProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Public Root Route */}
            <Route path="/" element={<RootRoute />} />

            {/* Dashboard Main Layout */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Home />} />
              <Route path="/assessment" element={<BusinessAssessmentForm />} />
              <Route path="/market-analysis" element={<MarketAnalysis />} />
              <Route path="/financial-planner" element={<FinancialPlanner />} />
              <Route path="/scheme-router" element={<SchemeRouter />} />
              <Route path="/repayment-schedule" element={<RepaymentSchedule />} />
              <Route path="/ai-advisor" element={<AiAdvisor />} />
              <Route path="/swot-matrix" element={<SwotMatrix />} />
              <Route path="/final-report" element={<FinalReport />} />
              <Route path="/notifications" element={<Notifications />} />

              {/* Profile & Settings */}
              <Route path="/profile" element={<UserProfiles />} />
            </Route>

            {/* Auth Layout */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </VyaparProvider>
  );
}
