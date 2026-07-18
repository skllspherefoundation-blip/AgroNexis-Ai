import type { Metadata } from "next";
import Link from "next/link";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { AuthSubmitButton } from "@/components/auth/auth-button";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = {
  title: "Reset Password | AgroNexis AI",
  description: "Create a new AgroNexis AI password.",
};

export default function ResetPasswordPage() {
  return (
    <AuthShell>
      <AuthCard
        eyebrow="New credential"
        title="Create a stronger password"
        description="Choose a secure password for your AgroNexis AI workspace."
      >
        <form className="mt-8 space-y-5">
          <AuthInput label="Reset Token" icon={ShieldCheck} type="text" placeholder="Enter verification token" />
          <AuthInput label="Password" icon={LockKeyhole} type="password" placeholder="New password" />
          <AuthInput
            label="Confirm Password"
            icon={LockKeyhole}
            type="password"
            placeholder="Confirm new password"
          />
          <AuthSubmitButton type="button">Reset password</AuthSubmitButton>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          Need another code?{" "}
          <Link href="/forgot-password" className="font-semibold text-emerald-300 hover:text-emerald-200">
            Request again
          </Link>
        </p>
      </AuthCard>
    </AuthShell>
  );
}
