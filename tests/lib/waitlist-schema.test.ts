describe("validateWaitlistSubmission", () => {
  it("accepts a supported lake and trims the email address", async () => {
    const { validateWaitlistSubmission, waitlistSourceOptions } = await import(
      "@/lib/waitlist-schema"
    );

    const result = validateWaitlistSubmission({
      email: "  guest@example.com  ",
      preferredLake: "lake-sidney-lanier",
      source: "hero",
    });

    expect(result).toEqual({
      ok: true,
      data: {
        email: "guest@example.com",
        preferredLake: "lake-sidney-lanier",
        source: "hero",
      },
    });
    expect(waitlistSourceOptions).toEqual(["hero", "footer"]);
  });

  it("rejects unsupported lakes and invalid email addresses", async () => {
    const { validateWaitlistSubmission } = await import(
      "@/lib/waitlist-schema"
    );

    const result = validateWaitlistSubmission({
      email: "captain-at-luxelake.com",
      preferredLake: "lake-oconee",
      source: "sidebar",
    });

    expect(result).toMatchObject({
      ok: false,
      message: expect.stringMatching(/fix/i),
      fieldErrors: {
        email: expect.stringMatching(/valid email/i),
        preferredLake: expect.stringMatching(/select/i),
        source: expect.stringMatching(/hero|footer/i),
      },
    });
  });
});
