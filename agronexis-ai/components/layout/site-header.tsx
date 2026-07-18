"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, Menu, X } from "lucide-react";
import { navItems } from "@/lib/data";

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#071A2F]/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3" onClick={closeMenu}>
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-500 text-slate-950 shadow-[0_0_32px_rgba(34,197,94,0.35)]">
            <Activity className="h-5 w-5" />
          </span>
          <span className="truncate text-base font-semibold text-white">AgroNexis AI</span>
        </Link>
        <nav className="hidden items-center gap-5 lg:gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white">
            Sign In
          </Link>
          <Link
            href="/#features"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-100"
          >
            Book demo
          </Link>
        </div>
        <button
          type="button"
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsOpen((open) => !open)}
          className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/8 text-white md:hidden"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      <div
        className={`fixed inset-0 top-16 z-40 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeMenu}
      />
      <div
        id="mobile-navigation"
        className={`absolute inset-x-4 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-xl border border-white/10 bg-[#071A2F]/95 shadow-2xl shadow-slate-950/35 backdrop-blur-xl transition-all duration-300 ease-out md:hidden ${
          isOpen
            ? "pointer-events-auto max-h-[80svh] translate-y-0 opacity-100"
            : "pointer-events-none max-h-0 -translate-y-2 opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-1 p-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className="rounded-lg px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/8 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="grid gap-2 border-t border-white/10 p-2">
          <Link
            href="/login"
            onClick={closeMenu}
            className="rounded-lg px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/8 hover:text-white"
          >
            Sign In
          </Link>
          <Link
            href="/#features"
            onClick={closeMenu}
            className="rounded-lg bg-white px-4 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-emerald-100"
          >
            Book demo
          </Link>
        </div>
      </div>
    </header>
  );
}
