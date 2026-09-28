import { useEffect, useRef } from "react";
import { GenericHero } from "./components/GenericHero";

export default function Tools() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    // Check if script already exists to avoid duplication
    if (container.current.querySelector("script")) return;

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: "FX:EURUSD",
      interval: "D",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      allow_symbol_change: true,
      calendar: false,
      support_host: "https://www.tradingview.com",
    });
    container.current.appendChild(script);
  }, []);

  return (
    <div>
      <GenericHero
        title="Trading Tools"
        subtitle="Professional-grade analytical tools to enhance your market precision."
      />
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-foreground text-center">
            Advanced Real-time Chart
          </h2>
          <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-12">
            Stay on top of the market with our integrated high-performance
            charting solution. Analyze price action, identify patterns, and
            execute your strategy with precision.
          </p>

          <div className="w-full h-[600px] rounded-3xl overflow-hidden border border-border/40 glass-strong shadow-2xl relative">
            <div className="absolute inset-0 flex items-center justify-center bg-background/70 text-muted-foreground z-0">
              Loading interactive chart...
            </div>
            <div
              className="tradingview-widget-container h-full w-full relative z-10"
              ref={container}
            >
              <div className="tradingview-widget-container__widget h-full w-full"></div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="p-8 rounded-3xl bg-card/80 border border-border/30">
            <h3 className="text-xl font-bold mb-4 text-foreground">
              Why use our tools?
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Precision is everything in trading. Our suite of tools provides
              you with the data transparency and technical depth required to
              make informed decisions in volatile markets.
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />{" "}
                Real-time price data across 100+ assets
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />{" "}
                Professional technical indicators and drawing tools
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Highly
                customizable charting interface
              </li>
            </ul>
          </div>
          <div className="p-8 rounded-3xl bg-card/80 border border-border/30 flex flex-col justify-center text-center">
            <h3 className="text-xl font-bold mb-4 text-foreground">
              Need more data?
            </h3>
            <p className="text-muted-foreground mb-8">
              Open a live account today to access our full premium suite of
              institutional trading tools and sentiment analysis.
            </p>
            <button className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold hover:shadow-lg hover:shadow-primary/30 transition-all">
              Open Live Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
