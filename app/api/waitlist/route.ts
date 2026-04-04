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

function getSuccessMessage(conversionType: "waitlist" | "deposit") {
  if (conversionType === "deposit") {
    return "Your refundable deposit request is recorded for priority follow-up.";
  }

  return "You are on the Luxe Lake waitlist.";
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return jsonResponse(
      {
        ok: false,
        message: "We could not read your waitlist request. Please try again.",
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
        message: getSuccessMessage(entry.conversionType),
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
        message: "We could not save your waitlist request. Please try again.",
      },
      500,
    );
  }
}
