import { GenericHero } from "./components/GenericHero";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div>
      <GenericHero
        title="About Equiti Capitals"
        subtitle="A modern platform specializing in online foreign exchange and CFD trading."
      />
      <div className="max-w-4xl mx-auto px-6 py-24 prose prose-neutral dark:prose-invert lg:prose-xl">
        <h2 className="text-foreground font-bold text-3xl mb-6">Our Mission</h2>
        <p className="text-muted-foreground leading-relaxed mb-8">
          Equiti Capitals is dedicated to providing superior trading conditions,
          exceptional liquidity, and flawless execution to our clients globally.
          We empower traders with the tools and resources they need to navigate
          the financial markets with confidence and clarity.
        </p>
        <div className="p-8 rounded-3xl bg-card/80 border border-border/30 my-12">
          <h3 className="text-2xl font-bold mb-4 text-foreground">
            Why We Stand Out
          </h3>
          <ul className="space-y-4 text-muted-foreground list-disc list-inside">
            <li>Clear, transparent trading conditions.</li>
            <li>Advanced technological infrastructure ensuring low latency.</li>
            <li>Commitment to transparency and client security.</li>
            <li>24/7 dedicated multi-lingual customer support.</li>
          </ul>
        </div>
        <div className="text-center">
          <Link
            to="/login"
            className="inline-block px-8 py-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-all"
          >
            Join Equiti Capitals Today
          </Link>
        </div>
      </div>
    </div>
  );
}
