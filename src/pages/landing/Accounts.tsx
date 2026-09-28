import { GenericHero } from "./components/GenericHero";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Accounts() {
  return (
    <div>
      <GenericHero
        title="Trading Account Types"
        subtitle="Choose the perfect account type that matches your trading style and experience."
      />
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            {
              name: "Micro",
              min: "$100",
              spread: "RAW",
              lev: "1:400",
              minTrade: "0.01 lot",
              swap: "No",
              color: "from-primary/20",
            },
            {
              name: "Min",
              min: "$500",
              spread: "RAW",
              lev: "1:1000",
              minTrade: "0.01 lot",
              swap: "No",
              color: "from-copper/20",
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
            <div
              key={idx}
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
                  <CheckCircle size={16} className="text-primary mr-2" />{" "}
                  Spread: {acc.spread}
                </li>
                <li className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle size={16} className="text-primary mr-2" />{" "}
                  Leverage: {acc.lev}
                </li>
                <li className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle size={16} className="text-primary mr-2" />{" "}
                  MetaTrader 5 (MT5)
                </li>
                <li className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle size={16} className="text-primary mr-2" /> Min
                  Trade: {acc.minTrade}
                </li>
                <li className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle size={16} className="text-primary mr-2" /> Swap:{" "}
                  {acc.swap}
                </li>
              </ul>

              <Link
                to="/login"
                className={`block w-full py-3 rounded-xl text-center font-bold transition-all relative z-10 ${acc.popular ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted hover:bg-muted/80 text-foreground border border-border"}`}
              >
                Open Account
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
