import type { ComponentPropsWithoutRef } from "react";
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

vi.mock("next/image", () => ({
  default: (props: ComponentPropsWithoutRef<"img"> & { priority?: boolean }) => {
    const { alt = "", priority, ...rest } = props;
    void priority;

    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} {...rest} />;
  },
}));

describe("HomePage", () => {
  it("renders the hero headline for the landing page", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /the art of inland sailing/i,
      }),
    ).toBeInTheDocument();
  });
});
