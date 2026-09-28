import { GenericHero } from "./components/GenericHero";

export default function GenericPage({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div>
      <GenericHero title={title} subtitle={desc} />
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-bold mb-6 text-foreground">
          {title} Content
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Welcome to the {title} page. Equiti Capitals provides world-class
          execution and deep liquidity. This page represents the full trading
          and features suite available on our platform. Explore the competitive
          edge we offer to our dedicated clients globally.
        </p>
      </div>
    </div>
  );
}
