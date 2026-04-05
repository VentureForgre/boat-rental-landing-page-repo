import type { WaitlistSubmission } from "@/lib/waitlist-schema";

export type WaitlistEntry = WaitlistSubmission & {
  submittedAt: string;
};

const waitlistEntries: WaitlistEntry[] = [];

export async function saveWaitlistEntry(
  submission: WaitlistSubmission,
): Promise<WaitlistEntry> {
  const entry: WaitlistEntry = {
    ...submission,
    submittedAt: new Date().toISOString(),
  };

  waitlistEntries.push(entry);

  return entry;
}
