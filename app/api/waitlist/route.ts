import { NextResponse } from "next/server";
import { saveWaitlistEntry } from "@/lib/waitlist";
import {
  validateWaitlistSubmission,
  type WaitlistResponse,
} from "@/lib/waitlist-schema";

function jsonResponse(body: WaitlistResponse, status: number) {
  return NextResponse.json(body, { status });
}

function buildShareUrl(requestUrl: string, referralCode: string) {
  const shareUrl = new URL("/", requestUrl);
  shareUrl.searchParams.set("ref", referralCode);

  return shareUrl.toString();
}

function getSuccessMessage() {
  return "Your $25 refundable priority request is in. Concierge follow-up comes next to finalize the deposit.";
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return jsonResponse(
      {
        ok: false,
        message: "We could not read your deposit request. Please try again.",
      },
      400,
    );
  }

  const validation = validateWaitlistSubmission(payload);

  if (!validation.ok) {
    return jsonResponse(validation, 400);
  }

  try {
    const entry = await saveWaitlistEntry(validation.data);

    return jsonResponse(
      {
        ok: true,
        message: getSuccessMessage(),
        conversionType: entry.conversionType,
        referralCode: entry.referralCode,
        shareUrl: buildShareUrl(request.url, entry.referralCode),
      },
      200,
    );
  } catch {
    return jsonResponse(
      {
        ok: false,
        message: "We could not save your deposit request. Please try again.",
      },
      500,
    );
  }
}
