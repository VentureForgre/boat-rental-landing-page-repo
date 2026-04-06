import { NextResponse } from "next/server";
import { landingPageContent, offerPopupContent } from "@/content/landing-page";
import { saveWaitlistEntry } from "@/lib/waitlist";
import {
  validateWaitlistSubmission,
  type WaitlistInlineSuccessResponse,
  type WaitlistPopupSuccessResponse,
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

function getInlineSuccessMessage() {
  return landingPageContent.conversionFlow.choices[0].success.body;
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return jsonResponse(
      {
        ok: false,
        message: "We could not read your request. Please try again.",
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

    if (validation.data.source === "popup") {
      const responseBody: WaitlistPopupSuccessResponse = {
        ok: true,
        message: offerPopupContent.successMessage,
      };

      return jsonResponse(responseBody, 200);
    }

    if (!entry.conversionType) {
      throw new Error("Inline submissions must include a conversion type.");
    }

    const responseBody: WaitlistInlineSuccessResponse = {
      ok: true,
      message: getInlineSuccessMessage(),
      conversionType: entry.conversionType,
      referralCode: entry.referralCode,
      shareUrl: buildShareUrl(request.url, entry.referralCode),
    };

    return jsonResponse(responseBody, 200);
  } catch {
    return jsonResponse(
      {
        ok: false,
        message: "We could not save your request. Please try again.",
      },
      500,
    );
  }
}
