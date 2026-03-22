import { landingPageContent, lakeOptions } from "@/content/landing-page";
import { CameraIcon, GlobeIcon, SailingIcon, ShareIcon } from "@/components/landing/icons";
import { WaitlistForm } from "@/components/landing/waitlist-form";

const socialIconMap = {
  camera: CameraIcon,
  globe: GlobeIcon,
  share: ShareIcon,
} as const;

export function SiteFooter() {
  return (
    <footer
      className="relative z-10 border-t border-luxury px-6 pb-12 pt-20 lg:px-8"
      id="concierge"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 grid gap-12 md:grid-cols-2 xl:grid-cols-4 xl:gap-16">
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <SailingIcon className="h-8 w-8 text-[var(--color-accent)]" />
              <span className="text-xl font-bold uppercase tracking-[0.3em] text-white">
                {landingPageContent.brand.name}
              </span>
            </div>
            <p className="max-w-sm text-sm leading-7 text-muted-luxury">
              {landingPageContent.brand.summary}
            </p>
            <div aria-label="Social links" className="flex gap-4">
              {landingPageContent.socialLinks.map((link) => {
                const Icon = socialIconMap[link.icon as keyof typeof socialIconMap];

                return (
                  <a
                    aria-label={link.label}
                    className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-slate-300 transition hover:border-white hover:text-white"
                    href={link.href}
                    key={link.label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </section>
          <section className="space-y-8">
            <h3 className="text-2xl text-white">{landingPageContent.destinationsHeading}</h3>
            <ul className="space-y-4 text-sm text-muted-luxury">
              {lakeOptions.map((lake) => (
                <li key={lake.id}>
                  <a
                    className="focus-ring transition hover:text-[var(--color-accent)]"
                    href="#lakes"
                  >
                    {lake.name}
                  </a>
                </li>
              ))}
            </ul>
          </section>
          <section className="space-y-8">
            <h3 className="text-2xl text-white">{landingPageContent.concierge.title}</h3>
            <div className="space-y-5 text-sm leading-7 text-muted-luxury">
              <p>{landingPageContent.concierge.phone}</p>
              <p>
                Georgia Regional HQ
                <br />
                Lake Lanier, GA
              </p>
              <p>{landingPageContent.concierge.email}</p>
              <p>
                {landingPageContent.concierge.hours}
                <br />
                {landingPageContent.concierge.hoursNote}
              </p>
            </div>
          </section>
          <section>
            <WaitlistForm layout="stacked" source="footer" />
          </section>
        </div>
        <div className="border-t border-luxury pt-10 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
            {landingPageContent.footerCopyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
