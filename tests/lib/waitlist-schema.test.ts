describe("validateWaitlistSubmission", () => {
  it("accepts deposit submissions and normalizes the referral code", async () => {
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
    expect(conversionTypeOptions).toEqual(["waitlist", "deposit"]);
    expect(waitlistSourceOptions).toEqual(["hero", "footer"]);
  });

  it("rejects unsupported conversion types and malformed referral codes", async () => {
    const { validateWaitlistSubmission } = await import(
      "@/lib/waitlist-schema"
    );

    const result = validateWaitlistSubmission({
      email: "captain-at-luxelake.com",
      preferredLake: "lake-oconee",
      source: "sidebar",
      conversionType: "vip",
      referralCode: "bad-ref",
    });

    expect(result).toMatchObject({
      ok: false,
      message: expect.stringMatching(/fix/i),
      fieldErrors: {
        email: expect.stringMatching(/valid email/i),
        preferredLake: expect.stringMatching(/select/i),
        source: expect.stringMatching(/hero|footer/i),
        conversionType: expect.stringMatching(/waitlist|deposit/i),
        referralCode: expect.stringMatching(/referral code/i),
      },
    });
  });
});
