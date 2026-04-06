export type LakeId =
  | "lake-sidney-lanier"
  | "allatoona-lake"
  | "hartwell-lake"
  | "j-strom-thurmond-lake"
  | "walter-f-george-lake";

export type LandingConversionType = "deposit";
export type WaitlistSource = "hero" | "footer" | "popup";
export type WaitlistSurfaceSource = Exclude<WaitlistSource, "popup">;

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
  source: WaitlistSurfaceSource;
  submitLabel: string;
  supportingText?: string;
  title?: string;
};

export type OfferPopupContent = {
  body: string;
  ctaLabel: string;
  dismissLabel: string;
  emailLabel: string;
  emailPlaceholder: string;
  headline: string;
  successMessage: string;
  submitLabel: string;
  triggers: {
    delaySeconds: number;
    dismissCooldownHours: number;
    maxDailyImpressions: number;
    submittedSuppressionDays: number;
  };
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
    headlineTag: "Primary Market • Launch Priority",
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
      "Place $200 today and keep the flexibility to reserve any 2 charter days later.",
    icon: "verified",
    title: "Today's Offer Only",
  },
  {
    description:
      "Claim the offer now and our concierge team will map out the right dates, vessel, and next steps.",
    icon: "calendar",
    title: "Reserve Any 2 Charter Days Later",
  },
] satisfies readonly BenefitCard[];

export const waitlistSurfaceContent = {
  footer: {
    defaultLakeId: "lake-sidney-lanier",
    emailLabel: "Your Email Address",
    emailPlaceholder: "Enter your email for today's offer details",
    formIntro:
      "Choose your preferred lake and we will send today's $200 for any 2 days offer with concierge follow-up.",
    lakeLabel: "Select Your Lake",
    source: "footer",
    submitLabel: "Send Offer Details",
    supportingText:
      "Deposit $200 today, redeem any two charter days later, and let concierge handle the booking details.",
    title: "Get The $200 Offer",
  },
  hero: {
    defaultLakeId: "lake-sidney-lanier",
    emailLabel: "Ready to Reserve?",
    emailPlaceholder: "Enter your email to claim today's $200 offer",
    formIntro:
      "Claim the $200 today for any 2 days offer now and choose the charter dates you want later.",
    lakeLabel: "Select Your Lake",
    source: "hero",
    submitLabel: "Claim Offer",
  },
} satisfies Record<WaitlistSurfaceSource, WaitlistSurface>;

export const offerPopupContent = {
  body:
    "Enter your email to unlock 30% off and get the $200 today for any 2 days offer details before you leave.",
  ctaLabel: "Unlock 30% Off",
  dismissLabel: "Continue Browsing",
  emailLabel: "Email Address",
  emailPlaceholder: "Enter your email",
  headline: "Unlock 30% Off Your Luxe Lake Charter",
  successMessage:
    "You unlocked 30% off. Check your inbox for the Luxe Lake offer details.",
  submitLabel: "Unlock My 30% Off",
  triggers: {
    delaySeconds: 6,
    dismissCooldownHours: 72,
    maxDailyImpressions: 2,
    submittedSuppressionDays: 30,
  },
} satisfies OfferPopupContent;

export const heroDepositCardContent = {
  eyebrow: "Today's Offer Only",
  title: "Reserve Today With $200 For Any 2 Days",
  description:
    "Choose your lake and email. Deposit $200 today, then redeem any two charter days later with concierge support.",
  successIntro: "Offer request confirmed",
} as const;

export const footerReservationBriefContent = {
  eyebrow: "Offer brief",
  metricCallout: "Two charter days. One $200 deposit. Concierge-guided redemption.",
} as const;

export const landingPageContent = {
  brand: {
    icon: "sailing" as LandingIconName,
    name: "Luxe Lake",
    summary:
      "Georgia's premier luxury yacht charter experience. Claim today's $200 offer and redeem it later for any two charter days with concierge guidance.",
    wordmark: "Luxe Lake Escapes",
  },
  closingCta: {
    actions: [
      { href: "#deposit", label: "Claim Today's Offer" },
      { href: "#concierge", label: "Talk To Concierge" },
    ],
    body:
      "Place your $200 deposit today, redeem it later for any two charter days you choose, and let concierge guide the rest.",
    title: "Reserve Any 2 Charter Days With $200 Today",
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
      "Claim the $200 today for any 2 days offer now, then let concierge confirm the lake, timing, and how to redeem both charter days.",
    metricCallout:
      "Two charter days. One $200 deposit. Concierge-guided redemption.",
    proofPoints: [
      {
        description:
          "Reserve now with a clear $200 deposit and keep flexibility over which two charter days you redeem later.",
        label: "Flexible deposit offer",
      },
      {
        description:
          "Personal follow-up confirms lake preference, vessel fit, and the right dates for your two-day charter plan.",
        label: "Concierge follow-up",
      },
      {
        description:
          "Every confirmed request still gets a share link so referral demand can compound beyond the first signup.",
        label: "Referral sharing",
      },
    ] satisfies readonly ConversionProofPoint[],
    choices: [
      {
        description:
          "Deposit $200 today to secure the offer, then redeem it against any two charter days you choose later.",
        disclaimer:
          "After you submit, concierge confirms your preferred lake, timing, and how the two charter days will be redeemed.",
        id: "deposit",
        label: "$200 today for any 2 days",
        submitLabel: "Claim Offer",
        success: {
          body: "Your $200 for any 2 days request is in. Watch your inbox for concierge follow-up and your share link.",
          title: "Offer request confirmed",
        },
        valueProps: [
          "Locks in today's offer while keeping your actual charter dates flexible.",
          "Makes the next step explicit with concierge follow-up instead of checkout friction.",
          "Turns each confirmed request into a referral source immediately.",
        ],
      },
    ] satisfies readonly ConversionChoice[],
    referralShare: {
      description:
        "Share your private link while the offer request is fresh so additional qualified signups can still be attributed back to you.",
      fallbackActionLabel: "Copy link manually",
      helperText:
        "Referral rate tracks what share of completed offer requests came from another guest sharing their link.",
      primaryActionLabel: "Copy referral link",
      title: "Share to keep the charter calendar moving",
    } satisfies ReferralShareContent,
    selectorLabel: "Offer brief",
    selectorSupportingText:
      "A single offer path keeps the story sharp: deposit now, concierge confirmation next, referral proof after that.",
    title: "Reserve Any 2 Charter Days With $200 Today",
  },
  destinationsHeading: "Destinations",
  footerCopyright: `© ${currentYear} Luxe Lake Escapes, All Rights Reserved`,
  hero: {
    description:
      "Reserve your escape with $200 today for any 2 days, then redeem it later for any two charter days you choose with Luxe Lake concierge support.",
    eyebrow: "Today's Offer Only",
    headline: "Reserve Today",
    headlineAccent: "$200 for Any 2 Days",
    primaryAction: { href: "#deposit", label: "Claim Today's Offer" },
  },
  lakesSection: {
    body:
      `Select your preferred shore and we will pair today's $200 two-day offer with our ${launchSeason} launch fleet locations.`,
    cta: { href: "#deposit", label: "Choose Your Lake" },
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
      "Every Luxe Lake charter is built around white-glove planning, professional captains, and refined on-water hospitality worthy of the dates you reserve.",
    eyebrow: "The Luxe Lake Standard",
    quote: "The ultimate lakefront sanctuary.",
    title: "Unrivaled Safety, Comfort & Style",
  },
} as const;
