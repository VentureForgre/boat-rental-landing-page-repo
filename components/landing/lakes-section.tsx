import Image from "next/image";
import { featuredLakes, landingPageContent } from "@/content/landing-page";
import { SparklesIcon } from "@/components/landing/icons";

function LakeCard({
  alt,
  className,
  demandSignal,
  headlineTag,
  imageSrc,
  name,
}: {
  alt: string;
  className?: string;
  demandSignal?: string;
  headlineTag: string;
  imageSrc: string;
  name: string;
}) {
  return (
    <article className={`group relative overflow-hidden rounded-sm ${className ?? ""}`}>
      <Image
        alt={alt}
        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        height={900}
        src={imageSrc}
        width={1200}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,18,30,0.88)] via-[rgba(10,18,30,0.15)] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 space-y-3 p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent)]">
          {headlineTag}
        </p>
        <h3 className="text-3xl text-white sm:text-4xl">{name}</h3>
        {demandSignal ? (
          <div className="flex items-center gap-2 text-sm text-slate-200">
            <SparklesIcon className="h-4 w-4 text-[var(--color-accent)]" />
            <span>{demandSignal}</span>
          </div>
        ) : null}
      </div>
    </article>
  );
}

export function LakesSection() {
  const [featuredLake, ...remainingLakes] = featuredLakes;
  const stackedLakes = remainingLakes.filter((lake) => lake.emphasis === "stacked");
  const secondaryLakes = remainingLakes.filter(
    (lake) => lake.emphasis === "secondary",
  );

  return (
    <section
      className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32"
      id="lakes"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-32 -translate-y-full bg-gradient-to-b from-transparent via-[rgba(10,18,30,0.7)] to-[var(--color-background)]"
        data-testid="lakes-fade-transition"
      />
      <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-4">
          <p className="eyebrow">{landingPageContent.lakesSection.eyebrow}</p>
          <h2 className="text-4xl text-white sm:text-5xl">
            {landingPageContent.lakesSection.title}
          </h2>
          <p className="text-lg leading-8 text-muted-luxury">
            {landingPageContent.lakesSection.body}
          </p>
        </div>
        <a
          className="focus-ring inline-flex items-center justify-center self-start bg-[var(--color-accent)] px-8 py-4 text-xs font-bold uppercase tracking-[0.24em] text-white transition hover:bg-white hover:text-[var(--color-background)]"
          href={landingPageContent.lakesSection.cta.href}
        >
          {landingPageContent.lakesSection.cta.label}
        </a>
      </div>
      <div className="grid gap-8 md:grid-cols-12">
        <LakeCard
          alt={featuredLake.alt}
          className="min-h-[28rem] md:col-span-7 md:min-h-[37.5rem]"
          demandSignal={featuredLake.demandSignal}
          headlineTag={featuredLake.headlineTag}
          imageSrc={featuredLake.imageSrc}
          name={featuredLake.name}
        />
        <div className="flex flex-col gap-8 md:col-span-5">
          {stackedLakes.map((lake) => (
            <LakeCard
              alt={lake.alt}
              className="min-h-[17rem] flex-1"
              headlineTag={lake.headlineTag}
              imageSrc={lake.imageSrc}
              key={lake.id}
              name={lake.name}
            />
          ))}
        </div>
      </div>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {secondaryLakes.map((lake) => (
          <LakeCard
            alt={lake.alt}
            className="min-h-[18rem]"
            headlineTag={lake.headlineTag}
            imageSrc={lake.imageSrc}
            key={lake.id}
            name={lake.name}
          />
        ))}
      </div>
    </section>
  );
}
