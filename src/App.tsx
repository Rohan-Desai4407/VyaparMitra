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
import WhatIfSimulator from "./pages/WhatIfSimulator";
import SwotMatrix from "./pages/SwotMatrix";
import FinalReport from "./pages/FinalReport";
import Notifications from "./pages/Notifications";

// Other Pages
import UserProfiles from "./pages/UserProfiles";
import NotFound from "./pages/OtherPage/NotFound";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import ForgotPassword from "./pages/AuthPages/ForgotPassword";
import LandingPage from "./pages/LandingPage";
import { AdminProtectedRoute } from "./components/auth/AdminProtectedRoute";
import AdminLayout from "./layout/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminAssessments from "./pages/Admin/AdminAssessments";
import AdminMarket from "./pages/Admin/AdminMarket";
import AdminFinance from "./pages/Admin/AdminFinance";
import AdminSchemes from "./pages/Admin/AdminSchemes";
import AdminAiAdvisor from "./pages/Admin/AdminAiAdvisor";
import AdminNotifications from "./pages/Admin/AdminNotifications";
import AdminLanguages from "./pages/Admin/AdminLanguages";
import AdminAnalytics from "./pages/Admin/AdminAnalytics";
import AdminReports from "./pages/Admin/AdminReports";
import AdminContent from "./pages/Admin/AdminContent";
import AdminManagement from "./pages/Admin/AdminManagement";
import AdminAuditLogs from "./pages/Admin/AdminAuditLogs";
import AdminSettings from "./pages/Admin/AdminSettings";

function RootRoute() {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/dashboard" replace /> : <LandingPage />;
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
              <Route path="/what-if-simulator" element={<WhatIfSimulator />} />
              <Route path="/swot-matrix" element={<SwotMatrix />} />
              <Route path="/final-report" element={<FinalReport />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile" element={<UserProfiles />} />
            </Route>

            {/* Restricted Admin Area */}
            <Route element={<AdminProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/assessments" element={<AdminAssessments />} />
                <Route path="/admin/opportunities" element={<AdminAssessments />} />
                <Route path="/admin/categories" element={<AdminDashboard />} />
                <Route path="/admin/market" element={<AdminMarket />} />
                <Route path="/admin/finance" element={<AdminFinance />} />
                <Route path="/admin/schemes" element={<AdminSchemes />} />
                <Route path="/admin/ai" element={<AdminAiAdvisor />} />
                <Route path="/admin/notifications" element={<AdminNotifications />} />
                <Route path="/admin/languages" element={<AdminLanguages />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
                <Route path="/admin/reports" element={<AdminReports />} />
                <Route path="/admin/content" element={<AdminContent />} />
                <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
              </Route>
            </Route>

            {/* Super Admin Only Area */}
            <Route element={<AdminProtectedRoute requireSuperAdmin />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/admins" element={<AdminManagement />} />
              </Route>
            </Route>

            {/* Auth Layout */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </VyaparProvider>
  );
}
