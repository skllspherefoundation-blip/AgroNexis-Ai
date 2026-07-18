import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { AuthSubmitButton } from "@/components/auth/auth-button";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = {
  title: "OTP Verification | AgroNexis AI",
  description: "Verify your AgroNexis AI account with a one-time passcode.",
};

export default function VerifyOtpPage() {
  return (
    <AuthShell>
      <AuthCard
        eyebrow="Verification"
        title="Enter your OTP code"
        description="We sent a six-digit verification code to your email address."
      >
        <form className="mt-8 space-y-6">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-200">
              <BadgeCheck className="h-4 w-4 text-emerald-300" />
              Verification code
            </div>
            <div className="grid grid-cols-6 gap-2 sm:gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <input
                  key={index}
                  aria-label={`OTP digit ${index + 1}`}
                  inputMode="numeric"
                  maxLength={1}
                  className="h-12 rounded-lg border border-white/10 bg-white/8 text-center text-lg font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300/60 focus:bg-white/10 sm:h-14"
                />
              ))}
            </div>
          </div>
          <AuthSubmitButton type="button">Verify account</AuthSubmitButton>
        </form>
        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-sm text-slate-400 sm:flex-row">
          <Link href="/login" className="font-semibold text-emerald-300 hover:text-emerald-200">
            Back to login
          </Link>
          <button type="button" className="font-semibold text-sky-300 hover:text-sky-200">
            Resend code
          </button>
        </div>
      </AuthCard>
    </AuthShell>
  );
}
