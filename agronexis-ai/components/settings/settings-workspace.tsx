"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Code2,
  Database,
  Download,
  Globe2,
  HardDriveDownload,
  History,
  KeyRound,
  Laptop,
  LockKeyhole,
  Moon,
  RefreshCcw,
  RotateCcw,
  Save,
  ShieldCheck,
  Smartphone,
  Sun,
  Trash2,
  Upload,
  UserRound,
} from "lucide-react";
import { ActionButton, PageHeader, PanelCard, StatusPill } from "@/components/dashboard/dashboard-ui";
import {
  findUserByEmail,
  getAuthSession,
  isStrongPassword,
  isValidEmail,
  saveUser,
  setAuthSession,
  type StoredUser,
} from "@/lib/auth";
import { cn } from "@/lib/utils";

type ProfileForm = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  country: string;
};

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type AppSettings = {
  theme: "dark" | "light";
  language: string;
  timezone: string;
  dateFormat: string;
};

type NotificationSettings = {
  email: boolean;
  sms: boolean;
  push: boolean;
  weather: boolean;
  farm: boolean;
  security: boolean;
};

type AccountSettings = {
  twoFactor: boolean;
  sessionAlerts: boolean;
  autoLogout: boolean;
};

type IntegrationSettings = {
  weatherApi: boolean;
  satelliteSync: boolean;
  farmErp: boolean;
  slackAlerts: boolean;
};

type PrivacySettings = {
  analyticsSharing: boolean;
  productUpdates: boolean;
  publicProfile: boolean;
};

type Toast = {
  tone: "success" | "error";
  message: string;
} | null;

const profileStorageKey = "agronexis_profile_settings";
const appStorageKey = "agronexis_app_settings";
const notificationStorageKey = "agronexis_notification_settings";
const accountStorageKey = "agronexis_account_settings";
const integrationStorageKey = "agronexis_integration_settings";
const privacyStorageKey = "agronexis_privacy_settings";
const avatarStorageKey = "agronexis_profile_avatar";
const apiKeyStorageKey = "agronexis_api_key_label";

const defaultProfile: ProfileForm = {
  fullName: "Maya Chen",
  email: "maya@agronexis.ai",
  phone: "+1 555 0188",
  company: "Delta Valley Estate",
  jobTitle: "Operations Director",
  country: "United States",
};

const defaultAppSettings: AppSettings = {
  theme: "dark",
  language: "English",
  timezone: "Africa/Lagos",
  dateFormat: "DD MMM YYYY",
};

const defaultNotifications: NotificationSettings = {
  email: true,
  sms: false,
  push: true,
  weather: true,
  farm: true,
  security: true,
};

const defaultAccount: AccountSettings = {
  twoFactor: false,
  sessionAlerts: true,
  autoLogout: true,
};

const defaultIntegrations: IntegrationSettings = {
  weatherApi: true,
  satelliteSync: true,
  farmErp: false,
  slackAlerts: false,
};

const defaultPrivacy: PrivacySettings = {
  analyticsSharing: true,
  productUpdates: true,
  publicProfile: false,
};

const securityActivities = [
  { label: "Last Login", value: "Today, 09:18", icon: History },
  { label: "Active Devices", value: "3 trusted devices", icon: Laptop },
  { label: "Recent Activity", value: "Password verified 2 hrs ago", icon: ShieldCheck },
  { label: "Login History", value: "12 successful logins this month", icon: Smartphone },
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

function languageFromCode(code: string | null) {
  const map: Record<string, string> = {
    EN: "English",
    FR: "French",
    ES: "Spanish",
    PT: "Portuguese",
    AR: "Arabic",
  };
  return code ? map[code] ?? "English" : "English";
}

function languageCode(language: string) {
  const map: Record<string, string> = {
    English: "EN",
    French: "FR",
    Spanish: "ES",
    Portuguese: "PT",
    Arabic: "AR",
  };
  return map[language] ?? "EN";
}

export function SettingsWorkspace() {
  const [profile, setProfile] = useState<ProfileForm>(() => {
    if (typeof window === "undefined") return defaultProfile;
    const session = getAuthSession();
    const savedProfile = readStorage<ProfileForm>(profileStorageKey, defaultProfile);

    return {
      ...savedProfile,
      fullName: session?.fullName ?? savedProfile.fullName,
      email: session?.email ?? savedProfile.email,
    };
  });
  const [avatar, setAvatar] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(avatarStorageKey);
  });
  const [appSettings, setAppSettings] = useState<AppSettings>(() => {
    if (typeof window === "undefined") return defaultAppSettings;
    return readStorage<AppSettings>(appStorageKey, {
      ...defaultAppSettings,
      theme: window.localStorage.getItem("agronexis_theme") === "light" ? "light" : "dark",
      language: languageFromCode(window.localStorage.getItem("agronexis_language")),
    });
  });
  const [notifications, setNotifications] = useState<NotificationSettings>(() => readStorage(notificationStorageKey, defaultNotifications));
  const [account, setAccount] = useState<AccountSettings>(() => readStorage(accountStorageKey, defaultAccount));
  const [integrations, setIntegrations] = useState<IntegrationSettings>(() => readStorage(integrationStorageKey, defaultIntegrations));
  const [privacy, setPrivacy] = useState<PrivacySettings>(() => readStorage(privacyStorageKey, defaultPrivacy));
  const [apiKeyLabel, setApiKeyLabel] = useState(() => {
    if (typeof window === "undefined") return "Production API Key";
    return window.localStorage.getItem(apiKeyStorageKey) ?? "Production API Key";
  });
  const [password, setPassword] = useState<PasswordForm>({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [profileErrors, setProfileErrors] = useState<Partial<Record<keyof ProfileForm, string>>>({});
  const [passwordErrors, setPasswordErrors] = useState<Partial<Record<keyof PasswordForm, string>>>({});
  const [apiKeyError, setApiKeyError] = useState("");
  const [toast, setToast] = useState<Toast>(null);

  const sessionEmail = useMemo(() => getAuthSession()?.email ?? defaultProfile.email, []);

  useEffect(() => {
    if (!toast) return;
    const timeoutId = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const showSuccess = (message = "Settings saved successfully.") => setToast({ tone: "success", message });
  const showError = (message: string) => setToast({ tone: "error", message });

  const updateProfile = (field: keyof ProfileForm, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
    setProfileErrors((current) => ({ ...current, [field]: undefined }));
  };

  const updatePassword = (field: keyof PasswordForm, value: string) => {
    setPassword((current) => ({ ...current, [field]: value }));
    setPasswordErrors((current) => ({ ...current, [field]: undefined }));
  };

  const updateAppSetting = <T extends keyof AppSettings>(field: T, value: AppSettings[T]) => {
    const nextSettings = { ...appSettings, [field]: value };
    setAppSettings(nextSettings);
    persistAppSettings(nextSettings);
    showSuccess(`${field === "theme" ? "Theme" : field === "language" ? "Language" : "Application"} setting updated.`);
  };

  const updateNotification = (field: keyof NotificationSettings) => {
    setNotifications((current) => {
      const next = { ...current, [field]: !current[field] };
      window.localStorage.setItem(notificationStorageKey, JSON.stringify(next));
      return next;
    });
  };

  const updateAccount = (field: keyof AccountSettings) => {
    setAccount((current) => {
      const next = { ...current, [field]: !current[field] };
      window.localStorage.setItem(accountStorageKey, JSON.stringify(next));
      return next;
    });
  };

  const updateIntegration = (field: keyof IntegrationSettings) => {
    setIntegrations((current) => {
      const next = { ...current, [field]: !current[field] };
      window.localStorage.setItem(integrationStorageKey, JSON.stringify(next));
      return next;
    });
  };

  const updatePrivacy = (field: keyof PrivacySettings) => {
    setPrivacy((current) => {
      const next = { ...current, [field]: !current[field] };
      window.localStorage.setItem(privacyStorageKey, JSON.stringify(next));
      return next;
    });
  };

  const handleAvatar = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showError("Upload a valid image file for your profile picture.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      setAvatar(result);
      window.localStorage.setItem(avatarStorageKey, result);
      showSuccess("Profile picture updated.");
    };
    reader.readAsDataURL(file);
  };

  const validateProfile = () => {
    const errors: Partial<Record<keyof ProfileForm, string>> = {};
    if (!profile.fullName.trim()) errors.fullName = "Full name is required.";
    if (!isValidEmail(profile.email)) errors.email = "Enter a valid email address.";
    if (!/^[+()\d\s-]{7,}$/.test(profile.phone.trim())) errors.phone = "Enter a valid phone number.";
    if (!profile.company.trim()) errors.company = "Company name is required.";
    if (!profile.jobTitle.trim()) errors.jobTitle = "Job title is required.";
    if (!profile.country.trim()) errors.country = "Country is required.";
    return errors;
  };

  const validateApiKey = () => {
    if (!apiKeyLabel.trim()) {
      setApiKeyError("API key label is required.");
      return false;
    }

    setApiKeyError("");
    return true;
  };

  const persistAppSettings = (settings: AppSettings) => {
    window.localStorage.setItem(appStorageKey, JSON.stringify(settings));
    window.localStorage.setItem("agronexis_language", languageCode(settings.language));
    window.localStorage.setItem("agronexis_theme", settings.theme);
    window.dispatchEvent(new CustomEvent("agronexis-theme-change", { detail: settings.theme }));
  };

  const saveAllSettings = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const errors = validateProfile();
    setProfileErrors(errors);

    const apiValid = validateApiKey();
    if (Object.keys(errors).length > 0 || !apiValid) {
      showError("Fix the highlighted validation errors.");
      return;
    }

    const existingUser = findUserByEmail(sessionEmail) ?? findUserByEmail(profile.email);
    const savedUser: StoredUser = {
      fullName: profile.fullName.trim(),
      email: profile.email.trim(),
      phone: profile.phone.trim(),
      company: profile.company.trim(),
      password: existingUser?.password ?? "AgroNexis1!",
    };

    saveUser(savedUser);
    setAuthSession({ email: savedUser.email, fullName: savedUser.fullName }, true);
    window.localStorage.setItem(profileStorageKey, JSON.stringify(profile));
    window.localStorage.setItem(notificationStorageKey, JSON.stringify(notifications));
    window.localStorage.setItem(accountStorageKey, JSON.stringify(account));
    window.localStorage.setItem(integrationStorageKey, JSON.stringify(integrations));
    window.localStorage.setItem(privacyStorageKey, JSON.stringify(privacy));
    window.localStorage.setItem(apiKeyStorageKey, apiKeyLabel.trim());
    persistAppSettings(appSettings);
    showSuccess();
  };

  const resetSettings = () => {
    setProfile(defaultProfile);
    setAppSettings(defaultAppSettings);
    setNotifications(defaultNotifications);
    setAccount(defaultAccount);
    setIntegrations(defaultIntegrations);
    setPrivacy(defaultPrivacy);
    setApiKeyLabel("Production API Key");
    setPassword({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setProfileErrors({});
    setPasswordErrors({});
    setApiKeyError("");
    window.localStorage.setItem(profileStorageKey, JSON.stringify(defaultProfile));
    window.localStorage.setItem(notificationStorageKey, JSON.stringify(defaultNotifications));
    window.localStorage.setItem(accountStorageKey, JSON.stringify(defaultAccount));
    window.localStorage.setItem(integrationStorageKey, JSON.stringify(defaultIntegrations));
    window.localStorage.setItem(privacyStorageKey, JSON.stringify(defaultPrivacy));
    window.localStorage.setItem(apiKeyStorageKey, "Production API Key");
    persistAppSettings(defaultAppSettings);
    showSuccess("Settings reset to defaults.");
  };

  const changePassword = () => {
    const currentUser = findUserByEmail(profile.email) ?? findUserByEmail(sessionEmail);
    const errors: Partial<Record<keyof PasswordForm, string>> = {};

    if (!password.currentPassword) errors.currentPassword = "Current password is required.";
    if (currentUser && password.currentPassword && password.currentPassword !== currentUser.password) {
      errors.currentPassword = "Current password does not match.";
    }
    if (!isStrongPassword(password.newPassword)) {
      errors.newPassword = "Use 8+ characters with uppercase, lowercase, number, and symbol.";
    }
    if (password.confirmPassword !== password.newPassword) {
      errors.confirmPassword = "Passwords must match.";
    }

    setPasswordErrors(errors);
    if (Object.keys(errors).length > 0) {
      showError("Password update failed validation.");
      return;
    }

    saveUser({
      fullName: profile.fullName,
      email: profile.email,
      phone: profile.phone,
      company: profile.company,
      password: password.newPassword,
    });
    setPassword({ currentPassword: "", newPassword: "", confirmPassword: "" });
    showSuccess("Password updated successfully.");
  };

  const runDataAction = (action: string) => showSuccess(`${action} completed successfully.`);
  const regenerateApiKey = () => {
    if (!validateApiKey()) {
      showError("Add an API key label before regenerating.");
      return;
    }
    window.localStorage.setItem(apiKeyStorageKey, apiKeyLabel.trim());
    showSuccess("API key regenerated successfully.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Workspace Configuration"
        title="Settings"
        accent="emerald"
        description="Configure profile, account access, password policy, notifications, language, theme, security, API keys, integrations, backups, and privacy controls."
        actions={
          <>
            <ActionButton type="button" icon={RotateCcw} onClick={resetSettings}>
              Reset
            </ActionButton>
            <ActionButton form="settings-form" type="submit" icon={Save} variant="primary" accent="emerald">
              Save Settings
            </ActionButton>
          </>
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

      <form id="settings-form" onSubmit={saveAllSettings} className="space-y-6" noValidate>
        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.9fr]">
          <PanelCard title="Profile Settings" subtitle="Identity, company, and regional profile details.">
            <div className="space-y-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-lg border border-white/10 bg-emerald-400/12 text-emerald-100">
                  {avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatar} alt="Profile preview" className="h-full w-full object-cover" />
                  ) : (
                    <UserRound className="h-9 w-9" />
                  )}
                </div>
                <div>
                  <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/8 px-4 text-sm font-semibold text-slate-100 transition hover:bg-white/12">
                    <Upload className="h-4 w-4 text-emerald-300" />
                    Profile Picture
                    <input type="file" accept="image/*" className="sr-only" onChange={(event) => handleAvatar(event.target.files?.[0])} />
                  </label>
                  <p className="mt-2 text-xs text-slate-500">PNG or JPG. Stored locally for this dashboard session.</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Full Name" value={profile.fullName} error={profileErrors.fullName} onChange={(value) => updateProfile("fullName", value)} />
                <FormField label="Email" type="email" value={profile.email} error={profileErrors.email} onChange={(value) => updateProfile("email", value)} />
                <FormField label="Phone Number" value={profile.phone} error={profileErrors.phone} onChange={(value) => updateProfile("phone", value)} />
                <FormField label="Company Name" value={profile.company} error={profileErrors.company} onChange={(value) => updateProfile("company", value)} />
                <FormField label="Job Title" value={profile.jobTitle} error={profileErrors.jobTitle} onChange={(value) => updateProfile("jobTitle", value)} />
                <FormField label="Country" value={profile.country} error={profileErrors.country} onChange={(value) => updateProfile("country", value)} />
              </div>
            </div>
          </PanelCard>

          <div className="space-y-6">
            <PanelCard title="Theme" subtitle="Switch workspace appearance.">
              <div className="grid grid-cols-2 gap-2">
                <ThemeButton active={appSettings.theme === "dark"} icon={Moon} label="Dark Mode" onClick={() => updateAppSetting("theme", "dark")} />
                <ThemeButton active={appSettings.theme === "light"} icon={Sun} label="Light Mode" onClick={() => updateAppSetting("theme", "light")} />
              </div>
            </PanelCard>

            <PanelCard title="Language" subtitle="Locale, timezone, and date formatting.">
              <div className="space-y-4">
                <SelectField label="Language" value={appSettings.language} options={["English", "French", "Spanish", "Portuguese", "Arabic"]} onChange={(value) => updateAppSetting("language", value)} />
                <SelectField label="Timezone" value={appSettings.timezone} options={["Africa/Lagos", "UTC", "America/New_York", "Europe/London", "Asia/Dubai"]} onChange={(value) => updateAppSetting("timezone", value)} />
                <SelectField label="Date Format" value={appSettings.dateFormat} options={["DD MMM YYYY", "MM/DD/YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]} onChange={(value) => updateAppSetting("dateFormat", value)} />
              </div>
            </PanelCard>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <PanelCard title="Account Settings" subtitle="Access controls and account-level safeguards.">
            <div className="space-y-3">
              <SettingsSwitch label="Enable Two-Factor Authentication" checked={account.twoFactor} onChange={() => updateAccount("twoFactor")} />
              <SettingsSwitch label="Session Alerts" checked={account.sessionAlerts} onChange={() => updateAccount("sessionAlerts")} />
              <SettingsSwitch label="Auto Logout" checked={account.autoLogout} onChange={() => updateAccount("autoLogout")} />
              <ActionButton type="button" icon={Laptop} className="w-full">Manage Sessions</ActionButton>
              <ActionButton type="button" icon={Trash2} accent="rose" className="w-full border-rose-300/20 text-rose-100 hover:bg-rose-400/10">
                Delete Account
              </ActionButton>
            </div>
          </PanelCard>

          <PanelCard title="Password Settings" subtitle="Update credentials with strength validation.">
            <div className="space-y-4">
              <FormField label="Current Password" type="password" value={password.currentPassword} error={passwordErrors.currentPassword} onChange={(value) => updatePassword("currentPassword", value)} />
              <FormField label="New Password" type="password" value={password.newPassword} error={passwordErrors.newPassword} onChange={(value) => updatePassword("newPassword", value)} />
              <FormField label="Confirm Password" type="password" value={password.confirmPassword} error={passwordErrors.confirmPassword} onChange={(value) => updatePassword("confirmPassword", value)} />
              <ActionButton type="button" icon={KeyRound} variant="primary" accent="emerald" className="w-full" onClick={changePassword}>
                Update Password
              </ActionButton>
            </div>
          </PanelCard>

          <PanelCard title="Notification Settings" subtitle="Choose which alerts reach each channel.">
            <div className="space-y-3">
              <SettingsSwitch label="Email Notifications" checked={notifications.email} onChange={() => updateNotification("email")} />
              <SettingsSwitch label="SMS Notifications" checked={notifications.sms} onChange={() => updateNotification("sms")} />
              <SettingsSwitch label="Push Notifications" checked={notifications.push} onChange={() => updateNotification("push")} />
              <SettingsSwitch label="Weather Alerts" checked={notifications.weather} onChange={() => updateNotification("weather")} />
              <SettingsSwitch label="Farm Alerts" checked={notifications.farm} onChange={() => updateNotification("farm")} />
              <SettingsSwitch label="Security Alerts" checked={notifications.security} onChange={() => updateNotification("security")} />
            </div>
          </PanelCard>
        </div>
      </form>

      <div className="grid gap-6 xl:grid-cols-3">
        <PanelCard title="Security" subtitle="Recent access and device activity.">
          <div className="space-y-3">
            {securityActivities.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/6 p-3">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-sky-400/12 text-sky-200">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500">{item.label}</p>
                    <p className="mt-1 text-sm font-medium text-slate-200">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </PanelCard>

        <PanelCard title="API Keys" subtitle="Manage programmatic access labels.">
          <div className="space-y-4">
            <FormField label="API Key Label" value={apiKeyLabel} error={apiKeyError} onChange={(value) => {
              setApiKeyLabel(value);
              setApiKeyError("");
            }} />
            <div className="rounded-lg border border-white/10 bg-white/6 p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <Code2 className="h-4 w-4 text-emerald-300" />
                agx_live_sk_••••••••••••9f42
              </div>
              <p className="mt-1 text-xs text-slate-500">Last used today by farm analytics service.</p>
            </div>
            <ActionButton type="button" icon={RefreshCcw} variant="primary" accent="emerald" className="w-full" onClick={regenerateApiKey}>
              Regenerate Key
            </ActionButton>
          </div>
        </PanelCard>

        <PanelCard title="Integrations" subtitle="Connected services and operational sync.">
          <div className="space-y-3">
            <SettingsSwitch label="Weather API" checked={integrations.weatherApi} onChange={() => updateIntegration("weatherApi")} />
            <SettingsSwitch label="Satellite Sync" checked={integrations.satelliteSync} onChange={() => updateIntegration("satelliteSync")} />
            <SettingsSwitch label="Farm ERP" checked={integrations.farmErp} onChange={() => updateIntegration("farmErp")} />
            <SettingsSwitch label="Slack Alerts" checked={integrations.slackAlerts} onChange={() => updateIntegration("slackAlerts")} />
          </div>
        </PanelCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <PanelCard title="Backup & Restore" subtitle="Export, import, backup, and restore workspace data.">
          <div className="grid gap-3 sm:grid-cols-2">
            <DataButton icon={Download} label="Export Data" onClick={() => runDataAction("Export data")} />
            <DataButton icon={Upload} label="Import Data" onClick={() => runDataAction("Import data")} />
            <DataButton icon={Database} label="Backup Settings" onClick={() => runDataAction("Backup settings")} />
            <DataButton icon={RotateCcw} label="Restore Backup" onClick={() => runDataAction("Restore backup")} />
          </div>
          <div className="mt-4 rounded-lg border border-white/10 bg-white/6 p-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <HardDriveDownload className="h-4 w-4 text-emerald-300" />
              Last backup
            </div>
            <p className="mt-1 text-sm text-slate-500">Today, 08:40 via secure local archive</p>
          </div>
        </PanelCard>

        <PanelCard title="Privacy" subtitle="Control analytics, updates, and profile visibility.">
          <div className="space-y-3">
            <SettingsSwitch label="Share Anonymous Analytics" checked={privacy.analyticsSharing} onChange={() => updatePrivacy("analyticsSharing")} />
            <SettingsSwitch label="Receive Product Updates" checked={privacy.productUpdates} onChange={() => updatePrivacy("productUpdates")} />
            <SettingsSwitch label="Public Profile Visibility" checked={privacy.publicProfile} onChange={() => updatePrivacy("publicProfile")} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <StatusPill className="bg-emerald-400/12 text-emerald-100">
              <ShieldCheck className="mr-1 h-3.5 w-3.5" />
              Encrypted
            </StatusPill>
            <StatusPill className="bg-sky-400/12 text-sky-100">
              <LockKeyhole className="mr-1 h-3.5 w-3.5" />
              Access controlled
            </StatusPill>
          </div>
        </PanelCard>
      </div>
    </div>
  );
}

function FormField({
  label,
  value,
  error,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  const inputId = label.toLowerCase().replaceAll(" ", "-");

  return (
    <label htmlFor={inputId} className="block">
      <span className="text-sm font-medium text-slate-200">{label}</span>
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "mt-2 h-11 w-full rounded-lg border bg-white/8 px-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300/60 focus:bg-white/10",
          error ? "border-rose-400/70" : "border-white/10",
        )}
      />
      {error && <p className="mt-1.5 text-xs font-medium text-rose-200">{error}</p>}
    </label>
  );
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-200">{label}</span>
      <div className="mt-2 flex h-11 items-center gap-3 rounded-lg border border-white/10 bg-white/8 px-3 text-slate-400">
        <Globe2 className="h-4 w-4 text-emerald-300" />
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full bg-transparent text-sm font-medium text-white outline-none [&_option]:bg-slate-950"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}

function ThemeButton({ active, icon: Icon, label, onClick }: { active: boolean; icon: LucideIcon; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-11 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-300",
        active ? "border-emerald-300/30 bg-emerald-400/12 text-emerald-100" : "border-white/10 bg-white/8 text-slate-200 hover:bg-white/12",
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function SettingsSwitch({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex w-full items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/6 p-3 text-left transition hover:bg-white/10"
    >
      <span className="text-sm font-medium text-slate-200">{label}</span>
      <span className={cn("flex h-6 w-11 items-center rounded-full p-1 transition", checked ? "bg-emerald-500" : "bg-white/12")}>
        <span className={cn("h-4 w-4 rounded-full bg-white transition", checked && "translate-x-5")} />
      </span>
    </button>
  );
}

function DataButton({ icon: Icon, label, onClick }: { icon: LucideIcon; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-12 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/8 px-3 text-sm font-semibold text-slate-100 transition hover:bg-white/12 focus:outline-none focus:ring-2 focus:ring-emerald-300"
    >
      <Icon className="h-4 w-4 text-emerald-300" />
      {label}
    </button>
  );
}
