import { NextResponse } from "next/server";
import { saveWaitlistEntry } from "@/lib/waitlist";
import {
  validateWaitlistSubmission,
  type WaitlistResponse,
} from "@/lib/waitlist-schema";

function jsonResponse(body: WaitlistResponse, status: number) {
  return NextResponse.json(body, { status });
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
    await saveWaitlistEntry(validation.data);

    return jsonResponse(
      {
        ok: true,
        message: "You are on the Luxe Lake waitlist.",
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
