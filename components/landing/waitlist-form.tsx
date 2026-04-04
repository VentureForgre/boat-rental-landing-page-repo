"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import {
  footerReservationBriefContent,
  heroDepositCardContent,
  landingPageContent,
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
  referralCode?: string;
  source: WaitlistSource;
};

type SubmissionState = "idle" | "loading" | "success" | "error";
type ShareStatus = "idle" | "copied" | "manual" | "error";

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

export function WaitlistForm({
  className,
  layout,
  referralCode,
  source,
}: WaitlistFormProps) {
  const surface: WaitlistSurface = waitlistSurfaceContent[source];
  const conversionFlow = landingPageContent.conversionFlow;
  const selectedChoice = conversionFlow.choices[0];
  const isCompactHero = source === "hero";
  const layoutMode = layout ?? (source === "footer" ? "stacked" : "inline");
  const emailId = useId();
  const lakeId = useId();
  const emailErrorId = useId();
  const lakeErrorId = useId();
  const [email, setEmail] = useState("");
  const [preferredLake, setPreferredLake] = useState<LakeId>(surface.defaultLakeId);
  const [status, setStatus] = useState<SubmissionState>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [successResponse, setSuccessResponse] = useState<Extract<
    WaitlistResponse,
    { ok: true }
  > | null>(null);
  const [shareStatus, setShareStatus] = useState<ShareStatus>("idle");
  const [fieldErrors, setFieldErrors] = useState<WaitlistFieldErrors>({});
  const shareInputRef = useRef<HTMLInputElement>(null);

  const canCopyReferralLink =
    typeof navigator !== "undefined" &&
    typeof navigator.clipboard?.writeText === "function";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateWaitlistSubmission({
      email,
      preferredLake,
      conversionType: selectedChoice.id,
      ...(referralCode ? { referralCode } : {}),
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
    setSuccessResponse(null);
    setShareStatus("idle");

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
      setSuccessResponse(payload);
    } catch {
      setStatus("error");
      setMessage("We could not process your request. Please try again.");
    }
  }

  async function handleCopyReferralLink() {
    if (!successResponse) {
      return;
    }

    if (!canCopyReferralLink) {
      shareInputRef.current?.focus();
      shareInputRef.current?.select();
      setShareStatus("manual");
      return;
    }

    try {
      await navigator.clipboard.writeText(successResponse.shareUrl);
      setShareStatus("copied");
    } catch {
      shareInputRef.current?.focus();
      shareInputRef.current?.select();
      setShareStatus("error");
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
      ? "w-full rounded-xl border border-[var(--color-background)]/15 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--color-accent)]"
      : "w-full rounded-xl border border-white/15 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--color-accent)]";
  const proofPanelClassName =
    source === "hero"
      ? "overflow-hidden rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(248,243,235,0.92))] shadow-[0_24px_80px_rgba(15,23,42,0.14)]"
      : "overflow-hidden rounded-[1.75rem] border border-white/15 bg-[linear-gradient(145deg,rgba(18,29,46,0.92),rgba(10,18,30,0.86))] shadow-[0_24px_80px_rgba(0,0,0,0.28)]";
  const proofEyebrowClassName =
    source === "hero" ? "text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent-strong)]" : "text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]";
  const proofTitleClassName =
    source === "hero" ? "text-2xl text-slate-950 sm:text-3xl" : "text-2xl text-white";
  const proofDescriptionClassName =
    source === "hero" ? "text-sm leading-7 text-slate-600" : "text-sm leading-7 text-slate-300";
  const proofPointClassName =
    source === "hero"
      ? "rounded-[1.5rem] border border-slate-200 bg-white/95 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
      : "rounded-[1.5rem] border border-white/10 bg-white/5 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.18)]";
  const proofDisclaimerClassName =
    source === "hero" ? "text-xs leading-6 text-amber-700" : "text-xs leading-6 text-amber-300";
  const proofLabelClassName =
    source === "hero"
      ? "text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-strong)]"
      : "text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]";
  const proofValueClassName =
    source === "hero" ? "mt-3 text-lg text-slate-950" : "mt-3 text-lg text-white";
  const formShellClassName =
    source === "hero"
      ? "rounded-[1.75rem] border border-slate-200/80 bg-white/88 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur sm:p-6"
      : "rounded-[1.75rem] border border-white/10 bg-white/6 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.24)] backdrop-blur sm:p-6";
  const fieldLayoutClassName =
    layoutMode === "stacked" ? "grid gap-4" : "grid gap-4 sm:grid-cols-2";
  const buttonClassName =
    "inline-flex w-full items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--color-accent),#b88d55)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-background)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70";
  const sharePanelClassName =
    source === "hero"
      ? "space-y-3 rounded-[1.5rem] border border-emerald-200 bg-emerald-50/95 p-4 text-slate-900"
      : "space-y-3 rounded-[1.5rem] border border-emerald-300/30 bg-emerald-500/10 p-4 text-white";
  const shareButtonLabel = canCopyReferralLink
    ? shareStatus === "copied"
      ? "Copied link"
      : conversionFlow.referralShare.primaryActionLabel
    : conversionFlow.referralShare.fallbackActionLabel;
  const shareStatusMessage =
    shareStatus === "manual"
      ? "Copy the highlighted link to share it manually."
      : shareStatus === "error"
        ? "Clipboard access was unavailable, so copy the highlighted link manually."
        : null;

  const formFields = (
    <>
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
      </div>
      <button
        className={buttonClassName}
        disabled={status === "loading"}
        type="submit"
      >
        {status === "loading" ? "Submitting..." : selectedChoice.submitLabel}
      </button>
      {message ? (
        <p className={`${formMessageClassName} text-sm`} role={messageRole}>
          {message}
        </p>
      ) : null}
      {successResponse ? (
        <section className={sharePanelClassName}>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-inherit/70">
              {isCompactHero ? heroDepositCardContent.successIntro : selectedChoice.success.title}
            </p>
            <h3 className="text-base font-semibold">{conversionFlow.referralShare.title}</h3>
            <p className="text-sm">{conversionFlow.referralShare.description}</p>
            <p className="text-sm">{conversionFlow.referralShare.helperText}</p>
          </div>
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
            <input
              className={fieldClassName}
              readOnly
              ref={shareInputRef}
              value={successResponse.shareUrl}
            />
            <button
              className={buttonClassName}
              onClick={handleCopyReferralLink}
              type="button"
            >
              {shareButtonLabel}
            </button>
          </div>
          {shareStatusMessage ? <p className="text-sm">{shareStatusMessage}</p> : null}
        </section>
      ) : null}
    </>
  );

  return (
    <form
      className={className ?? "space-y-4"}
      noValidate
      onSubmit={handleSubmit}
    >
      {isCompactHero ? (
        <section className={proofPanelClassName}>
          <div className="space-y-6 p-5 sm:p-6">
            <div className="space-y-3">
              <p className={proofEyebrowClassName}>{heroDepositCardContent.eyebrow}</p>
              <div className="space-y-2">
                <h2 className={proofTitleClassName}>{heroDepositCardContent.title}</h2>
                <p className={proofDescriptionClassName}>{heroDepositCardContent.description}</p>
              </div>
            </div>
            <div className={formShellClassName}>
              <div className="space-y-2">
                <p className={proofDescriptionClassName}>{surface.formIntro}</p>
              </div>
              <div className="mt-6 space-y-4">{formFields}</div>
            </div>
          </div>
        </section>
      ) : (
      <section className={proofPanelClassName}>
        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className={proofEyebrowClassName}>{footerReservationBriefContent.eyebrow}</p>
              <div className="space-y-2">
                <h2 className={proofTitleClassName}>{conversionFlow.title}</h2>
                <p className={proofDescriptionClassName}>{conversionFlow.description}</p>
              </div>
              <div className="inline-flex rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-strong)]">
                {footerReservationBriefContent.metricCallout}
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {conversionFlow.proofPoints.map((proofPoint) => (
                <article className={proofPointClassName} key={proofPoint.label}>
                  <p className={proofLabelClassName}>{proofPoint.label}</p>
                  <p className={proofValueClassName}>{proofPoint.description}</p>
                </article>
              ))}
            </div>
            <div className="rounded-[1.5rem] border border-[var(--color-accent)]/20 bg-[linear-gradient(140deg,rgba(193,164,126,0.16),rgba(193,164,126,0.04))] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-inherit">
                {selectedChoice.label}
              </p>
              <p className={`${proofDescriptionClassName} mt-3`}>
                {selectedChoice.description}
              </p>
              <ul className="mt-4 space-y-2">
                {selectedChoice.valueProps.map((valueProp) => (
                  <li className={`${proofDescriptionClassName} flex items-start gap-3`} key={valueProp}>
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                    <span>{valueProp}</span>
                  </li>
                ))}
              </ul>
              {selectedChoice.disclaimer ? (
                <p className={`${proofDisclaimerClassName} mt-4`}>
                  {selectedChoice.disclaimer}
                </p>
              ) : null}
            </div>
          </div>
          <div className={formShellClassName}>
            {surface.title ? (
              <div className="space-y-2">
                <h3 className="text-2xl text-white">
                  {surface.title}
                </h3>
                <p className={proofDescriptionClassName}>{surface.formIntro}</p>
                {surface.supportingText ? (
                  <p className={proofDescriptionClassName}>{surface.supportingText}</p>
                ) : null}
              </div>
            ) : null}
            <div className="mt-6 space-y-4">{formFields}</div>
          </div>
        </div>
      </section>
      )}
    </form>
  );
}
