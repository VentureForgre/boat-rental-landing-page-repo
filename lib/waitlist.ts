import { randomBytes, randomUUID } from "node:crypto";
import {
  referralCodePattern,
  type WaitlistSubmission,
} from "@/lib/waitlist-schema";

const DEPOSIT_AMOUNT_CENTS = 2500;

export type DepositStatus = "pending";

export type WaitlistEntry = WaitlistSubmission & {
  id: string;
  submittedAt: string;
  referralCode: string;
  referredByCode?: string;
  isReferral: boolean;
  depositAmountCents?: number;
  depositStatus?: DepositStatus;
};

const waitlistEntries: WaitlistEntry[] = [];

function generateReferralCode() {
  let referralCode = "";

  do {
    referralCode = randomBytes(4).toString("hex").toUpperCase();
  } while (waitlistEntries.some((entry) => entry.referralCode === referralCode));

  return referralCode;
}

function resolveReferralAttribution(referralCode?: string) {
  if (!referralCode || !referralCodePattern.test(referralCode)) {
    return undefined;
  }

  return waitlistEntries.find((entry) => entry.referralCode === referralCode)
    ?.referralCode;
}

export async function saveWaitlistEntry(
  submission: WaitlistSubmission,
): Promise<WaitlistEntry> {
  const { referralCode: submittedReferralCode, ...baseSubmission } = submission;
  const referralCode = generateReferralCode();
  const referredByCode = resolveReferralAttribution(submittedReferralCode);
  const entry = {
    ...baseSubmission,
    id: randomUUID(),
    submittedAt: new Date().toISOString(),
    referralCode,
    isReferral: Boolean(
      referredByCode && referredByCode !== referralCode,
    ),
    ...(referredByCode && referredByCode !== referralCode
      ? { referredByCode }
      : {}),
    ...(submission.conversionType === "deposit"
      ? {
          depositAmountCents: DEPOSIT_AMOUNT_CENTS,
          depositStatus: "pending" as const,
        }
      : {}),
  };

  waitlistEntries.push(entry);

  return entry;
}
