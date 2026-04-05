import Image from "next/image";
import { landingPageContent } from "@/content/landing-page";
import { WaitlistForm } from "@/components/landing/waitlist-form";
import { SiteHeader } from "@/components/landing/site-header";

const heroImageSrc =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA0T4Z2ypI0eBJgupQzvWlIf9-gSx5gm0BwhAWYj_KtpY-y0v_BoTq3Rta3qv4YFs0lefLx8FfMKr-HfmmTnqPjLcd6h6qBtiK79HlomyqG4oe1LYK0NBRSl6pbyNkn9XOMJtZP5CWruiMrzrxeqwyoftuto_9ZtvVtL9HAsjZF0ZXAXOsoD7tKqlsrJeIZ0vpHxHKncvmnHEEvSdP4mVGUnvzN4YzEA_nmWPiazYz2rXCXiwCgsuGbR_9ZaOQnxK4KuPpSl0g70so_";

export function HeroSection() {
  return (
    <header
      className="relative overflow-hidden px-4 pb-16 pt-28 text-center sm:px-6 sm:pb-20 sm:pt-32 lg:px-8"
      id="experience"
    >
      <div className="absolute inset-0">
        <Image
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
          height={1440}
          loading="eager"
          priority
          src={heroImageSrc}
          width={2200}
        />
        <div className="absolute inset-0 bg-[rgba(10,18,30,0.58)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(10,18,30,0.2)] to-[var(--color-background)]" />
        <div
          className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-[rgba(10,18,30,0.82)] to-[var(--color-background)]"
          data-testid="hero-fade-transition"
        />
      </div>
      <SiteHeader />
      <div className="relative z-10 mx-auto flex min-h-[72vh] w-full max-w-7xl flex-col items-center justify-center">
        <div className="max-w-4xl space-y-8">
          <p className="eyebrow">{landingPageContent.hero.eyebrow}</p>
          <h1 className="text-4xl leading-[0.95] text-white sm:text-6xl lg:text-8xl">
            {landingPageContent.hero.headline} <br />
            <span className="italic">{landingPageContent.hero.headlineAccent}</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
            {landingPageContent.hero.description}
          </p>
        </div>
        <div className="relative z-10 mt-12 w-full max-w-5xl sm:mt-16" id="waitlist">
          <div className="bg-white p-3 shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
            <WaitlistForm source="hero" />
          </div>
        </div>
      </div>
    </header>
  );
}
