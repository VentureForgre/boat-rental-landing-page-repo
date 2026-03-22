"use client";

import { useId, useState, type FormEvent } from "react";
import {
  type LakeId,
  lakeOptions,
  waitlistSurfaceContent,
  type WaitlistSurface,
  type WaitlistSource,
} from "@/content/landing-page";
import {
  validateWaitlistSubmission,
  type WaitlistFieldErrors,
  type WaitlistResponse,
} from "@/lib/waitlist-schema";

type WaitlistFormProps = {
  className?: string;
  layout?: "inline" | "stacked";
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

export function WaitlistForm({ className, layout, source }: WaitlistFormProps) {
  const surface: WaitlistSurface = waitlistSurfaceContent[source];
  const layoutMode = layout ?? (source === "footer" ? "stacked" : "inline");
  const emailId = useId();
  const lakeId = useId();
  const emailErrorId = useId();
  const lakeErrorId = useId();
  const [email, setEmail] = useState("");
  const [preferredLake, setPreferredLake] = useState<LakeId>(surface.defaultLakeId);
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
        const fieldErrors = !payload.ok ? payload.fieldErrors ?? {} : {};

        setStatus("error");
        setFieldErrors(fieldErrors);
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

  const emailDescribedBy = fieldErrors.email ? emailErrorId : undefined;
  const lakeDescribedBy = fieldErrors.preferredLake ? lakeErrorId : undefined;
  const messageRole =
    status === "success" ? "status" : status === "error" && message ? "alert" : undefined;
  const labelClassName =
    source === "hero"
      ? "block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400"
      : "block text-xs font-semibold uppercase tracking-[0.2em] text-slate-200";
  const fieldErrorClassName =
    source === "hero" ? "text-sm text-amber-700" : "text-sm text-amber-300";
  const formMessageClassName =
    status === "success"
      ? source === "hero"
        ? "text-emerald-700"
        : "text-emerald-300"
      : source === "hero"
        ? "text-amber-700"
        : "text-amber-300";
  const fieldClassName =
    source === "hero"
      ? "w-full rounded-none border border-[var(--color-background)] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--color-background)]"
      : "w-full rounded-none border border-white/15 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--color-accent)]";
  const fieldLayoutClassName =
    layoutMode === "stacked"
      ? "grid gap-4"
      : "grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]";
  const buttonClassName =
    layoutMode === "stacked"
      ? "inline-flex w-full items-center justify-center bg-[var(--color-background)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
      : "inline-flex items-center justify-center bg-[var(--color-background)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70";

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
      <div className={fieldLayoutClassName}>
        <div className="space-y-2">
          <label className={labelClassName} htmlFor={lakeId}>
            {surface.lakeLabel}
          </label>
          <select
            aria-describedby={lakeDescribedBy}
            aria-invalid={fieldErrors.preferredLake ? true : undefined}
            className={fieldClassName}
            id={lakeId}
            name="preferredLake"
            onChange={(event) => setPreferredLake(event.target.value as LakeId)}
            value={preferredLake}
          >
            {lakeOptions.map((lake) => (
              <option key={lake.id} value={lake.id}>
                {lake.label}
              </option>
            ))}
          </select>
          {fieldErrors.preferredLake ? (
            <p className={fieldErrorClassName} id={lakeErrorId}>
              {fieldErrors.preferredLake}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <label className={labelClassName} htmlFor={emailId}>
            {surface.emailLabel}
          </label>
          <input
            autoComplete="email"
            aria-describedby={emailDescribedBy}
            aria-invalid={fieldErrors.email ? true : undefined}
            className={fieldClassName}
            id={emailId}
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder={surface.emailPlaceholder}
            type="email"
            value={email}
          />
          {fieldErrors.email ? (
            <p className={fieldErrorClassName} id={emailErrorId}>
              {fieldErrors.email}
            </p>
          ) : null}
        </div>
        <button
          className={buttonClassName}
          disabled={status === "loading"}
          type="submit"
        >
          {status === "loading" ? "Submitting..." : surface.submitLabel}
        </button>
      </div>
      {message ? (
        <p className={`${formMessageClassName} text-sm`} role={messageRole}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
