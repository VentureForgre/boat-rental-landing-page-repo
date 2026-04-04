import { fireEvent, render, screen, waitFor } from "@testing-library/react";

describe("WaitlistForm", () => {
  afterEach(() => {
    Reflect.deleteProperty(window.navigator, "clipboard");
    vi.unstubAllGlobals();
  });

  it("renders both conversion choices and updates the CTA for the selected path", async () => {
    const { WaitlistForm } = await import("@/components/landing/waitlist-form");

    render(<WaitlistForm source="footer" />);

    expect(
      screen.getByRole("radio", { name: /free waitlist/i }),
    ).toBeChecked();
    expect(
      screen.getByRole("radio", { name: /\$25 refundable deposit/i }),
    ).not.toBeChecked();
    expect(screen.getByText(/show demand/i)).toBeInTheDocument();
    expect(
      screen.getByText(/free signup stays frictionless/i),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: /your email address/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /join the free waitlist/i })).toHaveClass(
      "w-full",
    );
    expect(
      screen.getByRole("combobox", { name: /select your lake/i }),
    ).toHaveDisplayValue(/lake sidney lanier/i);
    expect(screen.getByText(/stay updated on launch dates/i)).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("radio", { name: /\$25 refundable deposit/i }),
    );

    expect(
      screen.getByRole("button", { name: /request deposit priority/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/payment has already been collected/i),
    ).toBeInTheDocument();
  });

  it("shows a client-side validation message before posting invalid email", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const { WaitlistForm } = await import("@/components/landing/waitlist-form");

    render(<WaitlistForm source="hero" />);

    expect(document.querySelector('[aria-live="polite"]')).toBeNull();
    expect(
      screen.getByRole("combobox", { name: /select your lake/i }),
    ).toHaveClass("border-[var(--color-background)]");
    expect(
      screen.getByRole("textbox", { name: /ready to book/i }),
    ).toHaveClass("border-[var(--color-background)]");

    fireEvent.change(screen.getByRole("textbox", { name: /ready to book/i }), {
      target: { value: "not-an-email" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /join the free waitlist/i }),
    );

    expect(
      await screen.findByText(/enter a valid email address/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      /please fix the highlighted fields and try again/i,
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("submits the selected deposit payload, including referral attribution, and shows share UI", async () => {
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

    fireEvent.click(
      screen.getByRole("radio", { name: /\$25 refundable deposit/i }),
    );

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
          message: "Your refundable deposit request has been recorded.",
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
      await screen.findByText(/your refundable deposit request has been recorded/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      /your refundable deposit request has been recorded/i,
    );
    expect(screen.getByDisplayValue("https://luxelake.com/?ref=ZX98YU76")).toBeInTheDocument();
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
      screen.getByRole("button", { name: /join the free waitlist/i }),
    );

    resolveFetch?.(
      new Response(
        JSON.stringify({
          ok: true,
          message: "You are on the Luxe Lake waitlist.",
          conversionType: "waitlist",
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
    expect(screen.getByText(/friends who arrive from the link/i)).toBeInTheDocument();
  });
});
