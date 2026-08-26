import { BrowserRouter as Router, Routes, Route } from "react-router";
import { VyaparProvider } from "./context/VyaparContext";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";

// VyaparMitra Module Pages
import Home from "./pages/Dashboard/Home";
import LandingPage from "./pages/LandingPage";
import BusinessAssessmentForm from "./pages/BusinessAssessmentForm";
import MarketAnalysis from "./pages/MarketAnalysis";
import FinancialPlanner from "./pages/FinancialPlanner";
import RepaymentSchedule from "./pages/RepaymentSchedule";
import AiAdvisor from "./pages/AiAdvisor";
import FinalReport from "./pages/FinalReport";

// Other Pages
import UserProfiles from "./pages/UserProfiles";
import NotFound from "./pages/OtherPage/NotFound";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";

export default function App() {
  return (
    <VyaparProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Main Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/assessment" element={<BusinessAssessmentForm />} />
            <Route path="/market-analysis" element={<MarketAnalysis />} />
            <Route path="/financial-planner" element={<FinancialPlanner />} />
            <Route path="/repayment-schedule" element={<RepaymentSchedule />} />
            <Route path="/ai-advisor" element={<AiAdvisor />} />
            <Route path="/final-report" element={<FinalReport />} />

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
    </VyaparProvider>
  );
}
