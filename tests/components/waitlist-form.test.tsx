import { fireEvent, render, screen, waitFor } from "@testing-library/react";

describe("WaitlistForm", () => {
  afterEach(() => {
    Reflect.deleteProperty(window.navigator, "clipboard");
    vi.unstubAllGlobals();
  });

  it("renders a compact hero deposit card without the long reservation-brief copy", async () => {
    const { WaitlistForm } = await import("@/components/landing/waitlist-form");

    render(<WaitlistForm source="hero" />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /request a refundable \$25 deposit/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/priority access before the public launch calendar opens/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/100 deposits\. \$2,500\. louder than 1,000 free emails/i),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/referral proof/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/concierge follow-up/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /select your lake/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /ready to book/i }),
    ).toBeInTheDocument();
  });

  it("renders a deposit-only reservation brief with elevated demand-proof copy", async () => {
    const { WaitlistForm } = await import("@/components/landing/waitlist-form");

    render(<WaitlistForm source="footer" />);

    expect(
      screen.queryByRole("radio", { name: /\$25 refundable deposit/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /request a \$25 refundable priority deposit/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/100 deposits\. \$2,500\. louder than 1,000 free emails/i)).toBeInTheDocument();
    expect(screen.getAllByText(/refundable deposit/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/concierge follow-up/i)).toBeInTheDocument();
    expect(screen.getByText(/referral proof/i)).toBeInTheDocument();
    expect(screen.getByText(/launch priority for lake sidney lanier/i)).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: /your email address/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /request deposit priority/i }),
    ).toHaveClass("w-full");
    expect(
      screen.getByRole("combobox", { name: /select your lake/i }),
    ).toHaveDisplayValue(/lake sidney lanier/i);
    expect(
      screen.getAllByText(/concierge confirms the deposit collection after you submit/i).length,
    ).toBeGreaterThan(0);
  });

  it("shows a client-side validation message before posting invalid email", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const { WaitlistForm } = await import("@/components/landing/waitlist-form");

    render(<WaitlistForm source="hero" />);

    expect(document.querySelector('[aria-live="polite"]')).toBeNull();
    expect(
      screen.getByRole("combobox", { name: /select your lake/i }),
    ).toHaveClass("border-[var(--color-background)]/15");
    expect(
      screen.getByRole("textbox", { name: /ready to book/i }),
    ).toHaveClass("border-[var(--color-background)]/15");

    fireEvent.change(screen.getByRole("textbox", { name: /ready to book/i }), {
      target: { value: "not-an-email" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /request deposit priority/i }),
    );

    expect(
      await screen.findByText(/enter a valid email address/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      /please fix the highlighted fields and try again/i,
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("submits the deposit payload, including referral attribution, and shows share UI", async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(window.navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: writeTextMock,
      },
    });

    let resolveFetch: ((value: Response) => void) | undefined;
    const fetchMock = vi.fn(
      () =>
        new Promise<Response>((resolve) => {
          resolveFetch = resolve;
        }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const { WaitlistForm } = await import("@/components/landing/waitlist-form");

    render(<WaitlistForm referralCode="AB12CD34" source="hero" />);

    fireEvent.change(screen.getByRole("textbox", { name: /ready to book/i }), {
      target: { value: "guest@example.com" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /request deposit priority/i }),
    );

    expect(
      screen.getByRole("button", { name: /submitting/i }),
    ).toBeDisabled();

    resolveFetch?.(
      new Response(
        JSON.stringify({
          ok: true,
          message:
            "Your $25 refundable priority request is in. Concierge follow-up comes next to finalize the deposit.",
          conversionType: "deposit",
          referralCode: "ZX98YU76",
          shareUrl: "https://luxelake.com/?ref=ZX98YU76",
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        },
      ),
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/waitlist",
        expect.objectContaining({
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            email: "guest@example.com",
            preferredLake: "lake-sidney-lanier",
            source: "hero",
            conversionType: "deposit",
            referralCode: "AB12CD34",
          }),
        }),
      );
    });

    expect(
      await screen.findByText(/your \$25 refundable priority request is in/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      /your \$25 refundable priority request is in/i,
    );
    expect(screen.getByDisplayValue("https://luxelake.com/?ref=ZX98YU76")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: /keep the priority list moving/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/100 deposits\. \$2,500\. louder than 1,000 free emails/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /copy referral link/i }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /copy referral link/i }));

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith("https://luxelake.com/?ref=ZX98YU76");
    });
  });

  it("keeps the share state usable when clipboard APIs are unavailable", async () => {
    let resolveFetch: ((value: Response) => void) | undefined;
    const fetchMock = vi.fn(
      () =>
        new Promise<Response>((resolve) => {
          resolveFetch = resolve;
        }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const { WaitlistForm } = await import("@/components/landing/waitlist-form");

    render(<WaitlistForm source="footer" />);

    fireEvent.change(screen.getByRole("textbox", { name: /your email address/i }), {
      target: { value: "guest@example.com" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /request deposit priority/i }),
    );

    resolveFetch?.(
      new Response(
        JSON.stringify({
          ok: true,
          message:
            "Your $25 refundable priority request is in. Concierge follow-up comes next to finalize the deposit.",
          conversionType: "deposit",
          referralCode: "AB12CD34",
          shareUrl: "https://luxelake.com/?ref=AB12CD34",
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        },
      ),
    );

    expect(
      await screen.findByDisplayValue("https://luxelake.com/?ref=AB12CD34"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /copy link manually/i }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/referral rate tracks what share of completed deposit requests/i).length,
    ).toBeGreaterThan(0);
  });
});
