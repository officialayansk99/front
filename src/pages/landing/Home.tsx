import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowDown,
  Monitor,
  Globe,
  Smartphone,
  Play,
  X,
  Zap,
  Wallet,
  HeadphonesIcon,
  GraduationCap,
  Handshake,
  Check,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import MarketBoard from "./components/home/MarketBoard";
import MarketsTabs from "./components/home/MarketsTabs";
import AccountComparison from "./components/home/AccountComparison";
import Regulations from "./components/home/Regulations";


const trustFigures = [
  { value: "50,000+", label: "Active traders" },
  { value: "$10M+", label: "Daily volume" },
  { value: "7", label: "Tier-1 liquidity providers" },
  { value: "<30ms", label: "Average execution" },
  { value: "24/5", label: "Human support" },
];

const platformModes = {
  desktop: {
    icon: Monitor,
    label: "Desktop",
    title: "The full MT5 terminal",
    points: [
      "21 timeframes and 38 built-in technical indicators",
      "Multi-threaded strategy tester for Expert Advisors",
      "Depth of market and one-click trading",
    ],
  },
  web: {
    icon: Globe,
    label: "Web",
    title: "Trade from any browser",
    points: [
      "Nothing to install — log in and trade",
      "Same account, orders and history as desktop",
      "Charting and order management built in",
    ],
  },
  mobile: {
    icon: Smartphone,
    label: "Mobile",
    title: "Your account in your pocket",
    points: [
      "Native MT5 apps for iOS and Android",
      "Price alerts, charts and full order control",
      "Deposit and manage funds on the move",
    ],
  },
} as const;
type PlatformMode = keyof typeof platformModes;

const steps = [
  {
    title: "Register",
    desc: "Create your client portal login in about two minutes — name, email, phone and a password.",
  },
  {
    title: "Verify",
    desc: "Upload your ID and proof of address from the portal. Our team reviews submissions as quickly as possible.",
  },
  {
    title: "Fund & trade",
    desc: "Deposit by bank wire, card or crypto, request your MT5 account and place your first trade.",
  },
];

const faqs = [
  {
    q: "How do I open an account?",
    a: "Select “Open live account”, register for the client portal, complete verification (KYC) and request an MT5 trading account from your dashboard. We email you as soon as it is ready.",
  },
  {
    q: "What is the minimum deposit?",
    a: "It depends on the account: Micro starts at $100, Min at $500, Standard at $1,000, ECN at $5,000 and Islamic at $10,000. See the comparison table above for the full terms.",
  },
  {
    q: "Which platform do you offer?",
    a: "Every account trades on MetaTrader 5 — on desktop, in the browser and on iOS and Android.",
  },
  {
    q: "How do deposits and withdrawals work?",
    a: "Fund by bank wire, credit/debit card or cryptocurrency from the Funds section of the portal. Withdrawals go back to the method you deposited with and are processed by our finance team, typically within 24 business hours once your account is verified.",
  },
  {
    q: "Is there a swap-free account?",
    a: "Yes. The Islamic account is swap-free and otherwise trades on the same raw pricing as our other accounts.",
  },
  {
    q: "What leverage can I use?",
    a: "Maximum leverage ranges from 1:400 on Micro up to 1:2000 on ECN and Islamic. Leverage magnifies losses as well as gains — choose a level that fits your experience and risk tolerance.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55 },
};

export default function Home() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [platformMode, setPlatformMode] = useState<PlatformMode>("desktop");
  const activeMode = platformModes[platformMode];

  return (
    <div className="bg-background text-foreground overflow-hidden">
      {/* ════════════════════════════════════════════════════════════
          HERO — centred statement over a market board. No split layout,
          no mockup: the prices are the picture.
      ════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 pt-10 pb-16 lg:pt-16">
        <div className="absolute inset-0 hero-grid-bg pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl mx-auto text-center"
          >
            <p className="eyebrow mb-6">
              Forex · Commodities · Stocks · Crypto — on MetaTrader 5
            </p>
            <h1 className="font-display text-[2.5rem] sm:text-6xl lg:text-7xl font-semibold leading-[1.02] mb-6 text-balance">
              Raw spreads. <span className="text-gold-ink italic">Real</span>{" "}
              execution.
            </h1>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto mb-9 leading-relaxed">
              Trade global markets from 0.0 pips with fills under 30ms and no
              dealing desk — priced by seven Tier-1 liquidity providers.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mb-6">
              <Link to="/login?mode=register" className="btn-cta group">
                Open live account
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
              <a
                href="#accounts"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-md border border-border bg-card/60 hover:border-primary/50 text-foreground font-semibold transition-colors"
              >
                Compare accounts <ArrowDown size={16} />
              </a>
            </div>

            <p className="text-xs text-muted-foreground">
              From $100 to start · Swap-free Islamic account · 24/5 support
            </p>
          </motion.div>

          <div className="mt-14">
            <MarketBoard />
          </div>
        </div>
      </section>

      {/* Trust figures — one bordered row, not an icon banner */}
      <section className="relative z-10 border-y border-border bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <dl className="grid grid-cols-2 md:grid-cols-5">
            {trustFigures.map((f, i) => (
              <div
                key={f.label}
                className={`py-7 px-4 text-center ${i > 0 ? "md:border-l border-border" : ""} ${i === 4 ? "col-span-2 md:col-span-1" : ""}`}
              >
                <dt className="sr-only">{f.label}</dt>
                <dd className="font-display text-3xl font-semibold text-foreground">
                  {f.value}
                </dd>
                <dd className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {f.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
            <Regulations />



      {/* Markets */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="max-w-2xl mb-10">
            <p className="eyebrow mb-3">Markets</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold leading-[1.08]">
              One account. Every market that matters.
            </h2>
          </motion.div>
          <MarketsTabs />
        </div>
      </section>

      {/* Accounts */}
      <section
        id="accounts"
        className="relative z-10 py-24 border-t border-border scroll-mt-8"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            {...fadeUp}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
          >
            <div className="max-w-2xl">
              <p className="eyebrow mb-3">Accounts</p>
              <h2 className="font-display text-4xl md:text-5xl font-semibold leading-[1.08]">
                Compare accounts side by side
              </h2>
            </div>
            <p className="text-muted-foreground max-w-sm">
              Every account gets raw spreads and MetaTrader 5. Pick the one that
              matches your deposit and trade size.
            </p>
          </motion.div>
          <motion.div {...fadeUp}>
            <AccountComparison />
          </motion.div>
        </div>
      </section>

      {/* Platform — the one dark band on the page */}
      <section className="relative z-10 bg-accent text-accent-foreground py-24 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[560px] h-[560px] rounded-full bg-copper/10 blur-[140px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center">
          <motion.div {...fadeUp}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-copper mb-3">
              Platform
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold leading-[1.08] mb-6">
              MetaTrader 5, wherever you trade
            </h2>

            <div
              role="tablist"
              aria-label="Platform versions"
              className="inline-flex rounded-lg border border-accent-foreground/15 p-1 mb-8"
            >
              {(Object.keys(platformModes) as PlatformMode[]).map((key) => {
                const m = platformModes[key];
                const Icon = m.icon;
                const active = key === platformMode;
                return (
                  <button
                    key={key}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setPlatformMode(key)}
                    className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors ${active ? "bg-copper text-copper-foreground" : "text-accent-foreground/70 hover:text-accent-foreground"}`}
                  >
                    <Icon size={15} /> {m.label}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={platformMode}
                role="tabpanel"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="mb-10"
              >
                <h3 className="text-xl font-semibold mb-4">
                  {activeMode.title}
                </h3>
                <ul className="space-y-3">
                  {activeMode.points.map((p) => (
                    <li
                      key={p}
                      className="flex gap-3 text-accent-foreground/80"
                    >
                      <Check
                        size={18}
                        className="text-copper shrink-0 mt-0.5"
                      />
                      {p}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-wrap gap-3">
              <Link to="/platform" className="btn-cta">
                Explore the platform <ArrowRight size={18} />
              </Link>
              <button
                onClick={() => setIsVideoOpen(true)}
                className="inline-flex items-center gap-2.5 rounded-md border border-accent-foreground/20 px-6 py-3.5 font-semibold hover:bg-accent-foreground/5 transition-colors"
              >
                <Play size={14} className="text-copper" /> Watch tutorial
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="rounded-2xl border border-accent-foreground/15 bg-accent-foreground/5 p-2 shadow-2xl">
              <div className="flex items-center gap-1.5 px-3 py-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-foreground/20" />
                <span className="w-2.5 h-2.5 rounded-full bg-accent-foreground/20" />
                <span className="w-2.5 h-2.5 rounded-full bg-accent-foreground/20" />
                <span className="ml-auto text-[11px] font-semibold tracking-wider text-accent-foreground/60">
                  MetaTrader 5
                </span>
              </div>
              <img
                src="/platform-mockup.svg"
                alt="Equiti Capitals MetaTrader 5 platform"
                className="w-full h-auto rounded-xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento — asymmetric grid of the things traders ask about next */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="max-w-2xl mb-10">
            <p className="eyebrow mb-3">Why Equiti Capitals</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold leading-[1.08]">
              Built around the trade, not the sales pitch
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 md:grid-rows-2 gap-4">
            <motion.div
              {...fadeUp}
              className="md:row-span-2 rounded-2xl bg-primary text-primary-foreground p-8 flex flex-col"
            >
              <Zap size={26} className="mb-6 opacity-90" />
              <h3 className="font-display text-3xl font-semibold mb-3">
                Execution you can measure
              </h3>
              <p className="opacity-80 leading-relaxed mb-8">
                Orders route straight to Tier-1 liquidity with no dealing desk
                and no requotes — fewer surprises when the market moves fast.
              </p>
              <div className="mt-auto grid grid-cols-2 gap-4 border-t border-primary-foreground/20 pt-6">
                <div>
                  <p className="font-mono text-3xl font-semibold">&lt;30ms</p>
                  <p className="text-xs uppercase tracking-wider opacity-70 mt-1">
                    Execution
                  </p>
                </div>
                <div>
                  <p className="font-mono text-3xl font-semibold">99.9%</p>
                  <p className="text-xs uppercase tracking-wider opacity-70 mt-1">
                    Fill rate
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              {...fadeUp}
              className="md:col-span-2 rounded-2xl border border-border bg-card p-8"
            >
              <Wallet size={24} className="text-gold-ink mb-5" />
              <h3 className="text-xl font-semibold mb-4">Fund your way</h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  {
                    name: "Bank wire",
                    time: "1–3 business days",
                    fee: "Zero fees",
                  },
                  {
                    name: "Credit / debit card",
                    time: "Instant",
                    fee: "Zero fees",
                  },
                  {
                    name: "Cryptocurrency",
                    time: "Instant*",
                    fee: "Network fees only",
                  },
                ].map((m) => (
                  <div key={m.name} className="rounded-xl bg-muted p-4">
                    <p className="font-semibold text-sm text-foreground">
                      {m.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {m.time}
                    </p>
                    <p className="text-xs font-semibold text-success mt-2">
                      {m.fee}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground mt-3">
                *Network dependent.{" "}
                <Link
                  to="/how-to-deposit"
                  className="text-gold-ink hover:underline"
                >
                  How to deposit
                </Link>
              </p>
            </motion.div>

            {[
              {
                icon: HeadphonesIcon,
                title: "24/5 human support",
                desc: "Real people, whenever the markets are open.",
                to: "/contact",
                cta: "Contact us",
              },
              {
                icon: Handshake,
                title: "Partner with us",
                desc: "Introducing brokers and affiliates earn on every referral.",
                to: "/ib",
                cta: "Partner programme",
              },
            ].map((t) => (
              <motion.div
                key={t.title}
                {...fadeUp}
                className="rounded-2xl border border-border bg-card p-8 flex flex-col"
              >
                <t.icon size={24} className="text-gold-ink mb-5" />
                <h3 className="text-xl font-semibold mb-2">{t.title}</h3>
                <p className="text-sm text-muted-foreground mb-5">{t.desc}</p>
                <Link
                  to={t.to}
                  className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-gold-ink hover:underline"
                >
                  {t.cta} <ArrowRight size={15} />
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            {...fadeUp}
            className="mt-4 rounded-2xl border border-border bg-card p-8 flex flex-col md:flex-row md:items-center gap-5"
          >
            <GraduationCap size={28} className="text-gold-ink shrink-0" />
            <div className="flex-1">
              <h3 className="text-xl font-semibold">Learn as you trade</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Trading calculators, platform guides and market explainers to
                sharpen every decision.
              </p>
            </div>
            <Link
              to="/tools"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-ink hover:underline"
            >
              Trading tools <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Three steps — large numerals joined by a rule */}
      <section className="relative z-10 py-24 border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            {...fadeUp}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <p className="eyebrow mb-3">Getting started</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold leading-[1.08]">
              Live in three steps
            </h2>
          </motion.div>

          <div className="relative">
            <div
              className="hidden md:block absolute top-9 left-[16%] right-[16%] h-px bg-border"
              aria-hidden="true"
            />
            <ol className="relative grid md:grid-cols-3 gap-10 md:gap-8">
              {steps.map((s, i) => (
                <motion.li
                  key={s.title}
                  {...fadeUp}
                  transition={{ duration: 0.55, delay: i * 0.12 }}
                  className="relative text-center"
                >
                  <span className="relative mx-auto mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-full border border-border bg-background font-display text-4xl font-semibold text-gold-ink">
                    {i + 1}
                  </span>
                  <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                    {s.desc}
                  </p>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1fr_1.6fr] gap-12">
          <motion.div {...fadeUp}>
            <p className="eyebrow mb-3">FAQ</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold leading-[1.08] mb-5">
              Questions, answered
            </h2>
            <p className="text-muted-foreground mb-6">
              Can't find what you need? Our team is on hand 24/5.
            </p>
            <a
              href="mailto:support@equiticapitals.com"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gold-ink hover:underline"
            >
              support@equiticapitals.com <ArrowRight size={15} />
            </a>
          </motion.div>
          <motion.div {...fadeUp}>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="relative z-10 px-6 pb-24">
        <motion.div
          {...fadeUp}
          className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-br from-primary to-accent text-primary-foreground px-8 py-16 md:px-16 flex flex-col md:flex-row md:items-center justify-between gap-8"
        >
          <div className="max-w-xl">
            <h2 className="font-display text-4xl md:text-5xl font-semibold leading-[1.08] mb-4">
              Ready when the market is.
            </h2>
            <p className="opacity-80 text-lg">
              Open your account today and trade raw spreads on MetaTrader 5.
            </p>
          </div>
          <Link to="/login?mode=register" className="btn-cta shrink-0 group">
            Open live account
            <ArrowRight
              size={18}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
        </motion.div>
      </section>

      {/* Video Tutorial Modal */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setIsVideoOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsVideoOpen(false)}
                aria-label="Close video"
                className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors z-10"
              >
                <X size={28} />
              </button>
              <iframe
                src="https://www.youtube.com/embed/QM_obaGNBRE?autoplay=1&rel=0"
                title="Forex Trading Tutorial"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
