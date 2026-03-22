import { fireEvent, render, screen, waitFor } from "@testing-library/react";

describe("WaitlistForm", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the footer waitlist copy and supported lake options", async () => {
    const { WaitlistForm } = await import("@/components/landing/waitlist-form");

    render(<WaitlistForm source="footer" />);

    expect(
      screen.getByRole("textbox", { name: /your email address/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /submit/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /select your lake/i }),
    ).toHaveDisplayValue(/lake sidney lanier/i);
    expect(screen.getByText(/stay updated on launch dates/i)).toBeInTheDocument();
  });

  it("shows a client-side validation message before posting invalid email", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const { WaitlistForm } = await import("@/components/landing/waitlist-form");

    render(<WaitlistForm source="hero" />);

    fireEvent.change(screen.getByRole("textbox", { name: /ready to book/i }), {
      target: { value: "not-an-email" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /join the waitlist/i }),
    );

    expect(
      await screen.findByText(/enter a valid email address/i),
    ).toBeInTheDocument();
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

    fireEvent.change(screen.getByRole("textbox", { name: /ready to book/i }), {
      target: { value: "guest@example.com" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /join the waitlist/i }),
    );

    expect(
      screen.getByRole("button", { name: /submitting/i }),
    ).toBeDisabled();

    resolveFetch?.(
      new Response(
        JSON.stringify({
          ok: true,
          message: "You are on the Luxe Lake waitlist.",
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
          }),
        }),
      );
    });

    expect(
      await screen.findByText(/you are on the luxe lake waitlist/i),
    ).toBeInTheDocument();
  });
});
