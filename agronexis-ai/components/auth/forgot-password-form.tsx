"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { AuthSubmitButton } from "@/components/auth/auth-button";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthMessage } from "@/components/auth/auth-message";
import { findUserByEmail, isValidEmail } from "@/lib/auth";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [shake, setShake] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess("");

    if (!isValidEmail(email) || !findUserByEmail(email)) {
      setError("No account exists with this email.");
      setShake(true);
      window.setTimeout(() => setShake(false), 360);
      return;
    }

    setError("");
    setSuccess("Password reset link sent successfully.");
  };

  return (
    <AuthCard
      eyebrow="Account recovery"
      title="Reset your password"
      description="Enter your workspace email and we will send a secure reset link."
    >
      <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
        {success && <AuthMessage tone="success">{success}</AuthMessage>}
        <AuthInput
          label="Email"
          icon={Mail}
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          value={email}
          error={error}
          shake={shake}
          isValid={Boolean(email && isValidEmail(email) && !error)}
          onChange={(event) => {
            setEmail(event.target.value);
            setError("");
          }}
        />
        <AuthSubmitButton type="submit" disabled={!email.trim()}>
          Send Reset Link
        </AuthSubmitButton>
      </form>
      <p className="mt-6 text-center text-sm text-slate-400">
        Remembered it?{" "}
        <Link href="/login" className="font-semibold text-emerald-300 hover:text-emerald-200">
          Back to login
        </Link>
      </p>
    </AuthCard>
  );
}
