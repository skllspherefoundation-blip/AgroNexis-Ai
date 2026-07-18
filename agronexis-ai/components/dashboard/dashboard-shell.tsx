"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  Bell,
  ChevronDown,
  Languages,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  X,
  UserRound,
} from "lucide-react";
import { dashboardNav, notifications as notificationItems, searchSuggestions } from "@/lib/dashboard-data";
import { clearAuthSession, getAuthSession, type AuthSession } from "@/lib/auth";
import { cn } from "@/lib/utils";

type DashboardShellProps = {
  children: React.ReactNode;
  activeLabel?: string;
};

type OpenMenu = "search" | "language" | "notifications" | "profile" | null;

const languages = [
  { label: "English", code: "EN" },
  { label: "French", code: "FR" },
  { label: "Spanish", code: "ES" },
  { label: "Portuguese", code: "PT" },
  { label: "Arabic", code: "AR" },
];

export function DashboardShell({ children, activeLabel = "Dashboard" }: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const shellRef = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [language, setLanguage] = useState(() => {
    if (typeof window === "undefined") return languages[0];
    const savedCode = window.localStorage.getItem("agronexis_language");
    return languages.find((item) => item.code === savedCode) ?? languages[0];
  });
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    return window.localStorage.getItem("agronexis_theme") === "light" ? "light" : "dark";
  });
  const [readNotifications, setReadNotifications] = useState<string[]>([]);

  const filteredSuggestions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return searchSuggestions;
    return searchSuggestions.filter((item) => item.label.toLowerCase().includes(query));
  }, [searchTerm]);

  const unreadCount = notificationItems.filter((item) => !readNotifications.includes(item)).length;

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const currentSession = getAuthSession();
      if (!currentSession) {
        router.replace("/login");
        return;
      }

      setSession(currentSession);
      setAuthChecked(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [router]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setOpenMenu(null);
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest("[data-dashboard-menu]")) {
        return;
      }

      setOpenMenu(null);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [mobileOpen]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.body.classList.toggle("agronexis-light", theme === "light");
    window.localStorage.setItem("agronexis_theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleSettingsTheme = (event: Event) => {
      const nextTheme = (event as CustomEvent<"dark" | "light">).detail;
      if (nextTheme === "dark" || nextTheme === "light") {
        setTheme(nextTheme);
      }
    };

    window.addEventListener("agronexis-theme-change", handleSettingsTheme);
    return () => window.removeEventListener("agronexis-theme-change", handleSettingsTheme);
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    router.replace("/login");
  };

  const closeMenus = () => setOpenMenu(null);

  const toggleMenu = (menu: Exclude<OpenMenu, null>) => {
    setOpenMenu((current) => (current === menu ? null : menu));
  };

  const handleSearchSubmit = () => {
    const query = searchTerm.trim();
    if (!query) return;
    closeMenus();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const selectLanguage = (nextLanguage: (typeof languages)[number]) => {
    setLanguage(nextLanguage);
    window.localStorage.setItem("agronexis_language", nextLanguage.code);
    closeMenus();
  };

  const markNotificationRead = (item: string) => {
    setReadNotifications((current) => (current.includes(item) ? current : [...current, item]));
  };

  if (!authChecked) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#071A2F] px-4 text-center text-slate-300">
        <div>
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-emerald-500 text-slate-950 shadow-[0_0_36px_rgba(34,197,94,0.35)]">
            <Activity className="h-6 w-6" />
          </span>
          <p className="mt-4 text-sm font-medium">Checking secure workspace access...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={shellRef}
      className={cn(
        "min-h-screen text-slate-100 transition-colors duration-300",
        theme === "dark" ? "bg-[#071A2F]" : "bg-slate-100 text-slate-900",
      )}
    >
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(34,197,94,0.16),transparent_30%),radial-gradient(circle_at_85%_8%,rgba(14,165,233,0.14),transparent_26%),radial-gradient(circle_at_50%_100%,rgba(124,58,237,0.12),transparent_36%)]" />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[min(18rem,86vw)] flex-col border-r border-white/10 bg-slate-950/78 backdrop-blur-2xl transition-all duration-300 lg:translate-x-0",
          collapsed ? "lg:w-20" : "lg:w-72",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-500 text-slate-950 shadow-[0_0_28px_rgba(34,197,94,0.35)]">
              <Activity className="h-5 w-5" />
            </span>
            {!collapsed && <span className="font-semibold text-white">AgroNexis AI</span>}
          </div>
          <button
            aria-label="Collapse sidebar"
            onClick={() => setCollapsed((value) => !value)}
            className="hidden h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/8 text-slate-300 transition hover:bg-white/12 lg:grid"
          >
            <Menu className="h-4 w-4" />
          </button>
          <button
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/8 text-slate-300 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {dashboardNav.map((item) => (
            <Link
              href={item.href}
              key={item.label}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-slate-300 transition hover:bg-white/8 hover:text-white",
                (item.label === activeLabel || (item.href !== "/dashboard" && item.href === pathname)) &&
                  "bg-emerald-400/12 text-emerald-100 ring-1 ring-emerald-300/20",
                collapsed && "justify-center px-0",
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            className={cn(
              "flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-slate-300 transition hover:bg-red-400/10 hover:text-red-100",
              collapsed && "justify-center px-0",
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </nav>

        <div className="border-t border-white/10 p-3">
          <div
            className={cn(
              "rounded-lg border border-white/10 bg-white/8 p-3",
              collapsed && "hidden",
            )}
          >
            <p className="text-xs font-semibold uppercase text-slate-400">System health</p>
            <div className="mt-3 h-2 rounded-full bg-white/10">
              <div className="h-2 w-[88%] rounded-full bg-emerald-400" />
            </div>
            <p className="mt-2 text-xs text-slate-400">88% telemetry coverage</p>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <button
          aria-label="Close sidebar overlay"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/45 lg:hidden"
        />
      )}

      <div className={cn("relative transition-[padding] duration-300", collapsed ? "lg:pl-20" : "lg:pl-72")}>
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#071A2F]/82 backdrop-blur-2xl">
          <div className="flex min-h-16 flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:flex-nowrap lg:py-0">
            <button
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((value) => !value)}
              className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/8 text-slate-200 lg:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <div
              data-dashboard-menu
              className="relative order-3 flex w-full items-center gap-3 rounded-lg border border-white/10 bg-white/8 px-3 text-slate-400 transition focus-within:border-emerald-300/60 md:order-none md:flex-1 lg:max-w-2xl"
            >
              <Search className="h-4 w-4" />
              <input
                aria-label="Search dashboard"
                className="h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                placeholder="Search farms, livestock, weather, reports..."
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setOpenMenu("search");
                }}
                onFocus={() => setOpenMenu("search")}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSearchSubmit();
                  }
                }}
              />
              <div className="hidden gap-2 xl:flex">
                <Link
                  href="/livestock"
                  className="rounded-md bg-white/8 px-2 py-1 text-xs text-slate-400 transition hover:bg-emerald-300/10 hover:text-emerald-100"
                >
                  Livestock Health
                </Link>
                <Link
                  href="/weather"
                  className="rounded-md bg-white/8 px-2 py-1 text-xs text-slate-400 transition hover:bg-sky-300/10 hover:text-sky-100"
                >
                  Farm Weather
                </Link>
              </div>
              <AnimatePresence>
                {openMenu === "search" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-lg border border-white/10 bg-slate-950/95 shadow-2xl shadow-black/30 backdrop-blur-xl"
                  >
                    <div className="p-2">
                      {filteredSuggestions.length > 0 ? (
                        filteredSuggestions.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={closeMenus}
                            className="block rounded-md px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/8 hover:text-white"
                          >
                            {item.label}
                          </Link>
                        ))
                      ) : (
                        <p className="px-3 py-2 text-sm text-slate-400">No results found.</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <div className="relative" data-dashboard-menu>
                <button
                  type="button"
                  aria-label="Select language"
                  aria-expanded={openMenu === "language"}
                  onClick={() => toggleMenu("language")}
                  className="hidden h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/8 px-3 text-sm font-medium text-slate-200 transition hover:bg-white/12 focus:outline-none focus:ring-2 focus:ring-sky-300 sm:flex"
                >
                  <Languages className="h-4 w-4 text-sky-300" />
                  {language.code}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <AnimatePresence>
                  {openMenu === "language" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-44 overflow-hidden rounded-lg border border-white/10 bg-slate-950/95 p-2 shadow-2xl shadow-black/30 backdrop-blur-xl"
                    >
                      {languages.map((item) => (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => selectLanguage(item)}
                          className={cn(
                            "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium text-slate-200 transition hover:bg-white/8 hover:text-white",
                            language.code === item.code && "bg-emerald-400/12 text-emerald-100",
                          )}
                        >
                          {item.label}
                          <span className="text-xs text-slate-500">{item.code}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button
                type="button"
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                onClick={() => setTheme((value) => (value === "dark" ? "light" : "dark"))}
                className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/8 text-slate-200 transition hover:bg-white/12 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </button>
              <div className="relative" data-dashboard-menu>
                <button
                  type="button"
                  aria-label="Notifications"
                  aria-expanded={openMenu === "notifications"}
                  onClick={() => toggleMenu("notifications")}
                  className="relative grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/8 text-slate-200 transition hover:bg-white/12 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-400" />
                  )}
                </button>
                <AnimatePresence>
                  {openMenu === "notifications" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-white/10 bg-slate-950/95 p-2 shadow-2xl shadow-black/30 backdrop-blur-xl"
                    >
                      <div className="px-3 py-2">
                        <p className="text-sm font-semibold text-white">Notifications</p>
                        <p className="text-xs text-slate-500">{unreadCount} unread</p>
                      </div>
                      {notificationItems.map((item) => {
                        const isRead = readNotifications.includes(item);
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => markNotificationRead(item)}
                            className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm font-medium text-slate-200 transition hover:bg-white/8 hover:text-white"
                          >
                            <span>{item}</span>
                            {!isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="relative" data-dashboard-menu>
                <button
                  type="button"
                  aria-label="Open user profile menu"
                  aria-expanded={openMenu === "profile"}
                  onClick={() => toggleMenu("profile")}
                  className="flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/8 px-2 text-sm font-medium text-slate-200 transition hover:bg-white/12 focus:outline-none focus:ring-2 focus:ring-emerald-300 sm:px-3"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-md bg-emerald-400/15 text-emerald-200">
                    <UserRound className="h-4 w-4" />
                  </span>
                  <span className="hidden max-w-36 truncate sm:inline">{session?.fullName ?? "Workspace User"}</span>
                  <ChevronDown className="hidden h-3.5 w-3.5 sm:inline" />
                </button>
                <AnimatePresence>
                  {openMenu === "profile" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-52 overflow-hidden rounded-lg border border-white/10 bg-slate-950/95 p-2 shadow-2xl shadow-black/30 backdrop-blur-xl"
                    >
                      {[
                        ["Profile", "/profile"],
                        ["Dashboard", "/dashboard"],
                        ["Settings", "/settings"],
                        ["Account", "/settings"],
                        ["Billing", "/settings"],
                        ["Help Center", "/dashboard"],
                      ].map(([label, href]) => (
                        <Link
                          key={label}
                          href={href}
                          onClick={closeMenus}
                          className="block rounded-md px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/8 hover:text-white"
                        >
                          {label}
                        </Link>
                      ))}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="mt-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-red-100 transition hover:bg-red-400/10"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="hidden h-10 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/8 px-3 text-sm font-semibold text-slate-200 transition hover:border-red-300/35 hover:bg-red-400/10 hover:text-red-100 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-[#071A2F] xl:inline-flex"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        <motion.main
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          onClick={closeMenus}
          className="px-4 py-6 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-[1500px]">{children}</div>
        </motion.main>
      </div>

      <button
        type="button"
        aria-label="Open settings"
        onClick={() => {
          setMobileOpen(true);
          closeMenus();
        }}
        className="fixed bottom-5 right-5 z-30 grid h-12 w-12 place-items-center rounded-lg bg-emerald-500 text-slate-950 shadow-[0_0_36px_rgba(34,197,94,0.35)] transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-[#071A2F] lg:hidden"
      >
        <Settings className="h-5 w-5" />
      </button>
    </div>
  );
}
