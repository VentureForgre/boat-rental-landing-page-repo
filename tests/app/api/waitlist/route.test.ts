const saveWaitlistEntry = vi.fn();

vi.mock("@/lib/waitlist", () => ({
  saveWaitlistEntry,
}));

describe("POST /api/waitlist", () => {
  beforeEach(() => {
    saveWaitlistEntry.mockReset();
  });

  it("returns a success response for valid waitlist submissions", async () => {
    saveWaitlistEntry.mockResolvedValue({
      submittedAt: "2025-01-01T00:00:00.000Z",
    });

    const { POST } = await import("@/app/api/waitlist/route");

    const response = await POST(
      new Request("http://localhost/api/waitlist", {
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

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      ok: true,
      message: expect.stringMatching(/waitlist/i),
    });
    expect(saveWaitlistEntry).toHaveBeenCalledWith({
      email: "guest@example.com",
      preferredLake: "lake-sidney-lanier",
      source: "hero",
    });
  });

  it("returns popup success copy for popup leads without a lake", async () => {
    saveWaitlistEntry.mockResolvedValue({
      submittedAt: "2025-01-01T00:00:00.000Z",
    });

    const { POST } = await import("@/app/api/waitlist/route");

    const response = await POST(
      new Request("http://localhost/api/waitlist", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: "popup@example.com",
          source: "popup",
        }),
      }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      ok: true,
      message: expect.stringMatching(/30%\s*off|unlock/i),
    });
    expect(saveWaitlistEntry).toHaveBeenCalledWith({
      email: "popup@example.com",
      source: "popup",
    });
  });

  it("returns validation errors and skips persistence for invalid payloads", async () => {
    const { POST } = await import("@/app/api/waitlist/route");

    const response = await POST(
      new Request("http://localhost/api/waitlist", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: "bad-email",
          preferredLake: "unknown-lake",
          source: "hero",
        }),
      }),
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      ok: false,
      fieldErrors: {
        email: expect.any(String),
        preferredLake: expect.any(String),
      },
    });
    expect(saveWaitlistEntry).not.toHaveBeenCalled();
  });
});
