import { GenericHero } from "./components/GenericHero";
import { Briefcase, Zap } from "lucide-react";

export default function Stocks() {
  return (
    <div>
      <GenericHero
        title="Stock CFDs"
        subtitle="Trade shares of top global companies like Apple, Amazon, and Tesla."
      />
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-6 text-foreground">
            Global Equities at Your Fingertips
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            With Equiti Capitals, you can trade Contracts for Difference (CFDs) on
            the world's most popular stocks. Benefit from price movements in
            both directions without needing to own the underlying asset.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-24">
          <div className="p-8 rounded-3xl bg-card/80 border border-border/30 text-center">
            <div className="w-16 h-16 rounded-full bg-card/60 flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold">AAPL</span>
            </div>
            <h3 className="font-bold text-xl mb-2">Apple Inc.</h3>
            <p className="text-sm text-muted-foreground">Technology / US</p>
          </div>
          <div className="p-8 rounded-3xl bg-card/80 border border-border/30 text-center">
            <div className="w-16 h-16 rounded-full bg-card/60 flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-primary">TSLA</span>
            </div>
            <h3 className="font-bold text-xl mb-2">Tesla, Inc.</h3>
            <p className="text-sm text-muted-foreground">Automotive / US</p>
          </div>
          <div className="p-8 rounded-3xl bg-card/80 border border-border/30 text-center">
            <div className="w-16 h-16 rounded-full bg-card/60 flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-destructive">AMZN</span>
            </div>
            <h3 className="font-bold text-xl mb-2">Amazon.com</h3>
            <p className="text-sm text-muted-foreground">E-Commerce / US</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              Why Trade Stock CFDs?
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/20 text-primary/80">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Go Long or Short</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Profit from both rising and falling markets by taking long
                    or short positions on individual stocks.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/15 text-primary">
                  <Zap size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Leveraged Trading</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Maximize your market exposure with leveraged trading,
                    requiring only a fraction of the full trade value.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
