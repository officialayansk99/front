import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Clock,
  Users,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { http } from "@/shared/api/http";
import { useAppSelector } from "@/app/hooks";

/* ---------------- THEME DETECTOR ---------------- */
function useThemeDetector() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return isDark;
}

/* ---------------- REUSABLE TRADINGVIEW HOOK ---------------- */
function useTradingViewWidget(
  ref: React.RefObject<HTMLDivElement | null>,
  src: string,
  config: Record<string, unknown>,
) {
  const serialized = JSON.stringify(config);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    node.innerHTML = "";

    const widgetMount = document.createElement("div");
    widgetMount.className = "tradingview-widget-container__widget";

    const script = document.createElement("script");
    script.src = src;
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = serialized;

    node.appendChild(widgetMount);
    node.appendChild(script);

    return () => {
      node.innerHTML = "";
    };
  }, [src, serialized, ref]);
}

/* ---------------- WIDGETS ---------------- */

function TradingViewNews({ isDark }: { isDark: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useTradingViewWidget(
    ref,
    "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js",
    {
      feedMode: "all_symbols",
      // Transparent embed + dark theme often leaves a light iframe fill on timeline/events/screener
      isTransparent: !isDark,
      displayMode: "regular",
      width: "100%",
      height: "400",
      colorTheme: isDark ? "dark" : "light",
      locale: "en",
    },
  );

  return (
    <div ref={ref} className="tradingview-widget-container w-full h-[400px]" />
  );
}

function TradingViewCalendar({ isDark }: { isDark: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useTradingViewWidget(
    ref,
    "https://s3.tradingview.com/external-embedding/embed-widget-events.js",
    {
      width: "100%",
      height: "400",
      colorTheme: isDark ? "dark" : "light",
      isTransparent: !isDark,
      locale: "en",
      importanceFilter: "-1,0,1",
    },
  );

  return (
    <div ref={ref} className="tradingview-widget-container w-full h-[400px]" />
  );
}

function TradingViewForexHeatmap({ isDark }: { isDark: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useTradingViewWidget(
    ref,
    "https://s3.tradingview.com/external-embedding/embed-widget-forex-cross-rates.js",
    {
      width: "100%",
      height: "400",
      currencies: ["EUR", "USD", "JPY", "GBP", "CHF", "AUD", "CAD", "NZD"],
      isTransparent: true,
      colorTheme: isDark ? "dark" : "light",
      locale: "en",
    },
  );

  return (
    <div ref={ref} className="tradingview-widget-container w-full h-[400px]" />
  );
}

function TradingViewForexScreener({ isDark }: { isDark: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useTradingViewWidget(
    ref,
    "https://s3.tradingview.com/external-embedding/embed-widget-screener.js",
    {
      width: "100%",
      height: "400",
      defaultColumn: "overview",
      defaultScreen: "general",
      market: "forex",
      showToolbar: true,
      colorTheme: isDark ? "dark" : "light",
      locale: "en",
      isTransparent: !isDark,
    },
  );

  return (
    <div ref={ref} className="tradingview-widget-container w-full h-[400px]" />
  );
}

/* ---------------- ANIMATION ---------------- */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

/* ---------------- SPARKLINE ---------------- */
function MiniSparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map(
      (v, i) =>
        `${(i / (data.length - 1)) * 100},${100 - ((v - min) / range) * 80}`,
    )
    .join(" ");

  return (
    <svg
      viewBox="0 0 100 100"
      className="w-24 h-12 overflow-visible"
      preserveAspectRatio="none"
    >
      <defs>
        <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id="spark-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
          <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="1" />
          <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity="1" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke="url(#spark-grad)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        filter="url(#neon-glow)"
      />
    </svg>
  );
}

/* ---------------- DASHBOARD ---------------- */
interface DashboardStats {
  accountCount: number;
  totalBalance: number;
  totalEquity: number;
  pendingWithdrawals: number;
}

interface Metric {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  action?: string;
  path?: string;
  gradient: string;
  badge?: string;
  spark?: boolean;
  sparkline?: number[];
}

export default function Dashboard() {
  const isDark = useThemeDetector();
  const navigate = useNavigate();
  const authUser = useAppSelector((s) => s.auth.user);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await http.get<{ data: DashboardStats }>(
        "/admin/stats/client",
      );
      setStats(res.data.data);
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    }
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Fire portal-welcome at most once per page load. The previous deps caused
  // the request to refire whenever the auth user object was replaced, which
  // happened on every /users/me fetch.
  const welcomeFiredRef = useRef(false);
  useEffect(() => {
    if (welcomeFiredRef.current) return;
    if (authUser?.role !== "client") return;
    welcomeFiredRef.current = true;
    void http.post("/auth/portal-welcome", {}).catch(() => {
      /* optional CLIENT_PORTAL_WELCOME template */
    });
  }, [authUser?.role]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const metrics: Metric[] = [
    {
      label: "Total Accounts",
      value: stats?.accountCount?.toString() || "0",
      icon: Users,
      color: "text-primary",
      action: "View Accounts",
      path: "/trading/accounts",
      gradient: "from-primary/10 to-primary/5",
    },
    {
      label: "Total Balance",
      value: `$${stats?.totalBalance?.toLocaleString() || "0"}`,
      icon: DollarSign,
      color: "text-success",
      gradient: "from-success/10 to-primary/5",
    },
    {
      label: "Total Equity",
      value: `$${stats?.totalEquity?.toLocaleString() || "0"}`,
      icon: TrendingUp,
      color: "text-primary",
      gradient: "from-primary/10 to-primary/5",
    },
    {
      label: "Pending Withdrawals",
      value: `$${stats?.pendingWithdrawals?.toLocaleString() || "0"}`,
      icon: Clock,
      color: "text-warning",
      gradient: "from-warning/10 to-warning/5",
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 w-full min-w-0 relative"
    >
      {/* Welcome Banner */}
      <motion.div
        variants={item}
        className="rounded-xl relative overflow-hidden bg-accent border border-white/5 shadow-2xl h-36 sm:h-44 flex items-center mb-6"
      >
        {/* Crazy 3D Isometric Trading Graphic */}
        <div className="absolute left-0 top-0 w-[45%] sm:w-[40%] h-full pointer-events-none opacity-[0.95] overflow-hidden">
          {/* Deep ambient glow */}
          <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-primary/20 blur-[60px] rounded-full" />

          <svg
            viewBox="0 0 200 100"
            className="absolute top-[10%] left-[-5%] w-[120%] h-[150%] text-primary mix-blend-screen"
            preserveAspectRatio="xMidYMax slice"
          >
            <g stroke="none">
              {[
                { h: 10, type: "bull" },
                { h: 22, type: "bull" },
                { h: 14, type: "bear" },
                { h: 32, type: "bull" },
                { h: 20, type: "bear" },
                { h: 42, type: "bull" },
                { h: 28, type: "bear" },
                { h: 55, type: "bull" },
                { h: 40, type: "bear" },
                { h: 70, type: "bull" },
                { h: 40, type: "bear" },
                { h: 76, type: "bull" },
              ].map((data, i) => {
                const x = i * 16;
                const y = 100 - i * 8;
                const h = data.h;

                // Color mapping for a highly premium 3D look
                const top =
                  data.type === "bull"
                    ? "hsl(var(--success))"
                    : "hsl(var(--muted-foreground))";
                const right =
                  data.type === "bull"
                    ? "hsl(var(--primary))"
                    : "hsl(var(--muted))";
                const left =
                  data.type === "bull"
                    ? "hsl(var(--primary))"
                    : "hsl(var(--muted))";

                return (
                  <g key={i}>
                    <path
                      d={`M ${x} ${y} L ${x} ${y - h} L ${x + 8} ${y - h + 4} L ${x + 8} ${y + 4} Z`}
                      fill={left}
                    />
                    <path
                      d={`M ${x + 8} ${y + 4} L ${x + 8} ${y - h + 4} L ${x + 16} ${y - h} L ${x + 16} ${y} Z`}
                      fill={right}
                    />
                    <path
                      d={`M ${x} ${y - h} L ${x + 8} ${y - h - 4} L ${x + 16} ${y - h} L ${x + 8} ${y - h + 4} Z`}
                      fill={top}
                    />
                  </g>
                );
              })}
            </g>

            {/* Holographic Isometric Trendline */}
            <g
              stroke="hsl(var(--primary))"
              strokeWidth="1.5"
              fill="none"
              opacity="0.9"
            >
              <path
                d="M 8 90 L 24 70 L 40 70 L 56 44 L 72 48 L 88 18 L 104 24 L 120 -11 L 136 -4 L 152 -42 L 168 -20 L 184 -64"
                strokeLinejoin="round"
              />
            </g>

            {/* Interactive Nodes */}
            <g
              fill="hsl(var(--accent))"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
            >
              <circle cx="88" cy="18" r="3" />
              <circle cx="152" cy="-42" r="3" />
              <circle cx="184" cy="-64" r="4" />
              <circle
                cx="184"
                cy="-64"
                r="1.5"
                fill="hsl(var(--primary))"
                stroke="none"
              />
            </g>
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center h-full pl-[45%] sm:pl-[38%] pr-6 w-full">
          <div className="flex items-center gap-4 mb-1.5 sm:mb-2">
            <span className="text-xs sm:text-sm font-medium text-slate-300">
              equiticapitals.com
            </span>
            <div className="h-[1px] flex-1 max-w-[200px] bg-slate-500/50"></div>
          </div>
          <h1 className="text-lg sm:text-3xl md:text-4xl font-medium text-white tracking-tight leading-snug sm:leading-tight">
            Empowering Your Trading
            <br className="hidden sm:block" /> Future, Today.
          </h1>
        </div>
      </motion.div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((met) => (
          <motion.div
            key={met.label}
            variants={item}
            className="glass rounded-xl p-4 sm:p-5 relative overflow-hidden group hover:-translate-y-1 transition-all duration-500 cursor-pointer"
          >
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-50",
                met.gradient,
              )}
            />
            <div className="relative space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                  {met.label}
                </span>
                <met.icon
                  size={16}
                  className={cn(met.color, "sm:w-[18px] sm:h-[18px] shrink-0")}
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1 sm:gap-0">
                <div>
                  <p className="text-lg sm:text-2xl font-bold text-foreground">
                    {met.value}
                  </p>
                  {met.badge && (
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-medium text-success sm:mt-1">
                      <ArrowUpRight size={10} className="sm:w-3 sm:h-3" />{" "}
                      {met.badge}
                    </span>
                  )}
                </div>
                {met.spark && met.sparkline && met.sparkline.length > 0 ? (
                  <div className="hidden sm:block">
                    <MiniSparkline data={met.sparkline} />
                  </div>
                ) : null}
                {met.action && (
                  <button
                    onClick={() => met.path && navigate(met.path)}
                    className="flex text-xs text-primary items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Eye size={12} /> {met.action}
                    <ArrowUpRight size={12} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Heatmap + Screener */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <motion.div
          variants={item}
          className="glass rounded-xl p-5 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-warning/10 to-destructive/5 opacity-50" />
          <div className="relative">
            <h3 className="font-semibold text-foreground mb-4">
              Forex Heatmap
            </h3>
            <div className="overflow-hidden rounded-lg">
              <TradingViewForexHeatmap isDark={isDark} />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={item}
          className="glass rounded-xl p-5 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5 opacity-50" />
          <div className="relative">
            <h3 className="font-semibold text-foreground mb-4">
              Forex Screener
            </h3>
            <div className="overflow-hidden rounded-lg">
              <TradingViewForexScreener isDark={isDark} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* News & Calendar */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <motion.div
          variants={item}
          className="glass rounded-xl p-5 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 opacity-50" />
          <div className="relative">
            <h3 className="font-semibold text-foreground mb-4">Market News</h3>
            <div className="overflow-hidden rounded-lg">
              <TradingViewNews isDark={isDark} />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={item}
          className="glass rounded-xl p-5 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-success/10 to-primary/5 opacity-50" />
          <div className="relative">
            <h3 className="font-semibold text-foreground mb-4">
              Economic Calendar
            </h3>
            <div className="overflow-hidden rounded-lg">
              <TradingViewCalendar isDark={isDark} />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
