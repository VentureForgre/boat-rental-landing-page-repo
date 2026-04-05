import type { ComponentPropsWithoutRef } from "react";
import { act, render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

vi.mock("next/image", () => ({
  default: (props: ComponentPropsWithoutRef<"img"> & { priority?: boolean }) => {
    const { alt = "", priority, ...rest } = props;
    void priority;

    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} {...rest} />;
  },
}));

function stubMatchMedia() {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      addEventListener: vi.fn(),
      addListener: vi.fn(),
      dispatchEvent: vi.fn(),
      matches: query === "(hover: hover) and (pointer: fine)",
      media: query,
      onchange: null,
      removeEventListener: vi.fn(),
      removeListener: vi.fn(),
    })),
  );
}

async function advance(ms: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
}

describe("HomePage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    stubMatchMedia();
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("renders the hero headline for the landing page", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /reserve today \$200 for any 2 days/i,
      }),
    ).toBeInTheDocument();
  });

  it("mounts the offer popup at page scope and opens it after the configured delay", async () => {
    render(<HomePage />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await advance(6000);

    expect(
      screen.getByRole("dialog", {
        name: /unlock 30% off your luxe lake charter/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /reserve today \$200 for any 2 days/i,
      }),
    ).toBeInTheDocument();
  });
});
