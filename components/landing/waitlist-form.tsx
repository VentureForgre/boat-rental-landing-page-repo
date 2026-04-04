"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import {
  landingPageContent,
  type LakeId,
  lakeOptions,
  type LandingConversionType,
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
  const [defaultChoice] = conversionFlow.choices;
  const layoutMode = layout ?? (source === "footer" ? "stacked" : "inline");
  const conversionFieldsetId = useId();
  const choiceIdPrefix = useId();
  const emailId = useId();
  const lakeId = useId();
  const conversionErrorId = useId();
  const emailErrorId = useId();
  const lakeErrorId = useId();
  const [email, setEmail] = useState("");
  const [preferredLake, setPreferredLake] = useState<LakeId>(surface.defaultLakeId);
  const [conversionType, setConversionType] = useState<LandingConversionType>(
    defaultChoice.id,
  );
  const [status, setStatus] = useState<SubmissionState>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [successResponse, setSuccessResponse] = useState<Extract<
    WaitlistResponse,
    { ok: true }
  > | null>(null);
  const [shareStatus, setShareStatus] = useState<ShareStatus>("idle");
  const [fieldErrors, setFieldErrors] = useState<WaitlistFieldErrors>({});
  const shareInputRef = useRef<HTMLInputElement>(null);

  const selectedChoice =
    conversionFlow.choices.find((choice) => choice.id === conversionType) ?? defaultChoice;
  const canCopyReferralLink =
    typeof navigator !== "undefined" &&
    typeof navigator.clipboard?.writeText === "function";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateWaitlistSubmission({
      email,
      preferredLake,
      conversionType,
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
  const conversionDescribedBy = fieldErrors.conversionType ? conversionErrorId : undefined;
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
  const conversionSectionClassName =
    source === "hero"
      ? "space-y-3 border border-[var(--color-background)]/20 bg-white/80 p-4 text-slate-900"
      : "space-y-3 border border-white/15 bg-white/5 p-4 text-white";
  const conversionCardClassName = (choice: LandingConversionType) =>
    choice === conversionType
      ? source === "hero"
        ? "space-y-2 border border-[var(--color-background)] bg-white p-4"
        : "space-y-2 border border-[var(--color-accent)] bg-white/10 p-4"
      : source === "hero"
        ? "space-y-2 border border-slate-200 bg-white/70 p-4"
        : "space-y-2 border border-white/10 bg-transparent p-4";
  const conversionDescriptionClassName =
    source === "hero" ? "text-sm text-slate-600" : "text-sm text-slate-300";
  const conversionValueClassName =
    source === "hero" ? "text-sm text-slate-700" : "text-sm text-slate-200";
  const conversionDisclaimerClassName =
    source === "hero" ? "text-xs text-amber-700" : "text-xs text-amber-300";
  const fieldLayoutClassName =
    layoutMode === "stacked"
      ? "grid gap-4"
      : "grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]";
  const buttonClassName =
    layoutMode === "stacked"
      ? "inline-flex w-full items-center justify-center bg-[var(--color-background)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
      : "inline-flex items-center justify-center bg-[var(--color-background)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70";
  const sharePanelClassName =
    source === "hero"
      ? "space-y-3 border border-emerald-200 bg-emerald-50 p-4 text-slate-900"
      : "space-y-3 border border-emerald-300/30 bg-emerald-500/10 p-4 text-white";
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
      <fieldset
        aria-describedby={conversionDescribedBy}
        className={conversionSectionClassName}
        id={conversionFieldsetId}
      >
        <legend className={labelClassName}>{conversionFlow.selectorLabel}</legend>
        <p className={conversionDescriptionClassName}>
          {conversionFlow.selectorSupportingText}
        </p>
        <div className="grid gap-3">
          {conversionFlow.choices.map((choice, index) => {
            const optionId = `${choiceIdPrefix}-${index}`;

            return (
              <label className={conversionCardClassName(choice.id)} htmlFor={optionId} key={choice.id}>
                <div className="flex items-start gap-3">
                  <input
                    checked={choice.id === conversionType}
                    id={optionId}
                    name="conversionType"
                    onChange={() => setConversionType(choice.id)}
                    type="radio"
                    value={choice.id}
                  />
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">{choice.label}</p>
                      <p className={conversionDescriptionClassName}>{choice.description}</p>
                    </div>
                    {choice.id === conversionType ? (
                      <div className="space-y-2">
                        <ul className="space-y-1">
                          {choice.valueProps.map((valueProp) => (
                            <li className={conversionValueClassName} key={valueProp}>
                              {valueProp}
                            </li>
                          ))}
                        </ul>
                        {choice.disclaimer ? (
                          <p className={conversionDisclaimerClassName}>{choice.disclaimer}</p>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
        {fieldErrors.conversionType ? (
          <p className={fieldErrorClassName} id={conversionErrorId}>
            {fieldErrors.conversionType}
          </p>
        ) : null}
      </fieldset>
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
          {status === "loading" ? "Submitting..." : selectedChoice.submitLabel}
        </button>
      </div>
      {message ? (
        <p className={`${formMessageClassName} text-sm`} role={messageRole}>
          {message}
        </p>
      ) : null}
      {successResponse ? (
        <section className={sharePanelClassName}>
          <div className="space-y-1">
            <h3 className="text-base font-semibold">{selectedChoice.success.title}</h3>
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
    </form>
  );
}
