"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { searchSuggestions } from "@/lib/dashboard-data";

export function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const results = searchSuggestions.filter((item) =>
    query ? item.label.toLowerCase().includes(query.toLowerCase()) : true,
  );

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase text-emerald-300">Search</p>
        <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Search Results</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          {query ? `Results for "${query}"` : "Search across farms, livestock, weather, and reports."}
        </p>
      </div>

      <div className="rounded-lg border border-white/10 bg-slate-950/58 p-4 shadow-xl shadow-black/20 backdrop-blur-xl sm:p-6">
        {results.length > 0 ? (
          <div className="grid gap-3">
            {results.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/8 p-4 text-slate-200 transition hover:border-emerald-300/30 hover:bg-white/12 hover:text-white"
              >
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-400/15 text-emerald-200">
                  <Search className="h-5 w-5" />
                </span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-white/10 bg-white/8 p-4 text-sm text-slate-400">
            No results found.
          </p>
        )}
      </div>
    </section>
  );
}
