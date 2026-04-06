"use client";

import {
  useEffect,
  useEffectEvent,
  useId,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { offerPopupContent } from "@/content/landing-page";
import {
  validateWaitlistSubmission,
  type WaitlistFieldErrors,
  type WaitlistResponse,
} from "@/lib/waitlist-schema";

type PopupTrigger = "delay" | "exit-intent";
type SubmissionState = "idle" | "loading" | "success" | "error";

type PopupStorageState = {
  dismissUntil: number | null;
  impressionTimestamps: number[];
  submittedUntil: number | null;
};

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const HOUR_IN_MS = 60 * 60 * 1000;
const storageKeys = {
  dismissUntil: "luxe-lake-offer-popup-dismiss-until",
  impressions: "luxe-lake-offer-popup-impressions",
  submittedUntil: "luxe-lake-offer-popup-submitted-until",
} as const;
const sessionKeys = {
  delayedShown: "luxe-lake-offer-popup-delayed-shown",
  dismissedThisSession: "luxe-lake-offer-popup-dismissed-this-session",
  exitIntentShown: "luxe-lake-offer-popup-exit-intent-shown",
} as const;

function isHTMLElement(value: Element | null): value is HTMLElement {
  return value instanceof HTMLElement;
}

function readTimestamp(storage: Storage, key: string) {
  const value = storage.getItem(key);

  if (!value) {
    return null;
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function readImpressions(storage: Storage, now: number) {
  const rawValue = storage.getItem(storageKeys.impressions);

  if (!rawValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(rawValue) as unknown;

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter(
      (value): value is number =>
        typeof value === "number" && Number.isFinite(value) && now - value < DAY_IN_MS,
    );
  } catch {
    return [];
  }
}

function readPopupStorageState(now: number): PopupStorageState {
  return {
    dismissUntil: readTimestamp(localStorage, storageKeys.dismissUntil),
    impressionTimestamps: readImpressions(localStorage, now),
    submittedUntil: readTimestamp(localStorage, storageKeys.submittedUntil),
  };
}

function writeImpressions(impressionTimestamps: number[]) {
  localStorage.setItem(storageKeys.impressions, JSON.stringify(impressionTimestamps));
}

function supportsDesktopExitIntent() {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}

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

export function OfferPopup() {
  const headingId = useId();
  const bodyId = useId();
  const emailErrorId = useId();
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const isOpenRef = useRef(false);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubmissionState>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<WaitlistFieldErrors>({});

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  function canOpenPopup(trigger: PopupTrigger) {
    const now = Date.now();
    const storageState = readPopupStorageState(now);
    const delayedShown = sessionStorage.getItem(sessionKeys.delayedShown) === "true";
    const exitIntentShown = sessionStorage.getItem(sessionKeys.exitIntentShown) === "true";
    const dismissedThisSession =
      sessionStorage.getItem(sessionKeys.dismissedThisSession) === "true";

    if (storageState.submittedUntil && storageState.submittedUntil > now) {
      return false;
    }

    if (
      storageState.impressionTimestamps.length >= offerPopupContent.triggers.maxDailyImpressions
    ) {
      return false;
    }

    if (trigger === "delay") {
      return !delayedShown && !(storageState.dismissUntil && storageState.dismissUntil > now);
    }

    return (
      !exitIntentShown &&
      supportsDesktopExitIntent() &&
      (!(storageState.dismissUntil && storageState.dismissUntil > now) || dismissedThisSession)
    );
  }

  function recordImpression(trigger: PopupTrigger) {
    const now = Date.now();
    const impressionTimestamps = readImpressions(localStorage, now);

    writeImpressions([...impressionTimestamps, now]);

    if (trigger === "delay") {
      sessionStorage.setItem(sessionKeys.delayedShown, "true");
      return;
    }

    sessionStorage.setItem(sessionKeys.exitIntentShown, "true");
  }

  const openPopup = useEffectEvent((trigger: PopupTrigger) => {
    if (isOpenRef.current || !canOpenPopup(trigger)) {
      return;
    }

    restoreFocusRef.current = isHTMLElement(document.activeElement)
      ? document.activeElement
      : null;
    recordImpression(trigger);
    setIsOpen(true);
  });

  function closePopup(reason: "dismiss" | "submitted") {
    setIsOpen(false);

    if (reason === "dismiss") {
      const dismissUntil =
        Date.now() + offerPopupContent.triggers.dismissCooldownHours * HOUR_IN_MS;

      localStorage.setItem(storageKeys.dismissUntil, String(dismissUntil));
      sessionStorage.setItem(sessionKeys.dismissedThisSession, "true");
    }

    restoreFocusRef.current?.focus();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateWaitlistSubmission({
      email,
      source: "popup",
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
        setFieldErrors(!payload.ok ? payload.fieldErrors ?? {} : {});
        setMessage(payload.message);
        return;
      }

      localStorage.setItem(
        storageKeys.submittedUntil,
        String(
          Date.now() + offerPopupContent.triggers.submittedSuppressionDays * DAY_IN_MS,
        ),
      );
      setStatus("success");
      setMessage(payload.message);
      setEmail("");
      sessionStorage.removeItem(sessionKeys.dismissedThisSession);
    } catch {
      setStatus("error");
      setMessage("We could not process your request. Please try again.");
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      openPopup("delay");
    }, offerPopupContent.triggers.delaySeconds * 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!supportsDesktopExitIntent()) {
      return;
    }

    function handleMouseOut(event: MouseEvent) {
      if (event.relatedTarget || event.clientY > 8) {
        return;
      }

      openPopup("exit-intent");
    }

    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    emailInputRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closePopup("dismiss");
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const emailDescribedBy = fieldErrors.email ? emailErrorId : undefined;
  const messageRole =
    status === "success" ? "status" : status === "error" && message ? "alert" : undefined;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(10,18,30,0.72)] px-4 py-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          closePopup("dismiss");
        }
      }}
    >
      <div
        aria-describedby={bodyId}
        aria-labelledby={headingId}
        aria-modal="true"
        className="luxury-panel topo-pattern relative w-full max-w-xl overflow-hidden border border-white/10 p-6 text-left shadow-[0_28px_100px_rgba(0,0,0,0.5)] sm:p-8"
        role="dialog"
      >
        <button
          aria-label="Close popup"
          className="focus-ring absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg text-slate-200 transition hover:border-[var(--color-accent)] hover:text-white"
          onClick={() => closePopup("dismiss")}
          type="button"
        >
          <span aria-hidden="true">Ã—</span>
        </button>
        <div className="space-y-6 pr-10">
          <div className="space-y-3">
            <p className="eyebrow">{offerPopupContent.ctaLabel}</p>
            <h2 className="text-3xl text-white sm:text-4xl" id={headingId}>
              {offerPopupContent.headline}
            </h2>
            <p className="max-w-lg text-sm leading-7 text-slate-300" id={bodyId}>
              {offerPopupContent.body}
            </p>
          </div>

          {status === "success" ? (
            <div className="space-y-4 border border-[rgba(193,164,126,0.22)] bg-white/5 p-5">
              <p className="eyebrow">Offer Reserved</p>
              <p className="text-base leading-7 text-white" role="status">
                {message ?? offerPopupContent.successMessage}
              </p>
              <button
                className="focus-ring inline-flex items-center justify-center border border-white/15 px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                onClick={() => closePopup("submitted")}
                type="button"
              >
                {offerPopupContent.dismissLabel}
              </button>
            </div>
          ) : (
            <form className="space-y-4" noValidate onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label
                  className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-200"
                  htmlFor="offer-popup-email"
                >
                  {offerPopupContent.emailLabel}
                </label>
                <input
                  aria-describedby={emailDescribedBy}
                  aria-invalid={fieldErrors.email ? true : undefined}
                  autoComplete="email"
                  className="focus-ring w-full border border-white/15 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--color-accent)]"
                  id="offer-popup-email"
                  name="email"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={offerPopupContent.emailPlaceholder}
                  ref={emailInputRef}
                  type="email"
                  value={email}
                />
                {fieldErrors.email ? (
                  <p className="text-sm text-amber-300" id={emailErrorId}>
                    {fieldErrors.email}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  className="focus-ring inline-flex min-h-12 flex-1 items-center justify-center bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-background)] transition hover:bg-[var(--color-accent)] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={status === "loading"}
                  type="submit"
                >
                  {status === "loading"
                    ? "Submitting..."
                    : offerPopupContent.submitLabel}
                </button>
                <button
                  className="focus-ring inline-flex min-h-12 items-center justify-center border border-white/15 px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                  onClick={() => closePopup("dismiss")}
                  type="button"
                >
                  {offerPopupContent.dismissLabel}
                </button>
              </div>
              {message ? (
                <p className="text-sm text-amber-300" role={messageRole}>
                  {message}
                </p>
              ) : null}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
