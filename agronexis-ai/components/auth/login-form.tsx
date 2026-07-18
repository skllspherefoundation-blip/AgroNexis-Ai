"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LockKeyhole, Mail, PanelsTopLeft, Search } from "lucide-react";
import { AuthButtonGroup } from "@/components/auth/auth-button-group";
import { AuthSubmitButton, SocialButton } from "@/components/auth/auth-button";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthCheckbox } from "@/components/auth/auth-checkbox";
import { AuthDivider } from "@/components/auth/auth-divider";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthMessage } from "@/components/auth/auth-message";
import { findUserByEmail, setAuthSession } from "@/lib/auth";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [accountError, setAccountError] = useState("");
  const [success, setSuccess] = useState("");
  const [shakePassword, setShakePassword] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAccountError("");
    setSuccess("");

    const user = findUserByEmail(email);
    if (!user) {
      setPasswordError("");
      setAccountError("No account found with this email.");
      return;
    }

    if (user.password !== password) {
      setPasswordError("Incorrect password.");
      setShakePassword(true);
      window.setTimeout(() => setShakePassword(false), 360);
      return;
    }

    setPasswordError("");
    setAuthSession({ email: user.email, fullName: user.fullName }, remember);
    setSuccess("Login successful.");
    window.setTimeout(() => router.push("/dashboard"), 1000);
  };

  return (
    <AuthCard
      eyebrow="Secure access"
      title="Welcome back"
      description="Sign in to your AgroNexis AI workspace to continue managing farm intelligence."
    >
      <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
        {success && <AuthMessage tone="success">{success}</AuthMessage>}
        {accountError && (
          <div className="space-y-3">
            <AuthMessage tone="error">{accountError}</AuthMessage>
            <Link
              href="/register"
              className="flex h-11 w-full items-center justify-center rounded-lg border border-emerald-300/30 bg-emerald-300/10 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-300/15 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Create an Account
            </Link>
          </div>
        )}
        <AuthInput
          label="Email"
          icon={Mail}
          type="email"
          placeholder="farmer@company.com"
          autoComplete="email"
          value={email}
          isValid={email.includes("@") && !accountError}
          onChange={(event) => {
            setEmail(event.target.value);
            setAccountError("");
          }}
        />
        <AuthInput
          label="Password"
          icon={LockKeyhole}
          type={showPassword ? "text" : "password"}
          placeholder="Enter password"
          autoComplete="current-password"
          value={password}
          error={passwordError}
          shake={shakePassword}
          onChange={(event) => {
            setPassword(event.target.value);
            setPasswordError("");
          }}
          action={
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((value) => !value)}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-slate-400 transition hover:bg-white/8 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-300"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <AuthCheckbox
            id="remember"
            label="Remember me"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
          />
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-emerald-300 transition hover:text-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          >
            Forgot Password
          </Link>
        </div>
        <AuthSubmitButton type="submit" disabled={!canSubmit || Boolean(success)}>
          Login
        </AuthSubmitButton>
        <AuthDivider />
        <AuthButtonGroup>
          <SocialButton type="button" icon={Search}>
            Continue with Google
          </SocialButton>
          <SocialButton type="button" icon={PanelsTopLeft}>
            Continue with Microsoft
          </SocialButton>
        </AuthButtonGroup>
      </form>
      <p className="mt-6 text-center text-sm text-slate-400">
        New to AgroNexis AI?{" "}
        <Link href="/register" className="font-semibold text-emerald-300 hover:text-emerald-200">
          Create an account
        </Link>
      </p>
    </AuthCard>
  );
}
