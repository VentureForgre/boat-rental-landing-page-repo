"use client";

import { useEffect, useId, useState } from "react";
import { navigationItems, landingPageContent } from "@/content/landing-page";
import { SailingIcon, SearchIcon } from "@/components/landing/icons";

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <nav
      aria-label="Primary"
      className="absolute inset-x-0 top-0 z-20 px-4 py-4 sm:px-6 sm:py-6 lg:px-16 lg:py-8"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6">
        <a className="focus-ring flex items-center gap-3" href="#experience">
          <SailingIcon
            aria-hidden="true"
            className="h-8 w-8 text-[var(--color-accent)]"
          />
          <span className="text-xl font-bold uppercase tracking-[0.3em] text-white">
            {landingPageContent.brand.name}
          </span>
        </a>
        <div className="hidden items-center gap-10 text-xs font-semibold uppercase tracking-[0.28em] text-white/80 md:flex">
          {navigationItems.map((item) => (
            <a
              className="focus-ring transition hover:text-[var(--color-accent)]"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            aria-controls={menuId}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="focus-ring inline-flex items-center justify-center border border-white/15 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.24em] text-white transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] md:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
            type="button"
          >
            Menu
          </button>
          <button
            aria-label="Search"
            className="focus-ring hidden text-white transition hover:text-[var(--color-accent)] md:inline-flex"
            type="button"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
          <a
            className="focus-ring inline-flex items-center justify-center bg-white px-5 py-3 text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--color-background)] transition hover:bg-[var(--color-accent)] hover:text-white sm:px-8"
            href={landingPageContent.hero.primaryAction.href}
          >
            {landingPageContent.hero.primaryAction.label}
          </a>
        </div>
      </div>
      {isMenuOpen ? (
        <div
          aria-label="Mobile navigation"
          className="luxury-panel mt-4 rounded-sm p-5 md:hidden"
          id={menuId}
          role="dialog"
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
              Navigate
            </p>
            <button
              aria-label="Close navigation menu"
              className="focus-ring text-xs font-semibold uppercase tracking-[0.24em] text-white transition hover:text-[var(--color-accent)]"
              onClick={closeMenu}
              type="button"
            >
              Close
            </button>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {navigationItems.map((item) => (
              <a
                className="focus-ring block border-b border-luxury py-3 text-sm font-semibold uppercase tracking-[0.24em] text-white transition hover:text-[var(--color-accent)]"
                href={item.href}
                key={item.href}
                onClick={closeMenu}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </nav>
  );
}
