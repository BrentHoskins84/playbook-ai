import Image from "next/image";
import { Button } from "../ui/button";

export default function HeroContent() {
  return (
    <div className="container relative z-[1] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="heading-1 text-white">
            AI-Powered Practice Planning
            <span className="block text-primary mt-2">
              for Softball Coaches
            </span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0">
            Create custom practice plans in seconds. Access a community-driven
            drill repository. Build better practices, faster.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button
              size="lg"
              variant="ghost"
              className="text-white hover:bg-accent "
            >
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="default"
              className="bg-primary text-white border-transparent hover:bg-accent"
            >
              Watch Demo
            </Button>
          </div>
        </div>

        <div className="flex-1">
          <Image
            src="/images/hero-preview.webp"
            alt="App preview"
            width={600}
            height={400}
            className="rounded-xl shadow-2xl max-h-[500px] object-cover object-center"
            priority
          />
        </div>
      </div>
    </div>
  );
}
