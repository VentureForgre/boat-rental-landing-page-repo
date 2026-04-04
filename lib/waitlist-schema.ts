import {
  lakeOptions,
  type LakeId,
  type LandingConversionType,
  type WaitlistSource,
} from "@/content/landing-page";

export const waitlistSourceOptions = ["hero", "footer"] as const;
export const conversionTypeOptions = ["waitlist", "deposit"] as const;
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
  preferredLake: LakeId;
  source: WaitlistSource;
  conversionType: ConversionType;
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

export type WaitlistSuccessResponse = {
  ok: true;
  message: string;
  conversionType: ConversionType;
  referralCode: string;
  shareUrl: string;
};

export type WaitlistResponse =
  | WaitlistSuccessResponse
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
        source: "Form source must be hero or footer.",
        conversionType:
          "Choose either the free waitlist or the refundable deposit option.",
      },
    };
  }

  const email = typeof input.email === "string" ? input.email.trim() : "";
  const preferredLake =
    typeof input.preferredLake === "string" ? input.preferredLake : "";
  const source = typeof input.source === "string" ? input.source : "";
  const conversionType =
    typeof input.conversionType === "string" ? input.conversionType : "";
  const rawReferralCode = input.referralCode;
  const referralCode =
    typeof rawReferralCode === "string"
      ? rawReferralCode.trim().toUpperCase()
      : undefined;
  const fieldErrors: WaitlistFieldErrors = {};

  if (!emailPattern.test(email)) {
    fieldErrors.email = "Enter a valid email address.";
  }

  if (!supportedLakeIds.has(preferredLake as LakeId)) {
    fieldErrors.preferredLake = "Select one of the supported launch lakes.";
  }

  if (!isWaitlistSource(source)) {
    fieldErrors.source = "Form source must be hero or footer.";
  }

  if (!isConversionType(conversionType)) {
    fieldErrors.conversionType =
      "Choose either the free waitlist or the refundable deposit option.";
  }

  if (
    rawReferralCode !== undefined &&
    referralCode !== undefined &&
    referralCode.length > 0 &&
    !referralCodePattern.test(referralCode)
  ) {
    fieldErrors.referralCode =
      "Referral code must be 8 letters or numbers.";
  }

  if (rawReferralCode !== undefined && typeof rawReferralCode !== "string") {
    fieldErrors.referralCode =
      "Referral code must be 8 letters or numbers.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      message: "Please fix the highlighted fields and try again.",
      fieldErrors,
    };
  }

  return {
    ok: true,
      data: {
        email,
        preferredLake: preferredLake as LakeId,
        source: source as WaitlistSource,
        conversionType: conversionType as ConversionType,
        ...(referralCode && referralCodePattern.test(referralCode)
          ? { referralCode }
          : {}),
      },
  };
}
