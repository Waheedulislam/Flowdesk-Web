/**
 * Client-side form validation helpers for the auth UI.
 *
 * These are UI-only checks that give users immediate feedback before a
 * request is sent. They are NOT a substitute for server-side validation —
 * the backend must re-validate every field once it is connected.
 *
 * TODO: Mirror these rules on the backend and treat the server as the source
 * of truth for validation errors.
 */

/** Reasonable email shape check (not RFC-exhaustive, intentionally lenient). */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

/** Individual password rules, surfaced in the strength meter and hints. */
export interface PasswordChecks {
  length: boolean;
  lowercase: boolean;
  uppercase: boolean;
  number: boolean;
}

export function getPasswordChecks(value: string): PasswordChecks {
  return {
    length: value.length >= 8,
    lowercase: /[a-z]/.test(value),
    uppercase: /[A-Z]/.test(value),
    number: /[0-9]/.test(value),
  };
}

export type PasswordStrength = {
  /** Number of satisfied rules, 0–4. */
  score: number;
  /** Human label for the current score. */
  label: "Too weak" | "Weak" | "Fair" | "Good" | "Strong";
};

const STRENGTH_LABELS: PasswordStrength["label"][] = [
  "Too weak",
  "Weak",
  "Fair",
  "Good",
  "Strong",
];

export function getPasswordStrength(value: string): PasswordStrength {
  if (!value) return { score: 0, label: "Too weak" };
  const checks = getPasswordChecks(value);
  const score = Object.values(checks).filter(Boolean).length;
  return { score, label: STRENGTH_LABELS[score] };
}

/**
 * A password is acceptable for submission when it meets length plus at least
 * one letter and one number. Kept deliberately modest so the demo is usable;
 * tighten to match the backend policy when wiring up.
 */
export function isValidPassword(value: string): boolean {
  const c = getPasswordChecks(value);
  return c.length && (c.lowercase || c.uppercase) && c.number;
}

/** Shared field-level messages so copy stays consistent across the forms. */
export const messages = {
  emailRequired: "Enter your email address.",
  emailInvalid: "That doesn't look like a valid email address.",
  passwordRequired: "Enter your password.",
  passwordWeak:
    "Use at least 8 characters, including a letter and a number.",
  confirmRequired: "Re-enter your password to confirm.",
  confirmMismatch: "Those passwords don't match.",
  nameRequired: "Enter your name.",
  termsRequired: "Please accept the terms to continue.",
} as const;
