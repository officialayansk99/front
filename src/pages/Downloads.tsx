import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  Monitor,
  Smartphone,
  Globe,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function Downloads() {
  const platforms = [
    {
      name: "Windows Desktop",
      description:
        "Full-featured trading experience with advanced charting and expert advisors.",
      icon: <Monitor className="h-8 w-8 text-primary" />,
      link: "https://www.metatrader5.com/en/download",
      version: "Official Build",
    },
    {
      name: "Android Mobile",
      description:
        "Trade on the go with real-time quotes and full account management.",
      icon: <Smartphone className="h-8 w-8 text-emerald-500" />,
      link: "https://www.metatrader5.com/en/download",
      version: "Latest Play Store",
    },
    {
      name: "iOS (iPhone/iPad)",
      description: "Seamless trading experience optimized for Apple devices.",
      icon: <Smartphone className="h-8 w-8 text-slate-900 dark:text-white" />,
      link: "https://www.metatrader5.com/en/download",
      version: "Latest App Store",
    },
    {
      name: "Web Terminal",
      description:
        "Access your account from any browser without installing software.",
      icon: <Globe className="h-8 w-8 text-amber-500" />,
      link: "https://www.metatrader5.com/en/download",
      version: "Cloud v2.0",
    },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-8 w-full min-w-0">
      <div className="flex flex-col gap-2 min-w-0">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Trading Platforms
        </h1>
        <p className="text-muted-foreground">
          Download the industry-standard MetaTrader 5 (MT5) for any device.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-w-0">
        {platforms.map((p) => (
          <Card
            key={p.name}
            className="glass-card border-none shadow-lg hover:shadow-xl transition-all group"
          >
            <CardHeader className="flex flex-col items-center text-center pb-2">
              <div className="p-4 rounded-2xl bg-muted/50 mb-4 group-hover:scale-110 transition-transform duration-300">
                {p.icon}
              </div>
              <CardTitle className="text-xl font-bold">{p.name}</CardTitle>
              <CardDescription className="text-xs mt-2 line-clamp-2">
                {p.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <Button
                asChild
                className="w-full h-11 gradient-primary shadow-md"
              >
                <a
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  className="gap-2"
                >
                  <Download size={18} /> Download Now
                </a>
              </Button>
              <p className="text-[10px] text-center text-muted-foreground mt-3 uppercase font-bold tracking-widest">
                Version: {p.version}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <Card className="bg-primary/5 border-primary/10 overflow-hidden relative">
          <div className="absolute -right-8 -bottom-8 opacity-10">
            <ShieldCheck size={160} />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" /> Secure
              Installation
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3 relative z-10">
            <p>
              MetaTrader 5 is one of the most secure trading platforms in the
              world. Always ensure you are downloading the official setup file
              from our secure servers.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>End-to-end data encryption</li>
              <li>Dual-factor authentication support</li>
              <li>Secure password management</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-emerald-500/5 border-emerald-500/10 overflow-hidden relative">
          <div className="absolute -right-8 -bottom-8 opacity-10">
            <Zap size={160} />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-emerald-500" /> Low Latency
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3 relative z-10">
            <p>
              Our MT5 infrastructure is built for fast, reliable order
              execution.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Execution speed under 1ms</li>
              <li>Direct Market Access (DMA)</li>
              <li>No requotes or slippage</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
