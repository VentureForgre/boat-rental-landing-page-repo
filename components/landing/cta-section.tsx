import { landingPageContent } from "@/content/landing-page";

export function CtaSection() {
  return (
    <section className="relative z-10 px-6 pb-20 pt-24 text-center lg:px-8 lg:pb-24 lg:pt-32">
      <div className="mx-auto max-w-4xl space-y-8">
        <h2 className="text-5xl text-white sm:text-6xl">
          {landingPageContent.closingCta.title}
        </h2>
        <p className="mx-auto max-w-2xl text-sm font-medium uppercase tracking-[0.28em] text-slate-300">
          {landingPageContent.closingCta.body}
        </p>
        <div className="flex flex-col justify-center gap-4 pt-6 sm:flex-row sm:gap-6">
          {landingPageContent.closingCta.actions.map((action, index) => (
            <a
              className={
                index === 0
                  ? "inline-flex items-center justify-center bg-white px-12 py-5 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-background)] transition hover:bg-[var(--color-accent)] hover:text-white"
                  : "inline-flex items-center justify-center bg-[var(--color-accent)] px-12 py-5 text-xs font-bold uppercase tracking-[0.22em] text-white transition hover:bg-white hover:text-[var(--color-background)]"
              }
              href={action.href}
              key={`${action.label}-${index}`}
            >
              {action.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
