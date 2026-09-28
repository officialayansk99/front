import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Monitor,
  Zap,
  ChevronRight,
  BarChart3,
  Lock,
  Cpu,
  Building2,
  HeadphonesIcon,
  Smartphone,
  Play,
  X,
  TrendingUp,
  Award,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const tickerPairs = [
  { pair: "EUR/USD", price: "1.0842", change: "+0.12%", up: true },
  { pair: "GBP/USD", price: "1.2654", change: "-0.08%", up: false },
  { pair: "USD/JPY", price: "154.82", change: "+0.24%", up: true },
  { pair: "XAU/USD", price: "2,384.50", change: "+0.67%", up: true },
  { pair: "BTC/USD", price: "68,420", change: "+1.42%", up: true },
  { pair: "AUD/USD", price: "0.6492", change: "-0.15%", up: false },
  { pair: "USD/CAD", price: "1.3640", change: "+0.09%", up: true },
  { pair: "EUR/GBP", price: "0.8568", change: "-0.04%", up: false },
];

export default function Home() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <div className="bg-background text-foreground overflow-hidden">
      {/* ════════════════════════════════════════════════════════════
          HERO SECTION — Premium Fintech Design
      ════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 min-h-[calc(100vh-80px)] flex flex-col">
        {/* Background: a schematic grid plus one wash. The previous three
            stacked blur-blobs fought the copy for attention. */}
        <div className="absolute inset-0 hero-grid-bg pointer-events-none" />
        <div className="absolute top-[-25%] right-[-15%] w-[720px] h-[720px] bg-primary/10 rounded-full blur-[160px] pointer-events-none" />

        {/* Main hero content */}
        <div className="flex-1 flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full pt-8 pb-12 lg:pt-0 lg:pb-0">
            <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 xl:gap-20 items-center">
              {/* Left — Copy */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Rule + eyebrow, in place of the old glowing pill badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3 mb-7"
                >
                  <span className="h-px w-8 bg-primary/50" />
                  <span className="eyebrow">
                    Multi-asset trading · MetaTrader 5
                  </span>
                </motion.div>

                <h1 className="font-display text-[2.6rem] sm:text-5xl lg:text-[3.4rem] xl:text-[4rem] font-semibold leading-[1.03] mb-7 text-balance">
                  Trade forex with raw spreads from{" "}
                  <span className="text-primary">0.0</span> pips
                </h1>

                <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-xl leading-relaxed">
                  Institutional-grade execution for active retail traders.
                  Ultra-low spreads, &lt;30ms fills, and zero dealing desk
                  intervention — powered by Tier-1 liquidity.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
                  <Link
                    to="/login"
                    className="px-8 py-3.5 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base shadow-sm transition-colors flex items-center justify-center gap-2.5 group"
                  >
                    Open live account
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </Link>
                  <button
                    onClick={() => setIsVideoOpen(true)}
                    className="px-8 py-3.5 rounded-md bg-transparent border border-border hover:border-primary/50 hover:bg-card/60 text-foreground font-semibold text-base transition-colors flex items-center justify-center gap-2.5 group cursor-pointer"
                  >
                    <span className="w-7 h-7 rounded-full border border-primary/40 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                      <Play size={11} className="text-primary ml-0.5" />
                    </span>
                    Watch tutorial
                  </button>
                </div>

                {/* Inline trust metrics, set above a rule as a data row rather
                    than a line of ticked bullets */}
                <div className="max-w-xl">
                  <div className="rule mb-5" />
                  <div className="flex flex-wrap items-baseline gap-x-10 gap-y-4">
                    {[
                      { value: "50,000+", label: "Active traders" },
                      { value: "$10M+", label: "Daily volume" },
                      { value: "24/5", label: "Support" },
                    ].map((stat) => (
                      <div key={stat.label} className="flex flex-col gap-0.5">
                        <span className="font-display text-2xl font-semibold text-foreground">
                          {stat.value}
                        </span>
                        <span className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                          {stat.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Right — 3D Platform Mockup */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative hidden lg:block"
              >
                <div className="perspective-container">
                  {/* Glow behind mockup */}
                  <div className="absolute inset-0 bg-primary/15 blur-[80px] rounded-full scale-110 animate-glow-pulse" />

                  {/* Main mockup */}
                  <div className="mockup-3d relative z-10 rounded-2xl overflow-hidden border border-border/60 shadow-2xl shadow-primary/10 bg-card">
                    <img
                      src="/platform-mockup.svg"
                      alt="Equiti Capitals MetaTrader 5 Platform"
                      className="w-full h-auto"
                    />
                    {/* Gradient overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>

                {/* Floating Card — Spread */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.7 }}
                  className="absolute -left-8 xl:-left-14 top-[20%] z-20 animate-float-slow"
                >
                  <div className="glass-strong rounded-2xl p-5 w-56 shadow-2xl">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">
                      Spreads from
                    </p>
                    <h3 className="text-3xl font-black text-foreground mb-2 tracking-tight">
                      0.0{" "}
                      <span className="text-lg font-bold text-muted-foreground">
                        pips
                      </span>
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      No Dealing Desk
                    </div>
                    <div className="h-10 w-full rounded-lg bg-primary/5 overflow-hidden">
                      <svg
                        width="100%"
                        height="100%"
                        preserveAspectRatio="none"
                        viewBox="0 0 200 40"
                      >
                        <defs>
                          <linearGradient
                            id="heroChartGrad"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="hsl(var(--primary))"
                              stopOpacity="0.25"
                            />
                            <stop
                              offset="100%"
                              stopColor="hsl(var(--primary))"
                              stopOpacity="0"
                            />
                          </linearGradient>
                        </defs>
                        <polygon
                          points="0,32 8,28 18,30 30,22 42,25 55,14 68,18 80,10 95,16 108,8 120,12 135,6 148,9 162,4 178,7 192,3 200,5 200,40 0,40"
                          fill="url(#heroChartGrad)"
                        />
                        <polyline
                          points="0,32 8,28 18,30 30,22 42,25 55,14 68,18 80,10 95,16 108,8 120,12 135,6 148,9 162,4 178,7 192,3 200,5"
                          fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="200"
                          cy="5"
                          r="2.5"
                          fill="hsl(var(--primary))"
                        />
                        <circle
                          cx="200"
                          cy="5"
                          r="5"
                          fill="hsl(var(--primary))"
                          opacity="0.2"
                        />
                      </svg>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Card — Execution Speed */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, duration: 0.7 }}
                  className="absolute -right-6 xl:-right-10 bottom-[15%] z-20 animate-float-delayed"
                >
                  <div className="glass-strong rounded-2xl p-5 w-52 shadow-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <Zap size={20} className="text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                          Execution
                        </p>
                        <p className="text-xl font-black text-foreground">
                          &lt;30ms
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Fill Rate</span>
                      <span className="font-bold text-emerald-500">99.9%</span>
                    </div>
                    <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "99.9%" }}
                        transition={{
                          delay: 1.5,
                          duration: 1.2,
                          ease: "easeOut",
                        }}
                        className="h-full bg-emerald-500 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Floating Card — Leverage */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.7 }}
                  className="absolute -right-4 xl:-right-8 top-[8%] z-20"
                >
                  <div className="glass-strong rounded-xl px-4 py-3 shadow-xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <TrendingUp size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">
                        Leverage
                      </p>
                      <p className="text-base font-black text-foreground">
                        Up to 1:2000
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scrolling Live Ticker */}
        <div className="relative z-20 border-t border-b border-border/50 bg-card/40 backdrop-blur-md py-3 overflow-hidden">
          <div className="flex animate-ticker-scroll whitespace-nowrap">
            {[...tickerPairs, ...tickerPairs].map((t, i) => (
              <div key={i} className="flex items-center gap-6 mx-8">
                <span className="font-bold text-sm text-foreground">
                  {t.pair}
                </span>
                <span className="text-sm text-muted-foreground">{t.price}</span>
                <span
                  className={`text-xs font-bold ${t.up ? "text-emerald-500" : "text-red-500"}`}
                >
                  {t.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-accent py-8 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 gap-y-8 text-primary-foreground">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="text-primary" size={22} />
              </div>
              <div>
                <h4 className="font-black text-lg">$10M+</h4>
                <p className="text-[11px] text-primary-foreground/70">
                  Daily Volume
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="text-primary" size={22} />
              </div>
              <div>
                <h4 className="font-black text-lg">50,000+</h4>
                <p className="text-[11px] text-primary-foreground/70">
                  Active Traders
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="text-primary" size={22} />
              </div>
              <div>
                <h4 className="font-black text-lg">7</h4>
                <p className="text-[11px] text-primary-foreground/70">
                  Tier-1 Liquidity
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <Award className="text-primary" size={22} />
              </div>
              <div>
                <h4 className="font-black text-lg">MT5</h4>
                <p className="text-[11px] text-primary-foreground/70">
                  Trading Platform
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <HeadphonesIcon className="text-primary" size={22} />
              </div>
              <div>
                <h4 className="font-black text-lg">24/5</h4>
                <p className="text-[11px] text-primary-foreground/70">
                  Customer Support
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-muted/10">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-primary font-bold tracking-wider uppercase text-xs mb-3 block"
            >
              Why Choose Equiti Capitals
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-3xl md:text-5xl font-semibold text-foreground leading-[1.08] mb-6"
            >
              Built for Traders. Backed by Technology.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg leading-relaxed"
            >
              Experience the ultimate trading environment designed to give you
              the competitive edge in the global markets.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <BarChart3 size={24} />,
                title: "Raw Spreads from 0.0 pips",
                desc: "Access interbank liquidity with ultra-low spreads ensuring you get the best possible pricing on every trade.",
              },
              {
                icon: <Zap size={24} />,
                title: "Fast Execution",
                desc: "Orders executed in <30ms with no requotes, minimizing slippage on your trades during extreme volatility.",
              },
              {
                icon: <Lock size={24} />,
                title: "Secure Accounts",
                desc: "Encrypted connections, verified identities and secure account access keep your trading account protected.",
              },
              {
                icon: <Cpu size={24} />,
                title: "Advanced Platforms",
                desc: "Trade seamlessly across desktop and mobile using the industry-leading MetaTrader 5 (MT5) platform.",
              },
            ].map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 group flex flex-col"
              >
                <div className="bg-blue-500/10 p-4 rounded-2xl text-primary w-fit mb-6 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-primary-foreground transition-all duration-300">
                  {feat.icon}
                </div>
                <h3 className="font-bold text-xl text-foreground mb-3">
                  {feat.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Premium MT5 Showcase Section */}
      <section className="py-32 px-6 relative overflow-hidden border-t border-border/50">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none opacity-50" />

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] uppercase tracking-[0.2em] font-black mb-8">
                Institutional Technology
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-semibold mb-6 text-foreground leading-[1.08]">
                Master the Markets with <br />
                <span className="gradient-primary-text">MetaTrader 5</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-10 leading-relaxed max-w-xl">
                Experience the world's most powerful trading platform, optimized
                for Equiti Capitals's ultra-low latency infrastructure. Get
                advanced technical analysis, algorithmic trading, and superior
                execution.
              </p>

              <div className="grid sm:grid-cols-2 gap-6 mb-12">
                <div className="p-5 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <Monitor size={20} />
                  </div>
                  <h4 className="font-bold mb-2">Desktop Power</h4>
                  <p className="text-xs text-muted-foreground">
                    Advanced charting and multi-threaded strategy testing for
                    professionals.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4">
                    <Smartphone size={20} />
                  </div>
                  <h4 className="font-bold mb-2">Mobile Freedom</h4>
                  <p className="text-xs text-muted-foreground">
                    Trade anytime, anywhere with full account management on iOS
                    and Android.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/platform"
                  className="btn-brand h-12 px-8 flex items-center gap-2"
                >
                  Get Started <ArrowRight size={18} />
                </Link>
                <Link
                  to="/platform"
                  className="px-8 h-12 rounded-full border border-border hover:bg-muted transition-all font-bold text-sm flex items-center gap-2"
                >
                  Learn Features
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
              <div className="relative glass p-4 rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative rounded-[2rem] overflow-hidden bg-slate-900 aspect-video flex items-center justify-center">
                  <img
                    src="/mt5-logo.png"
                    alt="MT5"
                    className="w-48 opacity-80 drop-shadow-2xl"
                  />
                </div>
              </div>

              {/* Floating Stat Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -right-8 -bottom-8 bg-card border border-border p-6 rounded-2xl shadow-2xl z-20 max-w-[200px]"
              >
                <div className="text-primary font-black text-2xl mb-1">21+</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                  Timeframes for Analysis
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Account Types */}
      <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto border-t border-border">
        <div className="text-center mb-16">
          <span className="text-primary font-bold tracking-wider uppercase text-sm mb-4 block">
            Your Money, Your Control
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-semibold mb-6 text-foreground">
            Trading Accounts
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Choose the perfect account type that matches your trading style and
            experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            {
              name: "Micro",
              min: "$100",
              spread: "RAW",
              lev: "1:400",
              minTrade: "0.01 lot",
              swap: "No",
              color: "from-blue-500/20",
            },
            {
              name: "Min",
              min: "$500",
              spread: "RAW",
              lev: "1:1000",
              minTrade: "0.01 lot",
              swap: "No",
              color: "from-cyan-500/20",
            },
            {
              name: "Standard",
              min: "$1,000",
              spread: "RAW",
              lev: "1:1200",
              minTrade: "0.01 lot",
              swap: "No",
              color: "from-purple-500/20",
              popular: true,
            },
            {
              name: "ECN",
              min: "$5,000",
              spread: "RAW",
              lev: "1:2000",
              minTrade: "0.10 lot",
              swap: "No",
              color: "from-pink-500/20",
            },
            {
              name: "Islamic",
              min: "$10,000",
              spread: "RAW",
              lev: "1:2000",
              minTrade: "0.10 lot",
              swap: "No",
              color: "from-emerald-500/20",
            },
          ].map((acc, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative p-6 rounded-3xl bg-card border ${acc.popular ? "border-primary ring-1 ring-primary/20" : "border-border"} hover:border-primary/50 transition-all group overflow-hidden shadow-sm hover:shadow-xl`}
            >
              {acc.popular && (
                <div className="absolute top-0 inset-x-0 h-1 bg-primary" />
              )}
              <div
                className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-b ${acc.color} to-transparent opacity-20 pointer-events-none`}
              />

              <h3 className="text-2xl font-bold mb-1 relative z-10 text-foreground">
                {acc.name}
              </h3>
              <div className="text-3xl font-black mb-6 relative z-10 text-primary">
                {acc.min}
              </div>

              <ul className="space-y-4 mb-8 relative z-10">
                <li className="flex items-center text-sm text-muted-foreground">
                  <span className="text-primary mr-2 font-bold">✓</span> Spread:{" "}
                  {acc.spread}
                </li>
                <li className="flex items-center text-sm text-muted-foreground">
                  <span className="text-primary mr-2 font-bold">✓</span>{" "}
                  Leverage Up to {acc.lev}
                </li>
                <li className="flex items-center text-sm text-muted-foreground">
                  <span className="text-primary mr-2 font-bold">✓</span>{" "}
                  MetaTrader 5 (MT5)
                </li>
                <li className="flex items-center text-sm text-muted-foreground">
                  <span className="text-primary mr-2 font-bold">✓</span> Min
                  Trade: {acc.minTrade}
                </li>
                <li className="flex items-center text-sm text-muted-foreground">
                  <span className="text-primary mr-2 font-bold">✓</span> Swap:{" "}
                  {acc.swap}
                </li>
              </ul>

              <Link
                to="/login"
                className={`block w-full py-3 rounded-xl text-center font-bold transition-all relative z-10 ${acc.popular ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted hover:bg-muted/80 text-foreground border border-border"}`}
              >
                Open Account
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Latest Offers & News */}
      <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Latest Updates & Offers
            </h2>
            <p className="text-muted-foreground text-lg">
              Stay informed with the latest promotions and market insights.
            </p>
          </div>
          <a
            href="#"
            className="flex items-center gap-2 text-primary font-semibold hover:underline transition-all"
          >
            View All <ArrowRight size={18} />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Refer Now & earn up to 50%",
              desc: "Equiti Capitals is excited to introduce a lucrative referral program designed for our loyal partners...",
            },
            {
              title: "Bull or Bear? Ask Your Master",
              desc: "Equiti Capitals offers expert guidance and advanced trading tools to help you navigate both bull and bear markets...",
            },
            {
              title: "Trade Big with Up to 100% Credit",
              desc: "Equiti Capitals is introducing an innovative scheme designed to double your trading power instantly...",
            },
            {
              title: "Smarter Trading Opportunities With Equiti Capitals",
              desc: "Discover practical tools, flexible account choices, and market-focused support designed to help you trade with more confidence.",
            },
          ].map((news, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 rounded-3xl bg-card border border-border hover:shadow-lg transition-all flex flex-col shadow-sm"
            >
              <h3 className="text-lg font-bold mb-3 leading-tight text-foreground">
                {news.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-6 flex-grow">
                {news.desc}
              </p>
              <a
                href="#"
                className="flex items-center gap-1 text-sm font-bold text-primary hover:underline transition-all mt-auto"
              >
                Read More <ChevronRight size={16} />
              </a>
            </motion.div>
          ))}
        </div>
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
