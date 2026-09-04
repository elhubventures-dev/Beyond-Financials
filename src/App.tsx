/**
 * Beyond Financials - Primary Application Shell & Dynamic Router Switch
 * Domain: beyondfinancials.ng
 * 
 * Milestone: SERVICES HUB + PRODUCT INFORMATION PAGES
 * Provides client-side SPA routing across Home, Services Hub, and 6 Product Pages.
 */

import React, { useState } from 'react';
import { useRouter } from './router/Router';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { SystemStatusBanner } from './components/landing/SystemStatusBanner';
import { WaitlistModal } from './components/landing/WaitlistModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ServicesHubPage } from './pages/ServicesHubPage';
import { BankingPage } from './pages/BankingPage';
import { SavingsPage } from './pages/SavingsPage';
import { LoansPage } from './pages/LoansPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { InvestmentsPage } from './pages/InvestmentsPage';
import { CryptoPage } from './pages/CryptoPage';
import { AboutPage } from './pages/AboutPage';
import { SecurityPage } from './pages/SecurityPage';
import { FAQPage } from './pages/FAQPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminLeadsPage } from './pages/admin/AdminLeadsPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';

// Authenticated Customer App Pages
import { AppDashboardPage } from './pages/app/AppDashboardPage';
import { ProfilePage } from './pages/app/ProfilePage';
import { SecurityPage as AppSecurityPage } from './pages/app/SecurityPage';

export default function App() {
  const { pathname } = useRouter();
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState<string | undefined>();
  const [prefilledEmail, setPrefilledEmail] = useState<string | undefined>();
  const [serverHealthy, setServerHealthy] = useState<boolean | null>(null);

  const handleOpenWaitlist = (param?: string) => {
    // Check if param looks like an email or an interest string
    if (param && param.includes('@')) {
      setPrefilledEmail(param);
      setSelectedInterest(undefined);
    } else {
      setSelectedInterest(param);
      setPrefilledEmail(undefined);
    }
    setIsWaitlistOpen(true);
  };

  const handleCloseWaitlist = () => {
    setIsWaitlistOpen(false);
    setSelectedInterest(undefined);
    setPrefilledEmail(undefined);
  };

  const cleanPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
  const isAdminRoute = cleanPath === '/admin' || cleanPath === '/admin/leads';
  const isAppRoute = cleanPath.startsWith('/app');

  // If on admin route, render admin view without public landing header/footer
  if (isAdminRoute) {
    return <AdminLeadsPage />;
  }

  // If on authenticated app route, render AppShell view without public landing header/footer
  if (isAppRoute) {
    switch (cleanPath) {
      case '/app':
        return <AppDashboardPage />;
      case '/app/profile':
        return <ProfilePage />;
      case '/app/security':
        return <AppSecurityPage />;
      default:
        return <AppDashboardPage />;
    }
  }

  // Route Resolver for Public Pages
  const renderCurrentRoute = () => {
    switch (cleanPath) {
      case '/':
      case '/home':
        return <HomePage onOpenWaitlist={handleOpenWaitlist} />;

      case '/login':
        return <LoginPage />;

      case '/register':
        return <RegisterPage />;

      case '/forgot-password':
        return <ForgotPasswordPage />;

      case '/reset-password':
        return <ResetPasswordPage />;

      case '/about':
        return <AboutPage onOpenWaitlist={handleOpenWaitlist} />;

      case '/security':
        return <SecurityPage onOpenWaitlist={handleOpenWaitlist} />;

      case '/faq':
        return <FAQPage onOpenWaitlist={handleOpenWaitlist} />;

      case '/contact':
        return <ContactPage onOpenWaitlist={handleOpenWaitlist} />;

      case '/privacy':
        return <PrivacyPolicyPage onOpenWaitlist={handleOpenWaitlist} />;

      case '/terms':
        return <TermsOfServicePage onOpenWaitlist={handleOpenWaitlist} />;

      case '/services':
        return <ServicesHubPage onOpenWaitlist={handleOpenWaitlist} />;

      case '/services/banking':
        return <BankingPage onOpenWaitlist={handleOpenWaitlist} />;

      case '/services/savings':
        return <SavingsPage onOpenWaitlist={handleOpenWaitlist} />;

      case '/services/loans':
        return <LoansPage onOpenWaitlist={handleOpenWaitlist} />;

      case '/services/payments':
      case '/services/bills':
        return <PaymentsPage onOpenWaitlist={handleOpenWaitlist} />;

      case '/services/investments':
        return <InvestmentsPage onOpenWaitlist={handleOpenWaitlist} />;

      case '/services/crypto':
        return <CryptoPage onOpenWaitlist={handleOpenWaitlist} />;

      default:
        return <NotFoundPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#FBBF24] selection:text-[#001B40]">
      {/* Live Server / Architecture Status Header */}
      <SystemStatusBanner onStatusChange={setServerHealthy} />

      {/* Main Brand Navigation */}
      <Header
        onOpenWaitlist={() => handleOpenWaitlist()}
        serverHealthy={serverHealthy}
      />

      {/* Dynamic Viewport Content */}
      <main className="flex-1">
        {renderCurrentRoute()}
      </main>

      {/* Brand Footer & Disclaimers */}
      <Footer />

      {/* Early Access Waitlist Modal */}
      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={handleCloseWaitlist}
        defaultInterest={selectedInterest}
        defaultEmail={prefilledEmail}
      />
    </div>
  );
}
