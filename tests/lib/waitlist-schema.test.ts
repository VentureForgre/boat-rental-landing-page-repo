describe("validateWaitlistSubmission", () => {
  it("accepts inline offer submissions and normalizes the referral code", async () => {
    const {
      conversionTypeOptions,
      validateWaitlistSubmission,
      waitlistSourceOptions,
    } = await import("@/lib/waitlist-schema");

    const result = validateWaitlistSubmission({
      email: "  guest@example.com  ",
      preferredLake: "lake-sidney-lanier",
      source: "hero",
      conversionType: "deposit",
      referralCode: " ab12cd34 ",
    });

    expect(result).toEqual({
      ok: true,
      data: {
        email: "guest@example.com",
        preferredLake: "lake-sidney-lanier",
        source: "hero",
        conversionType: "deposit",
        referralCode: "AB12CD34",
      },
    });
    expect(conversionTypeOptions).toEqual(["deposit"]);
    expect(waitlistSourceOptions).toEqual(["hero", "footer", "popup"]);
  });

  it("accepts popup submissions without a lake selection or conversion type", async () => {
    const { validateWaitlistSubmission } = await import(
      "@/lib/waitlist-schema"
    );

    const result = validateWaitlistSubmission({
      email: "  popup@example.com  ",
      source: "popup",
    });

    expect(result).toEqual({
      ok: true,
      data: {
        email: "popup@example.com",
        source: "popup",
      },
    });
  });

  it("requires hero and footer submissions to include a supported lake and the offer type", async () => {
    const { validateWaitlistSubmission } = await import(
      "@/lib/waitlist-schema"
    );

    const result = validateWaitlistSubmission({
      email: "guest@example.com",
      source: "footer",
    });

    expect(result).toMatchObject({
      ok: false,
      message: expect.stringMatching(/fix/i),
      fieldErrors: {
        preferredLake: expect.stringMatching(/select/i),
        conversionType: expect.stringMatching(/\$200 deposit offer/i),
      },
    });
  });

  it("rejects invalid sources, malformed emails, bad lakes, and malformed referral codes", async () => {
    const { validateWaitlistSubmission } = await import(
      "@/lib/waitlist-schema"
    );

    const result = validateWaitlistSubmission({
      email: "captain-at-luxelake.com",
      preferredLake: "lake-oconee",
      source: "sidebar",
      conversionType: "waitlist",
      referralCode: "bad-ref",
    });

    expect(result).toMatchObject({
      ok: false,
      message: expect.stringMatching(/fix/i),
      fieldErrors: {
        email: expect.stringMatching(/valid email/i),
        preferredLake: expect.stringMatching(/select/i),
        source: expect.stringMatching(/hero|footer|popup/i),
        conversionType: expect.stringMatching(/\$200 deposit offer/i),
        referralCode: expect.stringMatching(/referral code/i),
      },
    });
  });
});
