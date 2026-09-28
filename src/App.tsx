import { lazy, Suspense } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import MainLayout from "@/app/layouts/MainLayout";
import { RequireAuth, RequireRole } from "@/app/router/RequireAuth";

// Dashboard Pages
const Login = lazy(() =>
  import("@/modules/auth/pages/LoginPage").then((m) => ({
    default: m.LoginPage,
  })),
);
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const TradingAccounts = lazy(() => import("./pages/TradingAccounts.tsx"));
const Downloads = lazy(() => import("./pages/Downloads.tsx"));
const Deposit = lazy(() => import("./pages/Deposit.tsx"));
const Withdrawal = lazy(() => import("./pages/Withdrawal.tsx"));
const FundsHistory = lazy(() => import("./pages/FundsHistory.tsx"));
const PartnerRoom = lazy(() => import("./pages/PartnerRoom.tsx"));
const ReferEarn = lazy(() => import("./pages/ReferEarn.tsx"));
const Profile = lazy(() => import("./pages/Profile.tsx"));
const Instructions = lazy(() => import("./pages/Instructions.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

// Admin Pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.tsx"));
const ClientsList = lazy(() => import("./pages/admin/ClientsList.tsx"));
const PlansList = lazy(() => import("./pages/admin/PlansList.tsx"));
const SmtpSettings = lazy(() => import("./pages/admin/SmtpSettings.tsx"));
const EmailersList = lazy(() => import("./pages/admin/EmailersList.tsx"));
const RepresentativesList = lazy(
  () => import("./pages/admin/RepresentativesList.tsx"),
);
const Mt5AccountsList = lazy(() => import("./pages/admin/Mt5AccountsList.tsx"));
const TransactionsList = lazy(
  () => import("./pages/admin/TransactionsList.tsx"),
);
const AuditLogs = lazy(() => import("./pages/admin/AuditLogs.tsx"));
const DepositInstructionsAdmin = lazy(
  () => import("./pages/admin/DepositInstructionsAdmin.tsx"),
);

// Landing Pages
const LandingLayout = lazy(() => import("./pages/landing/LandingLayout.tsx"));
const Home = lazy(() => import("./pages/landing/Home.tsx"));
const About = lazy(() => import("./pages/landing/About.tsx"));
const Contact = lazy(() => import("./pages/landing/Contact.tsx"));
const Forex = lazy(() => import("./pages/landing/Forex.tsx"));
const Commodities = lazy(() => import("./pages/landing/Commodities.tsx"));
const Stocks = lazy(() => import("./pages/landing/Stocks.tsx"));
const VPS = lazy(() => import("./pages/landing/VPS.tsx"));
const Platform = lazy(() => import("./pages/landing/Platform.tsx"));
const WhyChooseUs = lazy(() => import("./pages/landing/WhyChooseUs.tsx"));
const Accounts = lazy(() => import("./pages/landing/Accounts.tsx"));
const IB = lazy(() => import("./pages/landing/IB.tsx"));
const Cryptocurrencies = lazy(
  () => import("./pages/landing/Cryptocurrencies.tsx"),
);
const Tools = lazy(() => import("./pages/landing/Tools.tsx"));
const Affiliates = lazy(() => import("./pages/landing/Affiliates.tsx"));
const Loyalty = lazy(() => import("./pages/landing/Loyalty.tsx"));
const Legal = lazy(() => import("./pages/landing/Legal.tsx"));
const FundingGuides = lazy(() => import("./pages/landing/FundingGuides.tsx"));

function Loading() {
  return (
    <div className="flex items-center justify-center h-full min-h-[60vh] bg-background">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

const ImpersonateHandler = lazy(
  () => import("./pages/auth/ImpersonateHandler.tsx"),
);
const ResetPasswordPage = lazy(
  () => import("./pages/auth/ResetPasswordPage.tsx"),
);

const App = () => (
  <Suspense fallback={<Loading />}>
    <Routes>
      {/* Public Landing Pages */}
      <Route element={<LandingLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Trading Links */}
        <Route path="/forex" element={<Forex />} />
        <Route path="/commodities" element={<Commodities />} />
        <Route path="/stocks" element={<Stocks />} />
        <Route path="/cryptocurrencies" element={<Cryptocurrencies />} />
        <Route path="/vps" element={<VPS />} />
        <Route path="/platform" element={<Platform />} />
        <Route path="/tools" element={<Tools />} />
        <Route
          path="/how-to-deposit"
          element={<FundingGuides type="deposit" />}
        />
        <Route
          path="/how-to-withdraw"
          element={<FundingGuides type="withdraw" />}
        />

        {/* Company Links */}
        <Route path="/why-choose-us" element={<WhyChooseUs />} />
        <Route path="/accounts" element={<Accounts />} />

        {/* Partner Links */}
        <Route path="/ib" element={<IB />} />
        <Route path="/affiliates" element={<Affiliates />} />
        <Route path="/loyalty" element={<Loyalty />} />

        {/* Legal Links */}
        <Route path="/privacy" element={<Legal type="privacy" />} />
        <Route path="/terms" element={<Legal type="terms" />} />
        <Route
          path="/trading-conditions"
          element={<Legal type="conditions" />}
        />
        <Route path="/risk" element={<Legal type="risk" />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/auth/impersonate" element={<ImpersonateHandler />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected Dashboard Pages */}
      <Route
        element={
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/funds/deposit" element={<Deposit />} />
        <Route path="/funds/withdrawal" element={<Withdrawal />} />
        <Route path="/funds/history" element={<FundsHistory />} />
        <Route path="/trading/accounts" element={<TradingAccounts />} />
        <Route path="/trading/downloads" element={<Downloads />} />
        <Route path="/ib/partner" element={<PartnerRoom />} />
        <Route path="/ib/refer" element={<ReferEarn />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/instructions" element={<Instructions />} />

        {/* Admin Routes — additionally gated by superadmin role so a client
            who pastes /admin/clients into the URL bar gets bounced back to
            their own dashboard instead of seeing the admin shell. */}
        <Route
          element={
            <RequireRole allow="superadmin">
              {/* Outlet is rendered by the parent MainLayout; RequireRole
                  just gates whether the nested admin pages render. */}
              <Outlet />
            </RequireRole>
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/clients" element={<ClientsList />} />
          <Route path="/admin/plans" element={<PlansList />} />
          <Route path="/admin/smtp" element={<SmtpSettings />} />
          <Route path="/admin/emailers" element={<EmailersList />} />
          <Route
            path="/admin/representatives"
            element={<RepresentativesList />}
          />
          <Route path="/admin/mt5-accounts" element={<Mt5AccountsList />} />
          <Route path="/admin/transactions" element={<TransactionsList />} />
          <Route
            path="/admin/deposit-instructions"
            element={<DepositInstructionsAdmin />}
          />
          <Route path="/admin/logs" element={<AuditLogs />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

export default App;
