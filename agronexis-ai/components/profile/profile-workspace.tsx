"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AtSign,
  BriefcaseBusiness,
  Building2,
  Clock3,
  Edit3,
  Globe2,
  History,
  KeyRound,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import { ActionButton, PageHeader, PanelCard, StatusPill } from "@/components/dashboard/dashboard-ui";
import { findUserByEmail, getAuthSession, isValidEmail, saveUser, setAuthSession, type StoredUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

type ProfileForm = {
  fullName: string;
  jobTitle: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  timezone: string;
  bio: string;
};

type Toast = {
  tone: "success" | "error";
  message: string;
} | null;

const profileStorageKey = "agronexis_profile_settings";
const appStorageKey = "agronexis_app_settings";
const avatarStorageKey = "agronexis_profile_avatar";

const defaultProfile: ProfileForm = {
  fullName: "Maya Chen",
  jobTitle: "Operations Director",
  company: "Delta Valley Estate",
  email: "maya@agronexis.ai",
  phone: "+1 555 0188",
  country: "United States",
  timezone: "Africa/Lagos",
  bio: "Leads precision agriculture operations, field intelligence programs, and AI-assisted farm performance reviews across connected estates.",
};

const recentActivity = [
  {
    label: "Last login",
    value: "Today, 09:18",
    detail: "Secure dashboard access from trusted workstation",
    icon: History,
  },
  {
    label: "Last password change",
    value: "2 hours ago",
    detail: "Account credentials were verified successfully",
    icon: KeyRound,
  },
  {
    label: "Recent account updates",
    value: "Profile saved",
    detail: "Company, timezone, and notification preferences synced",
    icon: ShieldCheck,
  },
];

function readStorage<T>(key: string, fallback: T) {
  if (typeof window === "undefined") return fallback;
  const saved = window.localStorage.getItem(key);
  if (!saved) return fallback;

  try {
    return { ...fallback, ...JSON.parse(saved) } as T;
  } catch {
    return fallback;
  }
}

function readInitialProfile() {
  if (typeof window === "undefined") return defaultProfile;
  const session = getAuthSession();
  const savedProfile = readStorage<ProfileForm>(profileStorageKey, defaultProfile);
  const savedApp = readStorage(appStorageKey, { timezone: defaultProfile.timezone });

  return {
    ...savedProfile,
    timezone: savedProfile.timezone ?? savedApp.timezone ?? defaultProfile.timezone,
    fullName: session?.fullName ?? savedProfile.fullName,
    email: session?.email ?? savedProfile.email,
  };
}

export function ProfileWorkspace() {
  const [profile, setProfile] = useState<ProfileForm>(() => readInitialProfile());
  const [draft, setDraft] = useState<ProfileForm>(() => readInitialProfile());
  const [avatar, setAvatar] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(avatarStorageKey);
  });
  const [draftAvatar, setDraftAvatar] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(avatarStorageKey);
  });
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileForm, string>>>({});
  const [toast, setToast] = useState<Toast>(null);

  const sessionEmail = useMemo(() => getAuthSession()?.email ?? defaultProfile.email, []);
  const initials = draft.fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "AN";

  useEffect(() => {
    if (!toast) return;
    const timeoutId = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const startEditing = () => {
    setDraft(profile);
    setDraftAvatar(avatar);
    setErrors({});
    setEditing(true);
  };

  const cancelEditing = () => {
    setDraft(profile);
    setDraftAvatar(avatar);
    setErrors({});
    setEditing(false);
  };

  const updateDraft = (field: keyof ProfileForm, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleAvatar = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setToast({ tone: "error", message: "Upload a valid image file." });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setDraftAvatar(String(reader.result));
    reader.readAsDataURL(file);
  };

  const validateProfile = () => {
    const nextErrors: Partial<Record<keyof ProfileForm, string>> = {};
    if (!draft.fullName.trim()) nextErrors.fullName = "Full name is required.";
    if (!draft.jobTitle.trim()) nextErrors.jobTitle = "Job title is required.";
    if (!draft.company.trim()) nextErrors.company = "Company is required.";
    if (!isValidEmail(draft.email)) nextErrors.email = "Enter a valid email address.";
    if (!/^[+()\d\s-]{7,}$/.test(draft.phone.trim())) nextErrors.phone = "Enter a valid phone number.";
    if (!draft.country.trim()) nextErrors.country = "Country is required.";
    if (!draft.timezone.trim()) nextErrors.timezone = "Time zone is required.";
    if (!draft.bio.trim()) nextErrors.bio = "Bio is required.";
    return nextErrors;
  };

  const saveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateProfile();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setToast({ tone: "error", message: "Fix the highlighted profile fields." });
      return;
    }

    const cleanProfile = {
      fullName: draft.fullName.trim(),
      jobTitle: draft.jobTitle.trim(),
      company: draft.company.trim(),
      email: draft.email.trim(),
      phone: draft.phone.trim(),
      country: draft.country.trim(),
      timezone: draft.timezone.trim(),
      bio: draft.bio.trim(),
    };

    const existingUser = findUserByEmail(sessionEmail) ?? findUserByEmail(profile.email);
    const savedUser: StoredUser = {
      fullName: cleanProfile.fullName,
      email: cleanProfile.email,
      phone: cleanProfile.phone,
      company: cleanProfile.company,
      password: existingUser?.password ?? "AgroNexis1!",
    };

    saveUser(savedUser);
    setAuthSession({ email: savedUser.email, fullName: savedUser.fullName }, true);
    window.localStorage.setItem(profileStorageKey, JSON.stringify(cleanProfile));
    if (draftAvatar) {
      window.localStorage.setItem(avatarStorageKey, draftAvatar);
    } else {
      window.localStorage.removeItem(avatarStorageKey);
    }

    setProfile(cleanProfile);
    setAvatar(draftAvatar);
    setEditing(false);
    setToast({ tone: "success", message: "Profile saved successfully." });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Account Identity"
        title="Profile"
        accent="emerald"
        description="Manage your AgroNexis AI identity, contact details, regional preferences, and recent account activity."
        actions={
          editing ? (
            <>
              <ActionButton type="button" icon={X} onClick={cancelEditing}>
                Cancel
              </ActionButton>
              <ActionButton form="profile-form" type="submit" icon={Save} variant="primary" accent="emerald">
                Save Changes
              </ActionButton>
            </>
          ) : (
            <ActionButton type="button" icon={Edit3} variant="primary" accent="emerald" onClick={startEditing}>
              Edit Profile
            </ActionButton>
          )
        }
      />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              "fixed right-4 top-20 z-[90] rounded-lg border px-4 py-3 text-sm font-semibold shadow-2xl backdrop-blur-xl",
              toast.tone === "success"
                ? "border-emerald-300/25 bg-emerald-400/15 text-emerald-50"
                : "border-rose-300/25 bg-rose-400/15 text-rose-50",
            )}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.45fr]">
        <PanelCard title="Profile Summary" subtitle="Identity shown across your workspace.">
          <div className="flex flex-col items-center text-center">
            <div className="grid h-28 w-28 place-items-center overflow-hidden rounded-lg border border-white/10 bg-emerald-400/12 text-3xl font-semibold text-emerald-100 shadow-xl shadow-black/20">
              {draftAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={draftAvatar} alt="Profile avatar" className="h-full w-full object-cover" />
              ) : (
                initials
              )}
            </div>
            {editing && (
              <label className="mt-4 inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/8 px-3 text-sm font-semibold text-slate-100 transition hover:bg-white/12">
                <Upload className="h-4 w-4 text-emerald-300" />
                User Avatar Upload
                <input type="file" accept="image/*" className="sr-only" onChange={(event) => handleAvatar(event.target.files?.[0])} />
              </label>
            )}
            <h2 className="mt-5 text-2xl font-semibold text-white">{draft.fullName}</h2>
            <p className="mt-1 text-sm text-slate-400">{draft.jobTitle}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <StatusPill className="bg-emerald-400/12 text-emerald-100">Verified profile</StatusPill>
              <StatusPill className="bg-sky-400/12 text-sky-100">{draft.timezone}</StatusPill>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <SummaryItem icon={Building2} label="Company" value={draft.company} />
            <SummaryItem icon={Mail} label="Email" value={draft.email} />
            <SummaryItem icon={MapPin} label="Country" value={draft.country} />
          </div>
        </PanelCard>

        <PanelCard title="Profile Details" subtitle={editing ? "Edit fields and save changes." : "Review profile information."}>
          <form id="profile-form" onSubmit={saveProfile} className="space-y-5" noValidate>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField icon={UserRound} label="Full Name" value={draft.fullName} error={errors.fullName} disabled={!editing} onChange={(value) => updateDraft("fullName", value)} />
              <FormField icon={BriefcaseBusiness} label="Job Title" value={draft.jobTitle} error={errors.jobTitle} disabled={!editing} onChange={(value) => updateDraft("jobTitle", value)} />
              <FormField icon={Building2} label="Company" value={draft.company} error={errors.company} disabled={!editing} onChange={(value) => updateDraft("company", value)} />
              <FormField icon={AtSign} label="Email" type="email" value={draft.email} error={errors.email} disabled={!editing} onChange={(value) => updateDraft("email", value)} />
              <FormField icon={Phone} label="Phone Number" value={draft.phone} error={errors.phone} disabled={!editing} onChange={(value) => updateDraft("phone", value)} />
              <FormField icon={Globe2} label="Country" value={draft.country} error={errors.country} disabled={!editing} onChange={(value) => updateDraft("country", value)} />
              <SelectField label="Time Zone" value={draft.timezone} error={errors.timezone} disabled={!editing} onChange={(value) => updateDraft("timezone", value)} />
            </div>
            <BioField value={draft.bio} error={errors.bio} disabled={!editing} onChange={(value) => updateDraft("bio", value)} />

            {editing && (
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <ActionButton type="button" icon={X} onClick={cancelEditing}>
                  Cancel
                </ActionButton>
                <ActionButton type="submit" icon={Save} variant="primary" accent="emerald">
                  Save Changes
                </ActionButton>
              </div>
            )}
          </form>
        </PanelCard>
      </div>

      <PanelCard title="Recent Activity" subtitle="Latest account access and profile events.">
        <div className="grid gap-4 lg:grid-cols-3">
          {recentActivity.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <motion.article
                key={activity.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: index * 0.04 }}
                className="rounded-lg border border-white/10 bg-white/6 p-4"
              >
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-400/12 text-emerald-200">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-4 text-xs font-semibold uppercase text-slate-500">{activity.label}</p>
                <h3 className="mt-1 text-base font-semibold text-white">{activity.value}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{activity.detail}</p>
              </motion.article>
            );
          })}
        </div>
      </PanelCard>
    </div>
  );
}

function SummaryItem({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/6 p-3 text-left">
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-white/8 text-emerald-200">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
        <p className="mt-1 truncate text-sm font-medium text-slate-200">{value}</p>
      </div>
    </div>
  );
}

function FormField({
  icon: Icon,
  label,
  value,
  error,
  disabled,
  onChange,
  type = "text",
}: {
  icon: typeof UserRound;
  label: string;
  value: string;
  error?: string;
  disabled: boolean;
  onChange: (value: string) => void;
  type?: string;
}) {
  const inputId = label.toLowerCase().replaceAll(" ", "-");

  return (
    <label htmlFor={inputId} className="block">
      <span className="text-sm font-medium text-slate-200">{label}</span>
      <div
        className={cn(
          "mt-2 flex h-11 items-center gap-3 rounded-lg border bg-white/8 px-3 text-slate-400 transition focus-within:border-emerald-300/60 focus-within:bg-white/10",
          error ? "border-rose-400/70" : "border-white/10",
          disabled && "bg-white/[0.045]",
        )}
      >
        <Icon className="h-4 w-4 text-emerald-300" />
        <input
          id={inputId}
          type={type}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500 disabled:cursor-default disabled:text-slate-300"
        />
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-rose-200">{error}</p>}
    </label>
  );
}

function SelectField({
  label,
  value,
  error,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  error?: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-200">{label}</span>
      <div
        className={cn(
          "mt-2 flex h-11 items-center gap-3 rounded-lg border bg-white/8 px-3 text-slate-400 transition focus-within:border-emerald-300/60 focus-within:bg-white/10",
          error ? "border-rose-400/70" : "border-white/10",
          disabled && "bg-white/[0.045]",
        )}
      >
        <Clock3 className="h-4 w-4 text-emerald-300" />
        <select
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className="w-full bg-transparent text-sm font-medium text-white outline-none disabled:cursor-default disabled:text-slate-300 [&_option]:bg-slate-950"
        >
          {["Africa/Lagos", "UTC", "America/New_York", "Europe/London", "Asia/Dubai", "Asia/Singapore"].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-rose-200">{error}</p>}
    </label>
  );
}

function BioField({ value, error, disabled, onChange }: { value: string; error?: string; disabled: boolean; onChange: (value: string) => void }) {
  return (
    <label htmlFor="bio" className="block">
      <span className="text-sm font-medium text-slate-200">Bio</span>
      <textarea
        id="bio"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "mt-2 min-h-28 w-full resize-none rounded-lg border bg-white/8 px-3 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300/60 focus:bg-white/10 disabled:cursor-default disabled:bg-white/[0.045] disabled:text-slate-300",
          error ? "border-rose-400/70" : "border-white/10",
        )}
      />
      {error && <p className="mt-1.5 text-xs font-medium text-rose-200">{error}</p>}
    </label>
  );
}
