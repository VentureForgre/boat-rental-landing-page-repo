import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders the Luxe Lake Escapes baseline heading", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /luxe lake escapes/i,
      }),
    ).toBeInTheDocument();
  });
});
