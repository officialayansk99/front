import { Link } from "react-router-dom";
import { Check } from "lucide-react";

type Account = {
  name: string;
  min: string;
  spread: string;
  lev: string;
  minTrade: string;
  swap: string;
  bestFor: string;
  popular?: boolean;
};

export const accounts: Account[] = [
  {
    name: "Micro",
    min: "$100",
    spread: "RAW",
    lev: "1:400",
    minTrade: "0.01 lot",
    swap: "No",
    bestFor: "First live account",
  },
  {
    name: "Min",
    min: "$500",
    spread: "RAW",
    lev: "1:1000",
    minTrade: "0.01 lot",
    swap: "No",
    bestFor: "Growing traders",
  },
  {
    name: "Standard",
    min: "$1,000",
    spread: "RAW",
    lev: "1:1200",
    minTrade: "0.01 lot",
    swap: "No",
    bestFor: "Most active traders",
    popular: true,
  },
  {
    name: "ECN",
    min: "$5,000",
    spread: "RAW",
    lev: "1:2000",
    minTrade: "0.10 lot",
    swap: "No",
    bestFor: "High-volume & algo",
  },
  {
    name: "Islamic",
    min: "$10,000",
    spread: "RAW",
    lev: "1:2000",
    minTrade: "0.10 lot",
    swap: "No",
    bestFor: "Swap-free trading",
  },
];

const rows: { label: string; value: (a: Account) => string }[] = [
  { label: "Minimum deposit", value: (a) => a.min },
  { label: "Spreads", value: (a) => a.spread },
  { label: "Maximum leverage", value: (a) => a.lev },
  { label: "Minimum trade", value: (a) => a.minTrade },
  { label: "Swap", value: (a) => a.swap },
  { label: "Platform", value: () => "MetaTrader 5" },
];

/**
 * Accounts as a comparison table — attributes down the side, accounts across —
 * rather than a row of cards. On small screens the table scrolls sideways
 * inside its frame with the attribute column pinned.
 */
export default function AccountComparison() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <caption className="sr-only">Trading account comparison</caption>
          <thead>
            <tr>
              <th
                scope="col"
                className="sticky left-0 z-10 bg-card w-32 sm:w-44 p-4 sm:p-5 text-left align-bottom text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"
              >
                Account
              </th>
              {accounts.map((a) => (
                <th
                  key={a.name}
                  scope="col"
                  className={`p-4 sm:p-5 text-left align-bottom ${a.popular ? "bg-primary/[0.14] border-t-2 border-primary" : ""}`}
                >
                  {a.popular && (
                    <span className="mb-2 inline-block rounded-full bg-copper px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-copper-foreground">
                      Most popular
                    </span>
                  )}
                  <span className="block font-display text-2xl font-semibold text-foreground">
                    {a.name}
                  </span>
                  <span className="block text-xs font-normal text-muted-foreground mt-1">
                    {a.bestFor}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t border-border">
                <th
                  scope="row"
                  className="sticky left-0 z-10 bg-card p-4 sm:p-5 text-left font-medium text-muted-foreground"
                >
                  {row.label}
                </th>
                {accounts.map((a) => (
                  <td
                    key={a.name}
                    className={`p-4 sm:p-5 whitespace-nowrap font-mono tabular-nums font-semibold text-foreground ${a.popular ? "bg-primary/[0.14]" : ""}`}
                  >
                    {row.label === "Platform" ? (
                      <span className="inline-flex items-center gap-1.5 font-sans font-medium">
                        <Check size={14} className="text-success" />
                        {row.value(a)}
                      </span>
                    ) : (
                      row.value(a)
                    )}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t border-border">
              <th scope="row" className="sticky left-0 z-10 bg-card p-5" />
              {accounts.map((a) => (
                <td
                  key={a.name}
                  className={`p-5 ${a.popular ? "bg-primary/[0.14]" : ""}`}
                >
                  <Link
                    to="/login?mode=register"
                    className={
                      a.popular
                        ? "inline-flex w-full items-center justify-center whitespace-nowrap rounded-md bg-copper px-4 py-2.5 text-sm font-semibold text-copper-foreground shadow-sm hover:brightness-105 transition"
                        : "inline-flex w-full items-center justify-center whitespace-nowrap rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:border-primary/50 hover:bg-muted transition-colors"
                    }
                  >
                    Open {a.name}
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
