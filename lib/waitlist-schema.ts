import { lakeOptions, type LakeId, type WaitlistSource } from "@/content/landing-page";

export const waitlistSourceOptions = ["hero", "footer"] as const;

export type WaitlistFieldName = "email" | "preferredLake" | "source";

export type WaitlistSubmission = {
  email: string;
  preferredLake: LakeId;
  source: WaitlistSource;
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

export type WaitlistResponse =
  | {
      ok: true;
      message: string;
    }
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
      },
    };
  }

  const email = typeof input.email === "string" ? input.email.trim() : "";
  const preferredLake =
    typeof input.preferredLake === "string" ? input.preferredLake : "";
  const source = typeof input.source === "string" ? input.source : "";
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
    },
  };
}
