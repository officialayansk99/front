import { GenericHero } from "./components/GenericHero";

export default function WhyChooseUs() {
  return (
    <div>
      <GenericHero
        title="Why Choose Equiti Capitals"
        subtitle="Unparalleled trading conditions designed to help you succeed."
      />
      <div className="max-w-4xl mx-auto px-6 py-24">
        <div className="space-y-12">
          <p className="text-xl text-muted-foreground leading-relaxed">
            At Equiti Capitals, we understand that trading success requires more
            than just skill—it requires an environment that fosters growth and
            execution without compromise.
          </p>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-foreground">
              1. Tier-1 Liquidity & Execution
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              We aggregate liquidity from top-tier global banks and financial
              institutions, meaning you get the best possible bid and ask
              prices. Our execution engine processes trades in milliseconds,
              eliminating requotes and reducing slippage.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-foreground">
              2. Total Transparency
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              We operate with a completely transparent pricing model. What you
              see is what you get—RAW spreads starting from 0.0 pips with no
              hidden fees or markups.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-foreground">
              3. Unmatched Security
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Our platforms use modern encryption and secure account
              access to keep your personal and financial data protected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
