import HeroContent from "./homepage/hero-content";

export function Hero() {
  return (
    <section className="bg-gradient-to-t from-dark-blue/5 pt-7">
      <div className="max-w-8xl mx-2 lg:mx-7 relative min-h-[600px] bg-night-blue-800 overflow-hidden rounded-3xl shadow-2xl pt-10">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/images/auth-background.webp')] opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-t from-night-blue-900/70" />
        </div>
        <HeroContent />
      </div>
    </section>
  );
}
