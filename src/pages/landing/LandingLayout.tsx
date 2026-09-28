import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  Mail,
  Menu,
  X,
  Sun,
  Moon,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import Logo from "@/components/Logo";

export default function LandingLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [openSection, setOpenSection] = useState<
    "education" | "trading" | "partners" | "company" | ""
  >("education");
  const toggleSection = (
    section: "education" | "trading" | "partners" | "company",
  ) => {
    setOpenSection((current) => (current === section ? "" : section));
  };
  // Initialize from document class list to stay in sync with dashboard
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Sync state if class is changed externally (like by dashboard)
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDark(document.documentElement.classList.contains("dark"));
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <div className="min-h-screen overflow-x-hidden relative font-sans flex flex-col">
        {/* Global Background Effects */}
        {isDark ? (
          <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-primary/15 to-transparent pointer-events-none z-0" />
        ) : (
          <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-primary/[0.07] to-transparent pointer-events-none z-0" />
        )}

        {/* Risk warning — slim, always visible, never dismissible. The full
            text lives in the footer and on /risk. */}
        <div className="relative z-[101] bg-accent text-accent-foreground/80 text-[11px] leading-snug px-4 py-2 text-center">
          <strong className="font-semibold text-accent-foreground">
            Risk warning:
          </strong>{" "}
          Forex and CFDs are complex instruments and carry a high risk of losing
          money rapidly due to leverage.{" "}
          <Link
            to="/risk"
            className="underline underline-offset-2 hover:text-accent-foreground"
          >
            Read more
          </Link>
        </div>

        {/* Navbar */}
        <nav className="relative z-[100] flex items-center justify-between pl-0 pr-4 py-6 sm:px-6 max-w-7xl mx-auto w-full">
          <Link to="/" className="flex items-center gap-3 group/logo">
            <div className="h-20 min-w-[200px] overflow-hidden relative">
              <Logo className="h-full w-auto" />
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            {/* Education Center */}
            <div className="relative group cursor-pointer">
              <div className="flex items-center gap-1 hover:text-foreground transition-colors py-2">
                <span>Education Center</span>
                <ChevronDown
                  size={14}
                  className="group-hover:rotate-180 transition-transform duration-300"
                />
              </div>
              <div className="absolute top-full left-0 w-48 pt-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-50 flex flex-col overflow-hidden">
                <div className="bg-card border border-border rounded-xl shadow-xl flex flex-col overflow-hidden">
                  <a
                    href="https://www.babypips.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 hover:bg-muted transition-colors text-foreground text-sm"
                  >
                    BabyPips
                  </a>
                  <a
                    href="https://www.forexfactory.com/calendar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 hover:bg-muted transition-colors text-foreground text-sm"
                  >
                    Forex Factory
                  </a>
                  <a
                    href="https://www.tradingview.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 hover:bg-muted transition-colors text-foreground text-sm"
                  >
                    TradingView
                  </a>
                  <a
                    href="https://www.fxstreet.com/markets/commodities/metals/gold"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 hover:bg-muted transition-colors text-foreground text-sm"
                  >
                    FXStreet Gold
                  </a>
                </div>
              </div>
            </div>

            {/* Trading */}
            <div className="relative group cursor-pointer">
              <div className="flex items-center gap-1 hover:text-foreground transition-colors py-2">
                <span>Trading</span>
                <ChevronDown
                  size={14}
                  className="group-hover:rotate-180 transition-transform duration-300"
                />
              </div>
              <div className="absolute top-full left-0 w-56 pt-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-50 flex flex-col overflow-hidden">
                <div className="bg-card border border-border rounded-xl shadow-xl flex flex-col overflow-hidden">
                  <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground font-bold border-b border-border">
                    Instruments
                  </div>
                  <Link
                    to="/forex"
                    className="px-4 py-2 hover:bg-muted transition-colors text-foreground text-sm"
                  >
                    Forex
                  </Link>
                  <Link
                    to="/commodities"
                    className="px-4 py-2 hover:bg-muted transition-colors text-foreground text-sm"
                  >
                    Commodities
                  </Link>
                  <Link
                    to="/stocks"
                    className="px-4 py-2 hover:bg-muted transition-colors text-foreground text-sm"
                  >
                    Stock CFDs
                  </Link>
                  <Link
                    to="/cryptocurrencies"
                    className="px-4 py-2 hover:bg-muted transition-colors text-foreground text-sm"
                  >
                    Cryptocurrencies
                  </Link>
                  <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground font-bold border-y border-border mt-2">
                    Resources
                  </div>
                  <Link
                    to="/platform"
                    className="px-4 py-2 hover:bg-muted transition-colors text-foreground text-sm"
                  >
                    Trading Platform
                  </Link>
                  <Link
                    to="/tools"
                    className="px-4 py-2 hover:bg-muted transition-colors text-foreground text-sm"
                  >
                    Trading Tools
                  </Link>
                  <Link
                    to="/how-to-deposit"
                    className="px-4 py-2 hover:bg-muted transition-colors text-foreground text-sm"
                  >
                    How to Deposit
                  </Link>
                  <Link
                    to="/how-to-withdraw"
                    className="px-4 py-2 hover:bg-muted transition-colors text-foreground text-sm"
                  >
                    How to Withdraw
                  </Link>
                </div>
              </div>
            </div>

            {/* Our Company */}
            <div className="relative group cursor-pointer">
              <div className="flex items-center gap-1 hover:text-foreground transition-colors py-2">
                <span>Our Company</span>
                <ChevronDown
                  size={14}
                  className="group-hover:rotate-180 transition-transform duration-300"
                />
              </div>
              <div className="absolute top-full left-0 w-48 pt-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-50 flex flex-col overflow-hidden">
                <div className="bg-card border border-border rounded-xl shadow-xl flex flex-col overflow-hidden">
                  <Link
                    to="/about"
                    className="px-4 py-3 hover:bg-muted transition-colors text-foreground text-sm"
                  >
                    About Equiti Capitals
                  </Link>
                  <Link
                    to="/why-choose-us"
                    className="px-4 py-3 hover:bg-muted transition-colors text-foreground text-sm"
                  >
                    Why Choose Us
                  </Link>
                  <Link
                    to="/accounts"
                    className="px-4 py-3 hover:bg-muted transition-colors text-foreground text-sm"
                  >
                    Account Types
                  </Link>
                  <Link
                    to="/contact"
                    className="px-4 py-3 hover:bg-muted transition-colors text-foreground text-sm"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted transition-colors text-foreground"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="hidden lg:flex items-center gap-4">
              <Link
                to="/login"
                className="px-6 py-2.5 rounded-full border border-border hover:bg-muted transition-colors text-sm font-bold text-foreground"
              >
                Login
              </Link>
              <Link
                to="/login"
                className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-lg hover:shadow-primary/30 transition-all"
              >
                Register
              </Link>
            </div>
            <button
              className="lg:hidden text-foreground"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu size={28} />
            </button>
          </div>
        </nav>

        {/* Expandable Floating Action Button (EFAB) */}
        <div
          className="fixed bottom-8 right-8 z-[150]"
          onMouseEnter={() => setIsChatOpen(true)}
          onMouseLeave={() => setIsChatOpen(false)}
        >
          {/* Expanded Menu */}
          <div
            className={`absolute bottom-full pb-4 right-0 flex flex-col gap-3 transition-all duration-500 ${isChatOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-10 pointer-events-none"}`}
          >
            <a
              href="mailto:support@equiticapitals.com"
              className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-primary shadow-xl hover:scale-110 transition-all relative group/item"
            >
              <Mail size={20} strokeWidth={2} />
              <span className="absolute right-full mr-4 px-3 py-1.5 rounded-lg bg-card border border-border text-foreground text-[10px] uppercase tracking-widest font-bold opacity-0 group-hover/item:opacity-100 transition-all whitespace-nowrap shadow-2xl">
                Email Support
              </span>
            </a>
          </div>

          {/* Main Trigger Button */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-all active:scale-95 ${isChatOpen ? "rotate-12" : ""}`}
          >
            {isChatOpen ? <X size={28} /> : <MessageCircle size={28} />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        <div
          className={`fixed inset-0 z-[200] bg-background transition-all duration-500 lg:hidden ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none translate-x-full"}`}
        >
          <div className="flex flex-col h-full pt-10 px-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-12">
              <Link
                to="/"
                className="flex items-center gap-3"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="h-16 min-w-[160px] overflow-hidden">
                  <Logo className="h-full w-auto" />
                </div>
              </Link>
              <button
                className="text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                <X size={32} />
              </button>
            </div>

            <div className="space-y-8 pb-20">
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => toggleSection("education")}
                  className="flex items-center justify-between w-full text-left"
                >
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                    Education Center
                  </p>
                  <ChevronDown
                    className={`transition-transform duration-300 ${openSection === "education" ? "rotate-180" : ""}`}
                  />
                </button>
                {openSection === "education" && (
                  <div className="space-y-3 pt-2">
                    <a
                      href="https://www.babypips.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-2xl font-bold text-foreground"
                    >
                      BabyPips
                    </a>
                    <a
                      href="https://www.forexfactory.com/calendar"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-2xl font-bold text-foreground"
                    >
                      Forex Factory
                    </a>
                    <a
                      href="https://www.tradingview.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-2xl font-bold text-foreground"
                    >
                      TradingView
                    </a>
                    <a
                      href="https://www.fxstreet.com/markets/commodities/metals/gold"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-2xl font-bold text-foreground"
                    >
                      FXStreet Gold
                    </a>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => toggleSection("trading")}
                  className="flex items-center justify-between w-full text-left"
                >
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                    Trading
                  </p>
                  <ChevronDown
                    className={`transition-transform duration-300 ${openSection === "trading" ? "rotate-180" : ""}`}
                  />
                </button>
                {openSection === "trading" && (
                  <div className="space-y-3 pt-2">
                    <Link
                      to="/forex"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-2xl font-bold text-foreground"
                    >
                      Forex
                    </Link>
                    <Link
                      to="/cryptocurrencies"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-2xl font-bold text-foreground"
                    >
                      Crypto
                    </Link>
                    <Link
                      to="/accounts"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-2xl font-bold text-foreground"
                    >
                      Accounts
                    </Link>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => toggleSection("company")}
                  className="flex items-center justify-between w-full text-left"
                >
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                    Company
                  </p>
                  <ChevronDown
                    className={`transition-transform duration-300 ${openSection === "company" ? "rotate-180" : ""}`}
                  />
                </button>
                {openSection === "company" && (
                  <div className="space-y-3 pt-2">
                    <Link
                      to="/about"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-2xl font-bold text-foreground"
                    >
                      About Us
                    </Link>
                    <Link
                      to="/contact"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-2xl font-bold text-foreground"
                    >
                      Contact
                    </Link>
                    <Link
                      to="/why-choose-us"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-2xl font-bold text-foreground"
                    >
                      Why Us
                    </Link>
                  </div>
                )}
              </div>
              <div className="pt-8 space-y-4">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full py-4 text-center rounded-xl bg-primary text-primary-foreground font-bold text-lg"
                >
                  Register Now
                </Link>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full py-4 text-center rounded-xl border border-border text-foreground font-bold text-lg"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-grow">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="relative z-10 pt-20 pb-10 px-6 max-w-7xl mx-auto w-full border-t border-border mt-20 bg-background">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 text-foreground">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-14 overflow-hidden">
                  <Logo className="h-full w-auto" />
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Equiti Capitals is a modern platform specializing in online
                foreign exchange and Contract for Difference (CFD) trading
                services.
              </p>
              <div className="space-y-3">
                <p className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail size={16} className="text-primary" />{" "}
                  info@equiticapitals.com
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link
                    to="/"
                    className="hover:text-foreground transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-foreground transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-foreground transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Legal Links</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link
                    to="/privacy"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="hover:text-foreground transition-colors"
                  >
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/trading-conditions"
                    className="hover:text-foreground transition-colors"
                  >
                    Trading Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/risk"
                    className="hover:text-foreground transition-colors"
                  >
                    Risk Warnings
                  </Link>
                </li>
              </ul>
            </div>

            {/* Regulatory: add the client's own licence/registration details here once provided. Do not reuse another firm's licence. */}
                        <div className="md:col-span-full text-xs text-muted-foreground space-y-1">
              <p>FCA reference number: 808113</p>
              <p>FSC Mauritius, Investment Dealer's Licence: GB23202701</p>
              <p>FSC Belize, licence number: 8557559</p>
            </div>

          </div>

          <div className="pt-8 border-t border-border">
            <p className="text-[10px] text-muted-foreground leading-relaxed mb-6 text-justify uppercase tracking-tighter opacity-80">
              <strong>Risk Warning</strong> – Trading foreign exchange on margin
              carries significant risk and may not be suitable for all
              investors. Before trading forex, you should carefully evaluate
              your investment goals, experience level, and risk tolerance. There
              is a possibility that you could incur a loss of some or all of
              your initial investment. As a result, you should only invest funds
              that you are willing to lose. Be fully aware of all risks involved
              in forex trading and seek advice from an independent financial
              advisor if needed. Equiti Capitals does not offer services to
              residents of certain countries, including the USA, Iran, North
              Korea, Indonesia, and jurisdictions on the FATF blacklist.
            </p>
            <div className="text-center text-xs text-muted-foreground uppercase font-bold tracking-widest">
              Copyright © 2010 - 2025 Equiti Capitals
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
