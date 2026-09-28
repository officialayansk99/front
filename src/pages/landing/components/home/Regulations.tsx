import { motion } from "framer-motion";

/* Licence numbers as supplied by the client (September 2026). Entity names
   were not provided, so the copy states the regulator and number only —
   confirm the registered entity names before adding them. */
export const REGULATIONS = [
  {
    country: "United Kingdom",
    flag: "https://flagcdn.com/w80/gb.png",
    authority: "FCA",
    fullName: "Financial Conduct Authority",
    detail: "FCA reference number 808113",
  },
  {
    country: "Mauritius",
    flag: "https://flagcdn.com/w80/mu.png",
    authority: "FSC",
    fullName: "Financial Services Commission",
    detail: "Investment Dealer's Licence number GB23202701",
  },
  {
    country: "Belize",
    flag: "https://flagcdn.com/w80/bz.png",
    authority: "FSC",
    fullName: "Financial Services Commission",
    detail:
      "Registered under the Securities Industry Act 2021, licence number 8557559",
  },
];

export default function Regulations() {
  return (
    // id is the target of "/#regulations" links.
    <section
      id="regulations"
      className="relative z-10 py-24 border-t border-border scroll-mt-8"
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
        >
          <div className="max-w-2xl">
            <p className="eyebrow mb-3">Regulation</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold leading-[1.08]">
              Licensed where it matters
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm">
            Equiti Capitals operates under licences from the regulators below,
            giving you confidence every time you trade with us.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {REGULATIONS.map((reg, i) => (
            <motion.div
              key={reg.authority + reg.country}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-card p-8 flex flex-col"
            >
              <div className="flex items-center gap-3">
                <img
                  src={reg.flag}
                  alt={`Flag of ${reg.country}`}
                  className="h-6 w-9 rounded-sm border border-border object-cover"
                  loading="lazy"
                />
                <span className="text-sm font-semibold text-foreground">
                  {reg.country}
                </span>
              </div>
              <p className="mt-6 font-display text-4xl font-semibold text-gold-ink">
                {reg.authority}
              </p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {reg.fullName}
              </p>
              <p className="mt-5 pt-5 border-t border-border font-mono text-sm leading-relaxed text-foreground">
                {reg.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
