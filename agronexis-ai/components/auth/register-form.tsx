"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Eye, EyeOff, LockKeyhole, Mail, Phone, UserRound } from "lucide-react";
import { AuthSubmitButton } from "@/components/auth/auth-button";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthMessage } from "@/components/auth/auth-message";
import { PasswordStrength } from "@/components/auth/password-strength";
import {
  findUserByEmail,
  getPasswordStrength,
  isStrongPassword,
  isValidEmail,
  saveUser,
} from "@/lib/auth";

type RegisterFields = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  password: string;
  confirmPassword: string;
};

const initialFields: RegisterFields = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  password: "",
  confirmPassword: "",
};

const passwordMessage =
  "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.";

export function RegisterForm() {
  const router = useRouter();
  const [fields, setFields] = useState(initialFields);
  const [errors, setErrors] = useState<Partial<RegisterFields>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof RegisterFields, boolean>>>({});
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [shakeField, setShakeField] = useState<keyof RegisterFields | null>(null);

  const passwordStrength = useMemo(() => getPasswordStrength(fields.password), [fields.password]);
  const requiredComplete = Object.values(fields).every((value) => value.trim().length > 0);

  const validate = () => {
    const nextErrors: Partial<RegisterFields> = {};

    if (!fields.fullName.trim()) nextErrors.fullName = "Full Name is required.";
    if (!fields.email.trim() || !isValidEmail(fields.email)) {
      nextErrors.email = "Please enter a valid email address.";
    } else if (findUserByEmail(fields.email)) {
      nextErrors.email = "This email is already registered.";
    }
    if (!fields.phone.trim()) nextErrors.phone = "Phone Number is required.";
    if (!fields.company.trim()) nextErrors.company = "Company Name is required.";
    if (!isStrongPassword(fields.password)) nextErrors.password = passwordMessage;
    if (fields.confirmPassword !== fields.password) nextErrors.confirmPassword = "Passwords do not match.";

    return nextErrors;
  };

  const updateField = (field: keyof RegisterFields, value: string) => {
    setFields((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      company: true,
      password: true,
      confirmPassword: true,
    });

    const firstError = Object.keys(nextErrors)[0] as keyof RegisterFields | undefined;
    if (firstError) {
      setShakeField(firstError);
      window.setTimeout(() => setShakeField(null), 360);
      return;
    }

    saveUser({
      fullName: fields.fullName.trim(),
      email: fields.email.trim().toLowerCase(),
      phone: fields.phone.trim(),
      company: fields.company.trim(),
      password: fields.password,
    });
    setSuccess("Account created successfully.");
    window.setTimeout(() => router.push("/login"), 2000);
  };

  return (
    <AuthCard
      eyebrow="Create workspace"
      title="Start your farm intelligence layer"
      description="Set up your account for livestock, climate, mapping, and analytics operations."
      className="w-full"
    >
      <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
        {success && <AuthMessage tone="success">{success}</AuthMessage>}
        <AuthInput
          label="Full Name"
          icon={UserRound}
          type="text"
          placeholder="Amina Okoro"
          autoComplete="name"
          value={fields.fullName}
          error={touched.fullName ? errors.fullName : undefined}
          isValid={Boolean(touched.fullName && fields.fullName.trim() && !errors.fullName)}
          shake={shakeField === "fullName"}
          onBlur={() => setTouched((current) => ({ ...current, fullName: true }))}
          onChange={(event) => updateField("fullName", event.target.value)}
        />
        <AuthInput
          label="Email"
          icon={Mail}
          type="email"
          placeholder="amina@farmco.com"
          autoComplete="email"
          value={fields.email}
          error={touched.email ? errors.email : undefined}
          isValid={Boolean(touched.email && isValidEmail(fields.email) && !errors.email)}
          shake={shakeField === "email"}
          onBlur={() => setTouched((current) => ({ ...current, email: true }))}
          onChange={(event) => updateField("email", event.target.value)}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <AuthInput
            label="Phone Number"
            icon={Phone}
            type="tel"
            placeholder="+1 555 0199"
            autoComplete="tel"
            value={fields.phone}
            error={touched.phone ? errors.phone : undefined}
            isValid={Boolean(touched.phone && fields.phone.trim() && !errors.phone)}
            shake={shakeField === "phone"}
            onBlur={() => setTouched((current) => ({ ...current, phone: true }))}
            onChange={(event) => updateField("phone", event.target.value)}
          />
          <AuthInput
            label="Company Name"
            icon={Building2}
            type="text"
            placeholder="FarmCo"
            autoComplete="organization"
            value={fields.company}
            error={touched.company ? errors.company : undefined}
            isValid={Boolean(touched.company && fields.company.trim() && !errors.company)}
            shake={shakeField === "company"}
            onBlur={() => setTouched((current) => ({ ...current, company: true }))}
            onChange={(event) => updateField("company", event.target.value)}
          />
        </div>
        <AuthInput
          label="Password"
          icon={LockKeyhole}
          type={showPassword ? "text" : "password"}
          placeholder="Create password"
          autoComplete="new-password"
          value={fields.password}
          error={touched.password ? errors.password : undefined}
          isValid={Boolean(touched.password && isStrongPassword(fields.password) && !errors.password)}
          shake={shakeField === "password"}
          onBlur={() => setTouched((current) => ({ ...current, password: true }))}
          onChange={(event) => updateField("password", event.target.value)}
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
        {fields.password && <PasswordStrength value={passwordStrength} />}
        <AuthInput
          label="Confirm Password"
          icon={LockKeyhole}
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm password"
          autoComplete="new-password"
          value={fields.confirmPassword}
          error={touched.confirmPassword ? errors.confirmPassword : undefined}
          isValid={Boolean(
            touched.confirmPassword &&
              fields.confirmPassword &&
              fields.confirmPassword === fields.password &&
              !errors.confirmPassword,
          )}
          shake={shakeField === "confirmPassword"}
          onBlur={() => setTouched((current) => ({ ...current, confirmPassword: true }))}
          onChange={(event) => updateField("confirmPassword", event.target.value)}
          action={
            <button
              type="button"
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              onClick={() => setShowConfirmPassword((value) => !value)}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-slate-400 transition hover:bg-white/8 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-300"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />
        <AuthSubmitButton type="submit" disabled={!requiredComplete || Boolean(success)}>
          Register
        </AuthSubmitButton>
      </form>
      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-emerald-300 hover:text-emerald-200">
          Login
        </Link>
      </p>
    </AuthCard>
  );
}
