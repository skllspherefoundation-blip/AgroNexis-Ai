export type StoredUser = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  password: string;
};

export type AuthSession = {
  email: string;
  fullName: string;
};

const USERS_KEY = "agronexis_users";
const AUTH_KEY = "agronexis_auth";

export const demoUser: StoredUser = {
  fullName: "Maya Chen",
  email: "maya@agronexis.ai",
  phone: "+1 555 0188",
  company: "Delta Valley Estate",
  password: "AgroNexis1!",
};

const isBrowser = () => typeof window !== "undefined";

export function getUsers(): StoredUser[] {
  if (!isBrowser()) {
    return [demoUser];
  }

  const savedUsers = window.localStorage.getItem(USERS_KEY);
  if (!savedUsers) {
    return [demoUser];
  }

  try {
    const users = JSON.parse(savedUsers) as StoredUser[];
    const savedDemoUser = users.find((user) => user.email.toLowerCase() === demoUser.email);
    return [savedDemoUser ?? demoUser, ...users.filter((user) => user.email.toLowerCase() !== demoUser.email)];
  } catch {
    return [demoUser];
  }
}

export function saveUser(user: StoredUser) {
  if (!isBrowser()) {
    return;
  }

  const users = getUsers().filter((savedUser) => savedUser.email.toLowerCase() !== user.email.toLowerCase());
  window.localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
}

export function findUserByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  return getUsers().find((user) => user.email.toLowerCase() === normalizedEmail);
}

export function setAuthSession(session: AuthSession, remember: boolean) {
  if (!isBrowser()) {
    return;
  }

  const storage = remember ? window.localStorage : window.sessionStorage;
  const otherStorage = remember ? window.sessionStorage : window.localStorage;
  otherStorage.removeItem(AUTH_KEY);
  storage.setItem(AUTH_KEY, JSON.stringify(session));
}

export function getAuthSession(): AuthSession | null {
  if (!isBrowser()) {
    return null;
  }

  const savedSession = window.localStorage.getItem(AUTH_KEY) ?? window.sessionStorage.getItem(AUTH_KEY);
  if (!savedSession) {
    return null;
  }

  try {
    return JSON.parse(savedSession) as AuthSession;
  } catch {
    clearAuthSession();
    return null;
  }
}

export function clearAuthSession() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(AUTH_KEY);
  window.sessionStorage.removeItem(AUTH_KEY);
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function getPasswordStrength(password: string) {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return "Weak";
  if (score === 3) return "Fair";
  if (score === 4) return "Strong";
  return "Excellent";
}

export function isStrongPassword(password: string) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}
