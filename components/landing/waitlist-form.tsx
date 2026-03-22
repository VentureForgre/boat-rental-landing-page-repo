"use client";

import { useId, useState, type FormEvent } from "react";
import {
  lakeOptions,
  waitlistSurfaceContent,
  type WaitlistSource,
} from "@/content/landing-page";
import {
  validateWaitlistSubmission,
  type WaitlistFieldErrors,
  type WaitlistResponse,
} from "@/lib/waitlist-schema";

type WaitlistFormProps = {
  className?: string;
  source: WaitlistSource;
};

type SubmissionState = "idle" | "loading" | "success" | "error";

async function readResponseMessage(response: Response): Promise<WaitlistResponse> {
  try {
    return (await response.json()) as WaitlistResponse;
  } catch {
    return {
      ok: false,
      message: "We could not process your request. Please try again.",
    };
  }
}

export function WaitlistForm({ className, source }: WaitlistFormProps) {
  const surface = waitlistSurfaceContent[source];
  const emailId = useId();
  const lakeId = useId();
  const [email, setEmail] = useState("");
  const [preferredLake, setPreferredLake] = useState(surface.defaultLakeId);
  const [status, setStatus] = useState<SubmissionState>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<WaitlistFieldErrors>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateWaitlistSubmission({
      email,
      preferredLake,
      source,
    });

    if (!validation.ok) {
      setStatus("error");
      setFieldErrors(validation.fieldErrors);
      setMessage(validation.message);
      return;
    }

    setStatus("loading");
    setFieldErrors({});
    setMessage(null);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(validation.data),
      });
      const payload = await readResponseMessage(response);

      if (!response.ok || !payload.ok) {
        setStatus("error");
        setFieldErrors(payload.fieldErrors ?? {});
        setMessage(payload.message);
        return;
      }

      setStatus("success");
      setMessage(payload.message);
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("We could not process your request. Please try again.");
    }
  }

  return (
    <form
      className={className ?? "space-y-4"}
      noValidate
      onSubmit={handleSubmit}
    >
      {surface.title ? (
        <div className="space-y-2">
          <h2 className="text-xl font-medium text-white">{surface.title}</h2>
          {surface.supportingText ? (
            <p className="text-sm text-slate-300">{surface.supportingText}</p>
          ) : null}
        </div>
      ) : null}
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
        <div className="space-y-2">
          <label
            className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-200"
            htmlFor={lakeId}
          >
            {surface.lakeLabel}
          </label>
          <select
            className="w-full rounded-none border border-white/15 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--color-accent)]"
            id={lakeId}
            name="preferredLake"
            onChange={(event) => setPreferredLake(event.target.value)}
            value={preferredLake}
          >
            {lakeOptions.map((lake) => (
              <option key={lake.id} value={lake.id}>
                {lake.label}
              </option>
            ))}
          </select>
          {fieldErrors.preferredLake ? (
            <p className="text-sm text-amber-300">{fieldErrors.preferredLake}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <label
            className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-200"
            htmlFor={emailId}
          >
            {surface.emailLabel}
          </label>
          <input
            autoComplete="email"
            className="w-full rounded-none border border-white/15 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--color-accent)]"
            id={emailId}
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder={surface.emailPlaceholder}
            type="email"
            value={email}
          />
          {fieldErrors.email ? (
            <p className="text-sm text-amber-300">{fieldErrors.email}</p>
          ) : null}
        </div>
        <button
          className="inline-flex items-center justify-center bg-[var(--color-ink)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={status === "loading"}
          type="submit"
        >
          {status === "loading" ? "Submitting..." : surface.submitLabel}
        </button>
      </div>
      <div aria-live="polite" className="min-h-6 text-sm">
        {message ? (
          <p className={status === "success" ? "text-emerald-300" : "text-amber-300"}>
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
