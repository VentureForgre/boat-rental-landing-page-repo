import { fireEvent, render, screen, waitFor } from "@testing-library/react";

describe("WaitlistForm", () => {
  afterEach(() => {
    Reflect.deleteProperty(window.navigator, "clipboard");
    vi.unstubAllGlobals();
  });

  it("renders the compact hero offer card with the updated $200 messaging", async () => {
    const { WaitlistForm } = await import("@/components/landing/waitlist-form");

    render(<WaitlistForm source="hero" />);

    const heroSection = screen
      .getByRole("heading", {
        level: 2,
        name: /reserve today with \$200 for any 2 days/i,
      })
      .closest("section");
    const heroButton = screen.getByRole("button", {
      name: /claim offer/i,
    });

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /reserve today with \$200 for any 2 days/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/claim the \$200 today for any 2 days offer now/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /ready to reserve/i }),
    ).toBeInTheDocument();
    expect(heroSection?.className).not.toContain("rounded");
    expect(heroButton.className).not.toContain("rounded");
  });

  it("renders the footer offer copy and supported lake options", async () => {
    const { WaitlistForm } = await import("@/components/landing/waitlist-form");

    render(<WaitlistForm source="footer" />);

    const footerButton = screen.getByRole("button", {
      name: /send offer details/i,
    });
    const footerLakeField = screen.getByRole("combobox", {
      name: /select your lake/i,
    });

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /get the \$200 offer/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/today's \$200 for any 2 days offer/i),
    ).toBeInTheDocument();
    expect(footerButton).toHaveClass("bg-[var(--color-background)]");
    expect(footerLakeField).toHaveDisplayValue(/lake sidney lanier/i);
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
      screen.getByRole("textbox", { name: /ready to reserve/i }),
    ).toHaveClass("border-[var(--color-background)]/15");

    fireEvent.change(screen.getByRole("textbox", { name: /ready to reserve/i }), {
      target: { value: "not-an-email" },
    });
    fireEvent.click(screen.getByRole("button", { name: /claim offer/i }));

    expect(
      await screen.findByText(/enter a valid email address/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      /please fix the highlighted fields and try again/i,
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("submits the offer payload, including referral attribution, and shows share UI", async () => {
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

    fireEvent.change(screen.getByRole("textbox", { name: /ready to reserve/i }), {
      target: { value: "guest@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /claim offer/i }));

    expect(
      screen.getByRole("button", { name: /submitting/i }),
    ).toBeDisabled();

    resolveFetch?.(
      new Response(
        JSON.stringify({
          ok: true,
          message:
            "Your $200 for any 2 days request is in. Watch your inbox for concierge follow-up and your share link.",
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
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    const [url, request] = fetchMock.mock.calls[0] as [string, RequestInit];

    expect(url).toBe("/api/waitlist");
    expect(request).toEqual(
      expect.objectContaining({
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
      }),
    );
    expect(JSON.parse(request.body as string)).toEqual({
      email: "guest@example.com",
      source: "hero",
      preferredLake: "lake-sidney-lanier",
      conversionType: "deposit",
      referralCode: "AB12CD34",
    });

    expect(
      await screen.findByText(/your \$200 for any 2 days request is in/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      /your \$200 for any 2 days request is in/i,
    );
    expect(screen.getByDisplayValue("https://luxelake.com/?ref=ZX98YU76")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: /keep the charter calendar moving/i }),
    ).toBeInTheDocument();
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
      screen.getByRole("button", { name: /send offer details/i }),
    );

    resolveFetch?.(
      new Response(
        JSON.stringify({
          ok: true,
          message:
            "Your $200 for any 2 days request is in. Watch your inbox for concierge follow-up and your share link.",
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
      screen.getByText(/referral rate tracks what share of completed offer requests/i),
    ).toBeInTheDocument();
  });

  it("surfaces server-side field errors without regressing the inline hero form", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: false,
          message: "Please fix the highlighted fields and try again.",
          fieldErrors: {
            preferredLake: "Select one of the supported launch lakes.",
          },
        }),
        {
          status: 400,
          headers: {
            "content-type": "application/json",
          },
        },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const { WaitlistForm } = await import("@/components/landing/waitlist-form");

    render(<WaitlistForm source="hero" />);

    fireEvent.change(screen.getByRole("textbox", { name: /ready to reserve/i }), {
      target: { value: "guest@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /claim offer/i }));

    expect(
      await screen.findByText(/select one of the supported launch lakes/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      /please fix the highlighted fields and try again/i,
    );
    const [url, request] = fetchMock.mock.calls[0] as [string, RequestInit];

    expect(url).toBe("/api/waitlist");
    expect(JSON.parse(request.body as string)).toEqual({
      email: "guest@example.com",
      preferredLake: "lake-sidney-lanier",
      source: "hero",
      conversionType: "deposit",
    });
  });
});
