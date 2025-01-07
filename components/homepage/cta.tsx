import { Button } from "../ui/button";

export function Cta() {
  return (
    <section className="bg-night-blue-900 py-20">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">
          Ready to transform your practice planning?
        </h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join coaches who are saving hours every week with AI-powered practice
          planning.
        </p>
        <Button
          size="lg"
          className="bg-primary-blue text-white hover:bg-primary-blue/90"
        >
          Start Free Trial
        </Button>
      </div>
    </section>
  );
}
