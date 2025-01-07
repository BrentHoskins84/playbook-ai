import { Hero } from "@/components/hero";
import { Cta } from "@/components/homepage/cta";
import { FeatureGrid } from "@/components/homepage/features-grid";
import { Footer } from "@/components/homepage/footer";
import { Navbar } from "@/components/navbar";

export default function Index() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Features Grid */}
      <FeatureGrid />

      {/* CTA Section */}
      <Cta />

      {/* Footer */}
      <Footer />
    </div>
  );
}
