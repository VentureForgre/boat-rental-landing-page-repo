import { act, fireEvent, render, screen } from "@testing-library/react";
import { OfferPopup } from "@/components/landing/offer-popup";

function stubMatchMedia(finePointer = true) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      addEventListener: vi.fn(),
      addListener: vi.fn(),
      dispatchEvent: vi.fn(),
      matches: finePointer && query === "(hover: hover) and (pointer: fine)",
      media: query,
      onchange: null,
      removeEventListener: vi.fn(),
      removeListener: vi.fn(),
    })),
  );
}

function renderOfferPopup() {
  return render(
    <>
      <button type="button">Outside Focus Target</button>
      <OfferPopup />
    </>,
  );
}

function triggerExitIntent() {
  fireEvent(
    document,
    new MouseEvent("mouseout", {
      bubbles: true,
      clientY: 0,
      relatedTarget: null,
    }),
  );
}

async function advance(ms: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
}

describe("OfferPopup", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-05T12:00:00.000Z"));
    localStorage.clear();
    sessionStorage.clear();
    stubMatchMedia();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("opens after the configured delay and restores focus on dismiss", async () => {
    renderOfferPopup();

    const outsideButton = screen.getByRole("button", {
      name: /outside focus target/i,
    });
    outsideButton.focus();

    await advance(5900);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await advance(100);

    const dialog = screen.getByRole("dialog", {
      name: /unlock 30% off your luxe lake charter/i,
    });
    const emailInput = screen.getByRole("textbox", {
      name: /email address/i,
    });

    expect(dialog).toBeInTheDocument();
    expect(emailInput).toHaveFocus();

    fireEvent.click(screen.getByRole("button", { name: /continue browsing/i }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(outsideButton).toHaveFocus();
  });

  it("reopens once on desktop exit intent after a dismissal in the same session", async () => {
    renderOfferPopup();

    await advance(6000);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /continue browsing/i }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    triggerExitIntent();

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /continue browsing/i }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    triggerExitIntent();

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("suppresses new sessions during the dismissal cooldown", async () => {
    const firstRender = renderOfferPopup();

    await advance(6000);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /continue browsing/i }));

    firstRender.unmount();
    sessionStorage.clear();

    renderOfferPopup();

    await advance(6000);

    triggerExitIntent();

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("stores a 30-day suppression window after a successful email submit", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: true,
          message: "You unlocked 30% off. Check your inbox for the Luxe Lake offer details.",
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const firstRender = renderOfferPopup();

    await advance(6000);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox", { name: /email address/i }), {
      target: { value: "popup@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /unlock my 30% off/i }));

    await act(async () => {
      await Promise.resolve();
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, request] = fetchMock.mock.calls[0] as [string, RequestInit];

    expect(url).toBe("/api/waitlist");
    expect(JSON.parse(request.body as string)).toEqual({
      email: "popup@example.com",
      source: "popup",
    });
    expect(screen.getByText(/you unlocked 30% off/i)).toBeInTheDocument();

    firstRender.unmount();
    sessionStorage.clear();

    renderOfferPopup();

    await advance(6000);

    triggerExitIntent();

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("caps popup exposure at two impressions in twenty-four hours", async () => {
    const firstRender = renderOfferPopup();

    await advance(6000);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /continue browsing/i }));
    triggerExitIntent();

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    firstRender.unmount();
    sessionStorage.clear();

    renderOfferPopup();

    await advance(6000);

    triggerExitIntent();

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
