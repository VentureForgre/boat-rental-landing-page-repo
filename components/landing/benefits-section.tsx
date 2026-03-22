import Image from "next/image";
import {
  benefitCards,
  featuredLakes,
  landingPageContent,
} from "@/content/landing-page";
import { BadgeIcon, CalendarIcon, SailingIcon, VerifiedIcon } from "@/components/landing/icons";

const benefitIconMap = {
  badge: BadgeIcon,
  calendar: CalendarIcon,
  sailing: SailingIcon,
  verified: VerifiedIcon,
} as const;

export function BenefitsSection() {
  return (
    <section className="bg-nautical-surface px-6 py-24 lg:px-8 lg:py-32" id="benefits">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)] lg:items-center lg:gap-20">
        <div className="relative">
          <div className="overflow-hidden">
            <Image
              alt="Luxury yacht on a beautiful Georgia lake."
              className="aspect-[4/5] h-full w-full object-cover"
              height={1200}
              src={featuredLakes[3].imageSrc}
              width={960}
            />
          </div>
          <div className="absolute -bottom-6 -right-6 hidden max-w-xs bg-[var(--color-accent)] p-8 md:block lg:-bottom-10 lg:-right-10 lg:p-12">
            <p className="font-display text-3xl italic leading-tight text-[var(--color-background)]">
              &quot;{landingPageContent.standardSection.quote}&quot;
            </p>
          </div>
        </div>
        <div className="space-y-10">
          <div className="space-y-4">
            <p className="eyebrow">{landingPageContent.standardSection.eyebrow}</p>
            <h2 className="text-4xl text-white sm:text-5xl">
              {landingPageContent.standardSection.title}
            </h2>
            <p className="max-w-2xl text-lg leading-8 text-muted-luxury">
              {landingPageContent.standardSection.body}
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            {benefitCards.map((benefit) => {
              const Icon = benefitIconMap[benefit.icon as keyof typeof benefitIconMap];

              return (
                <article className="space-y-4" key={benefit.title}>
                  <Icon className="h-10 w-10 text-[var(--color-accent)]" />
                  <h3 className="text-xl font-medium uppercase tracking-[0.16em] text-white">
                    {benefit.title}
                  </h3>
                  <p className="text-sm leading-7 text-muted-luxury">
                    {benefit.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
