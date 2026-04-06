const saveWaitlistEntry = vi.fn();

vi.mock("@/lib/waitlist", () => ({
  saveWaitlistEntry,
}));

describe("POST /api/waitlist", () => {
  beforeEach(() => {
    saveWaitlistEntry.mockReset();
  });

  it("returns a success response for valid inline offer submissions", async () => {
    saveWaitlistEntry.mockResolvedValue({
      id: "entry-2",
      email: "guest@example.com",
      preferredLake: "allatoona-lake",
      source: "footer",
      conversionType: "deposit",
      referralCode: "ZX98YU76",
      referredByCode: "AB12CD34",
      isReferral: true,
      depositAmountCents: 20000,
      depositStatus: "pending",
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
          preferredLake: "allatoona-lake",
          source: "footer",
          conversionType: "deposit",
          referralCode: "ab12cd34",
        }),
      }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      ok: true,
      message: expect.stringMatching(/\$200|share link|concierge/i),
      conversionType: "deposit",
      referralCode: "ZX98YU76",
      shareUrl: "http://localhost/?ref=ZX98YU76",
    });
    expect(saveWaitlistEntry).toHaveBeenCalledWith({
      email: "guest@example.com",
      preferredLake: "allatoona-lake",
      source: "footer",
      conversionType: "deposit",
      referralCode: "AB12CD34",
    });
  });

  it("returns popup success copy for popup leads without a lake", async () => {
    saveWaitlistEntry.mockResolvedValue({
      id: "entry-popup",
      email: "popup@example.com",
      source: "popup",
      referralCode: "ZX98YU76",
      isReferral: false,
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

  it("returns validation errors for malformed payloads", async () => {
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
          conversionType: "waitlist",
          referralCode: "bad-ref",
        }),
      }),
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      ok: false,
      fieldErrors: {
        email: expect.any(String),
        preferredLake: expect.any(String),
        conversionType: expect.any(String),
        referralCode: expect.any(String),
      },
    });
    expect(saveWaitlistEntry).not.toHaveBeenCalled();
  });
});
