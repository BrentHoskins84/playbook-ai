import { Card } from "../ui/card";
import { features } from "./constants";

export function FeatureGrid() {
  return (
    <section className="py-24 bg-gradient-to-b from-dark-blue/5">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground">
            Everything you need to run better practices
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful tools designed specifically for softball coaches
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="p-6 border-2 hover:border-primary-blue/20 transition-colors"
            >
              <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
