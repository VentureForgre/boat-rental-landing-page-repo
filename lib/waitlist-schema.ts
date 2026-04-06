import {
  lakeOptions,
  type LakeId,
  type LandingConversionType,
  type WaitlistSource,
} from "@/content/landing-page";

export const waitlistSourceOptions = ["hero", "footer", "popup"] as const;
export const conversionTypeOptions = ["deposit"] as const;
export const referralCodePattern = /^[A-Z0-9]{8}$/;

export type WaitlistFieldName =
  | "email"
  | "preferredLake"
  | "source"
  | "conversionType"
  | "referralCode";

export type ConversionType = LandingConversionType;

export type WaitlistSubmission = {
  email: string;
  preferredLake?: LakeId;
  source: WaitlistSource;
  conversionType?: ConversionType;
  referralCode?: string;
};

export type WaitlistFieldErrors = Partial<Record<WaitlistFieldName, string>>;

export type WaitlistValidationResult =
  | {
      ok: true;
      data: WaitlistSubmission;
    }
  | {
      ok: false;
      message: string;
      fieldErrors: WaitlistFieldErrors;
    };

export type WaitlistInlineSuccessResponse = {
  ok: true;
  message: string;
  conversionType: ConversionType;
  referralCode: string;
  shareUrl: string;
};

export type WaitlistPopupSuccessResponse = {
  ok: true;
  message: string;
};

export type WaitlistResponse =
  | WaitlistInlineSuccessResponse
  | WaitlistPopupSuccessResponse
  | {
      ok: false;
      message: string;
      fieldErrors?: WaitlistFieldErrors;
    };

const supportedLakeIds = new Set<LakeId>(lakeOptions.map(({ id }) => id));
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isWaitlistSource(value: string): value is WaitlistSource {
  return (waitlistSourceOptions as readonly string[]).includes(value);
}

function isConversionType(value: string): value is ConversionType {
  return (conversionTypeOptions as readonly string[]).includes(value);
}

export function validateWaitlistSubmission(
  input: unknown,
): WaitlistValidationResult {
  if (!isRecord(input)) {
    return {
      ok: false,
      message: "Please fix the highlighted fields and try again.",
      fieldErrors: {
        email: "Enter a valid email address.",
        preferredLake: "Select one of the supported launch lakes.",
        source: "Form source must be hero, footer, or popup.",
        conversionType: "Choose the $200 deposit offer.",
      },
    };
  }

  const email = typeof input.email === "string" ? input.email.trim() : "";
  const preferredLake =
    typeof input.preferredLake === "string" ? input.preferredLake : undefined;
  const rawSource = typeof input.source === "string" ? input.source : "";
  const source = isWaitlistSource(rawSource) ? rawSource : null;
  const rawConversionType =
    typeof input.conversionType === "string" ? input.conversionType : "";
  const conversionType = isConversionType(rawConversionType)
    ? rawConversionType
    : null;
  const rawReferralCode = input.referralCode;
  const referralCode =
    typeof rawReferralCode === "string"
      ? rawReferralCode.trim().toUpperCase()
      : undefined;
  const fieldErrors: WaitlistFieldErrors = {};
  const hasSupportedLake =
    typeof preferredLake === "string" &&
    supportedLakeIds.has(preferredLake as LakeId);
  const requiresLake =
    source === null || source === "hero" || source === "footer";
  const requiresConversionType =
    source === null || source === "hero" || source === "footer";

  if (!emailPattern.test(email)) {
    fieldErrors.email = "Enter a valid email address.";
  }

  if (
    (requiresLake && !hasSupportedLake) ||
    (source === "popup" && preferredLake && !hasSupportedLake)
  ) {
    fieldErrors.preferredLake = "Select one of the supported launch lakes.";
  }

  if (!source) {
    fieldErrors.source = "Form source must be hero, footer, or popup.";
  }

  if (
    (requiresConversionType && !conversionType) ||
    (rawConversionType.length > 0 && !conversionType)
  ) {
    fieldErrors.conversionType = "Choose the $200 deposit offer.";
  }

  if (
    rawReferralCode !== undefined &&
    (typeof rawReferralCode !== "string" ||
      (referralCode !== undefined &&
        referralCode.length > 0 &&
        !referralCodePattern.test(referralCode)))
  ) {
    fieldErrors.referralCode = "Referral code must be 8 letters or numbers.";
  }

  if (!source || Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      message: "Please fix the highlighted fields and try again.",
      fieldErrors,
    };
  }

  const data: WaitlistSubmission = {
    email,
    source,
  };

  if (hasSupportedLake) {
    data.preferredLake = preferredLake as LakeId;
  }

  if (conversionType) {
    data.conversionType = conversionType;
  }

  if (referralCode && referralCodePattern.test(referralCode)) {
    data.referralCode = referralCode;
  }

  return {
    ok: true,
    data,
  };
}
