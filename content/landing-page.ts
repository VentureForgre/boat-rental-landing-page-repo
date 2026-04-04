export type LakeId =
  | "lake-sidney-lanier"
  | "allatoona-lake"
  | "hartwell-lake"
  | "j-strom-thurmond-lake"
  | "walter-f-george-lake";

export type WaitlistSource = "hero" | "footer";
export type LandingConversionType = "deposit";

export type LandingIconName =
  | "badge"
  | "calendar"
  | "camera"
  | "globe"
  | "location"
  | "mail"
  | "sailing"
  | "search"
  | "share"
  | "sparkles"
  | "verified";

export type NavigationItem = {
  href: string;
  label: string;
};

export type LakeOption = {
  id: LakeId;
  label: string;
  market: string;
  name: string;
  priorityLabel?: string;
};

export type LakeFeature = {
  alt: string;
  demandSignal?: string;
  emphasis: "featured" | "secondary" | "stacked";
  headlineTag: string;
  id: LakeId;
  imageSrc: string;
  name: string;
  region: string;
};

export type BenefitCard = {
  description: string;
  icon: LandingIconName;
  title: string;
};

export type ConversionChoice = {
  description: string;
  id: LandingConversionType;
  label: string;
  submitLabel: string;
  success: {
    body: string;
    title: string;
  };
  valueProps: string[];
  disclaimer?: string;
};

export type ConversionProofPoint = {
  description: string;
  label: string;
};

export type ReferralShareContent = {
  description: string;
  fallbackActionLabel: string;
  helperText: string;
  primaryActionLabel: string;
  title: string;
};

export type WaitlistSurface = {
  defaultLakeId: LakeId;
  emailLabel: string;
  emailPlaceholder: string;
  formIntro: string;
  lakeLabel: string;
  source: WaitlistSource;
  submitLabel: string;
  supportingText?: string;
  title?: string;
};

const currentYear = new Date().getFullYear();
const launchSeason = `Summer ${currentYear}`;

export const navigationItems = [
  { href: "#experience", label: "Experience" },
  { href: "#lakes", label: "Georgia Lakes" },
  { href: "#benefits", label: "Premium Fleet" },
  { href: "#concierge", label: "Contact" },
] satisfies readonly NavigationItem[];

export const lakeOptions = [
  {
    id: "lake-sidney-lanier",
    label: "Lake Sidney Lanier (Priority)",
    market: "Primary launch market",
    name: "Lake Sidney Lanier",
    priorityLabel: "Primary Market",
  },
  {
    id: "allatoona-lake",
    label: "Allatoona Lake (Priority)",
    market: "Launch priority",
    name: "Allatoona Lake",
    priorityLabel: "Launch Priority",
  },
  {
    id: "hartwell-lake",
    label: "Hartwell Lake",
    market: "Georgia & South Carolina",
    name: "Hartwell Lake",
  },
  {
    id: "j-strom-thurmond-lake",
    label: "J. Strom Thurmond Lake",
    market: "Savannah River Basin",
    name: "J. Strom Thurmond Lake",
  },
  {
    id: "walter-f-george-lake",
    label: "Walter F. George Lake",
    market: "Southern Georgia",
    name: "Walter F. George Lake",
  },
] satisfies readonly LakeOption[];

export const featuredLakes = [
  {
    alt: "Luxury charter boat on Lake Sidney Lanier at golden hour.",
    demandSignal: "High Demand - Early Booking Recommended",
    emphasis: "featured",
    headlineTag: "Primary Market \u2022 Launch Priority",
    id: "lake-sidney-lanier",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDQJ3iMLBr1x7kmFqrYg-Z7jRIZv5OogBZ3TCeDZvV3ScNL4-a3ufUuUIuXFC4HG2Jeqquu2x085Xwo85xIghmbo3N4aZy_mtyInhmRFURuyLCe_ED5s96nhoN-vf8jheXIfKinkZ5jJ4kqpj40Of9XeRRoJx5eb5YcqIHNBpzhpP4_RjCz1hPGrHvnuBXuSb7gWV62sS0r3nmR5mHV-_seUP9SxUwz2vPEC7NL1AmimVH44TF0a_jyM7XzDnTQdWx5z-DQtSPb1cS8",
    name: "Lake Sidney Lanier",
    region: "North Georgia",
  },
  {
    alt: "Premium boat charter on Allatoona Lake surrounded by forest.",
    emphasis: "stacked",
    headlineTag: "Launch Priority",
    id: "allatoona-lake",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDIYuVOgySLJI4pKRXrT8aG-lLAIQzfh3o4iB7TRxqwL7wZaYXBo5WQLTFddLAJb7qW-FP7fQrp6zLztopweYDaXf9Sslixa4yRcWRxBnFzNOSZjhP6CMthEnB-bJxlUsBdIvhnUgJiMgVgYAndOQ4-OSJFk1ALPg1hwgLcowpizzDUw_DRa3njS6u4AcyHtolssT5cUAyJwQ6cUqlwhhE_bI1oUz551eUVr-NltMtGU8H7Rl3ixR_br7FUgSGksCaleeZzqqnHs1Ur",
    name: "Allatoona Lake",
    region: "Northwest Georgia",
  },
  {
    alt: "Scenic Hartwell Lake shoreline ready for luxury yacht day charters.",
    emphasis: "stacked",
    headlineTag: "Georgia & South Carolina",
    id: "hartwell-lake",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBNwXwy8MYuIgB9nvoj-r-86F21MW2XVjccqi4defLOaH2AbGxSAbYJ2K-d57hJgf-gfxnVgV2fBMK-UKPiSEkUiSiNZ4Fhc3aCg3mdw9ZvcIcrx_mReG9ZF9R61KASk61qKfZBf1zQ7whKZyWEPppnC7ZI-hRDWy0nYXiVCUAKDtgoYna35cRvMtAZ7K0WvpwvoNh2mz5F_ZBC8-heRRaOp_HMViU4CfcxgeHb_hwcgsR7xORLCveaos417cLSM0q5Lg9ThR1LjgK5",
    name: "Hartwell Lake",
    region: "Georgia & South Carolina",
  },
  {
    alt: "Open water on J. Strom Thurmond Lake in the Savannah River Basin.",
    emphasis: "secondary",
    headlineTag: "Savannah River Basin",
    id: "j-strom-thurmond-lake",
    imageSrc:
      "https://images.pexels.com/photos/5151427/pexels-photo-5151427.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=1600",
    name: "J. Strom Thurmond Lake",
    region: "Eastern Georgia",
  },
  {
    alt: "Luxury day charter inspiration on Walter F. George Lake.",
    emphasis: "secondary",
    headlineTag: "Southern Georgia",
    id: "walter-f-george-lake",
    imageSrc:
      "https://images.pexels.com/photos/36141966/pexels-photo-36141966.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=1600",
    name: "Walter F. George Lake",
    region: "Southern Georgia",
  },
] satisfies readonly LakeFeature[];

export const benefitCards = [
  {
    description:
      "Relax as our USCG-licensed captains navigate your journey with expert care.",
    icon: "badge",
    title: "Professional Captains",
  },
  {
    description:
      "Artisan-crafted yachts and top-tier pontoons, maintained to immaculate standards.",
    icon: "sailing",
    title: "Premium Fleet",
  },
  {
    description:
      "Secure your spot now for our inaugural season of luxury charters.",
    icon: "verified",
    title: `Coming ${launchSeason}`,
  },
  {
    description:
      "Waitlist members receive first access to calendar dates before the public.",
    icon: "calendar",
    title: "Ready to Book",
  },
] satisfies readonly BenefitCard[];

export const waitlistSurfaceContent = {
  footer: {
    defaultLakeId: "lake-sidney-lanier",
    emailLabel: "Your Email Address",
    emailPlaceholder: "Your Email Address",
    formIntro: "Choose the lake where concierge should prioritize your launch window.",
    lakeLabel: "Select Your Lake",
    source: "footer",
    submitLabel: "Request Deposit Priority",
    supportingText:
      "Launch priority for Lake Sidney Lanier starts here. Concierge confirms the deposit collection after you submit.",
    title: "Priority deposit request",
  },
  hero: {
    defaultLakeId: "lake-sidney-lanier",
    emailLabel: "Ready to Book?",
    emailPlaceholder: "Enter your email for priority follow-up",
    formIntro: "Tell us where to send the private deposit invite and launch updates.",
    lakeLabel: "Select Your Lake",
    source: "hero",
    submitLabel: "Request Deposit Priority",
    supportingText:
      "Concierge confirms the refundable $25 deposit collection after you submit this request.",
    title: "Priority deposit request",
  },
} satisfies Record<WaitlistSource, WaitlistSurface>;

export const landingPageContent = {
  brand: {
    icon: "sailing" as LandingIconName,
    name: "Luxe Lake",
    summary:
      "Georgia's premier luxury yacht charter experience. Artisan-crafted vessels for those ready to book the extraordinary.",
    wordmark: "Luxe Lake Escapes",
  },
  closingCta: {
    actions: [
      { href: "#deposit", label: "Reserve Priority" },
      { href: "#lakes", label: "Explore Fleet" },
    ],
    body:
      "Lead with a refundable $25 deposit request, then share your link so referral rate proves organic demand beyond the first signup.",
    title: "Secure Your Launch Priority",
  },
  concierge: {
    email: "concierge@luxelake.com",
    hours: "Mon - Fri, 9.00am Until 6.30pm",
    hoursNote: "We Reply Within 24 Hrs",
    phone: "+1 (800) LUXE-LAKE",
    title: "Concierge",
  },
  conversionFlow: {
    description:
      "A single priority-deposit path keeps the experience high-intent: reserve launch priority now, then let concierge confirm the refundable $25 deposit off-platform.",
    metricCallout:
      "100 deposits. $2,500. Louder than 1,000 free emails.",
    proofPoints: [
      {
        description: "A clear $25 signal without pretending the card was already charged on-site.",
        label: "Refundable deposit",
      },
      {
        description: "Personal follow-up confirms timing, lake preference, and deposit collection after submission.",
        label: "Concierge follow-up",
      },
      {
        description: "Every confirmed signup gets a link so referral rate can prove the market is spreading organically.",
        label: "Referral proof",
      },
    ] satisfies readonly ConversionProofPoint[],
    choices: [
      {
        description:
          "Request a refundable $25 deposit to hold priority status before the public launch calendar opens.",
        disclaimer:
          "Concierge confirms the deposit collection after you submit. Keep every touchpoint explicit that payment is not collected on this page.",
        id: "deposit",
        label: "$25 refundable deposit",
        submitLabel: "Request Deposit Priority",
        success: {
          body: "Your $25 refundable priority request is in. Concierge follow-up comes next to finalize the deposit.",
          title: "Priority request confirmed",
        },
        valueProps: [
          "Signals stronger intent than a free email without feeling like checkout.",
          "Keeps the refundable amount and next step legible at a glance.",
          "Turns each confirmed request into a referral source immediately.",
        ],
      },
    ] satisfies readonly ConversionChoice[],
    referralShare: {
      description:
        "Share your private link while the launch request is fresh so organic demand is visible in the next qualified signup attributed back to you.",
      fallbackActionLabel: "Copy link manually",
      helperText:
        "Referral rate tracks what share of completed deposit requests came from another signup sharing their link.",
      primaryActionLabel: "Copy referral link",
      title: "Share to keep the priority list moving",
    } satisfies ReferralShareContent,
    selectorLabel: "Reservation brief",
    selectorSupportingText:
      "Deposit-only keeps the story sharp: real intent now, concierge confirmation next, referral proof after that.",
    title: "Request a $25 refundable priority deposit",
  },
  destinationsHeading: "Destinations",
  footerCopyright: `\u00A9 ${currentYear} Luxe Lake Escapes, All Rights Reserved`,
  hero: {
    description:
      "Reserve launch priority for Georgia's most prestigious waters with a refundable $25 deposit request, concierge follow-up, and a share loop built to prove organic demand.",
    eyebrow: `Coming ${launchSeason}`,
    headline: "The Art of Inland Sailing",
    headlineAccent: "Inland Sailing",
    primaryAction: { href: "#deposit", label: "Reserve Priority" },
  },
  lakesSection: {
    body:
      `We are currently gauging real demand to finalize our ${launchSeason} launch fleet locations.`,
    cta: { href: "#deposit", label: "Reserve Priority" },
    eyebrow: "Our Launch Markets",
    title: "Explore Georgia's Premier Shores",
  },
  socialLinks: [
    { href: "#", icon: "share" as LandingIconName, label: "Share" },
    { href: "#", icon: "globe" as LandingIconName, label: "Visit Website" },
    {
      href: "#",
      icon: "camera" as LandingIconName,
      label: "Instagram",
    },
  ],
  standardSection: {
    body:
      "As a new luxury brand entering the Georgia market, we are committed to setting a new benchmark for excellence on the water. Every charter includes white-glove service from start to finish.",
    eyebrow: "The Luxe Lake Standard",
    quote: "The ultimate lakefront sanctuary.",
    title: "Unrivaled Safety, Comfort & Style",
  },
} as const;
