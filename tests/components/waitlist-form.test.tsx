import { fireEvent, render, screen, waitFor } from "@testing-library/react";

describe("WaitlistForm", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the footer offer copy and supported lake options", async () => {
    const { WaitlistForm } = await import("@/components/landing/waitlist-form");

    render(<WaitlistForm source="footer" />);

    const submitButton = screen.getByRole("button", { name: /send offer details/i });

    expect(
      screen.getByRole("textbox", { name: /your email address/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /get the \$200 offer/i })).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveClass("w-full");
    expect(
      screen.getByRole("combobox", { name: /select your lake/i }),
    ).toHaveDisplayValue(/lake sidney lanier/i);
    expect(
      screen.getByText(/\$200 today for any 2 days offer details/i),
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
      screen.getByRole("textbox", { name: /ready to reserve/i }),
    ).toHaveClass("border-[var(--color-background)]");

    fireEvent.change(screen.getByRole("textbox", { name: /ready to reserve/i }), {
      target: { value: "not-an-email" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /claim offer/i }),
    );

    expect(
      await screen.findByText(/enter a valid email address/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      /please fix the highlighted fields and try again/i,
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("submits a valid payload and shows the success message", async () => {
    let resolveFetch: ((value: Response) => void) | undefined;
    const fetchMock = vi.fn(
      () =>
        new Promise<Response>((resolve) => {
          resolveFetch = resolve;
        }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const { WaitlistForm } = await import("@/components/landing/waitlist-form");

    render(<WaitlistForm source="hero" />);

    fireEvent.change(screen.getByRole("textbox", { name: /ready to reserve/i }), {
      target: { value: "guest@example.com" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /claim offer/i }),
    );

    expect(
      screen.getByRole("button", { name: /submitting/i }),
    ).toBeDisabled();

    resolveFetch?.(
      new Response(
        JSON.stringify({
          ok: true,
          message: "Check your inbox for the Luxe Lake offer details.",
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
      preferredLake: "lake-sidney-lanier",
      source: "hero",
    });

    expect(
      await screen.findByText(/check your inbox for the luxe lake offer details/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      /check your inbox for the luxe lake offer details/i,
    );
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
    fireEvent.click(
      screen.getByRole("button", { name: /claim offer/i }),
    );

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
    });
  });
});
