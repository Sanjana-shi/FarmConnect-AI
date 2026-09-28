/**
 * Security & Validation Utilities for FarmConnect AI
 * Provides salted SHA-256 password hashing, phone/email validation,
 * and password strength evaluation.
 */

// Cryptographic salt for client-side password hashing
const HASH_SALT = 'farmconnect_secure_salt_v2_';

/**
 * Computes a salted SHA-256 hash of a password string.
 * Uses the standard Web Crypto API (crypto.subtle) with a fallback.
 */
export async function hashPassword(password: string): Promise<string> {
  const salted = `${HASH_SALT}${password}`;
  
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const msgBuffer = new TextEncoder().encode(salted);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return `sha256_${hashHex}`;
    } catch {
      // Fallback below
    }
  }

  // Pure JS DJB2/Murmur-style deterministic fallback for non-crypto contexts
  let hash = 5381;
  for (let i = 0; i < salted.length; i++) {
    hash = ((hash << 5) + hash) + salted.charCodeAt(i);
    hash = hash & hash;
  }
  const hex = Math.abs(hash).toString(16).padStart(16, '0');
  return `sha256_fallback_${hex}_${salted.length}`;
}

/**
 * Validates whether a provided plain-text password matches a stored hash.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (!password || !storedHash) return false;
  // If stored hash was an old legacy plain-text password during transition, support direct comparison
  if (!storedHash.startsWith('sha256_')) {
    return password === storedHash;
  }
  const computed = await hashPassword(password);
  return computed === storedHash;
}

/**
 * Validates standard email address format.
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  const trimmed = (email || '').trim();
  if (!trimmed) {
    return { isValid: false, error: 'Email address is required' };
  }
  // Standard RFC 5322 compliant regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid email address (e.g. name@example.com)' };
  }
  return { isValid: true };
}

/**
 * Validates Indian mobile numbers (+91 or 10 digits starting with 6, 7, 8, 9).
 */
export function validateIndianMobile(mobile: string): { isValid: boolean; formatted: string; error?: string } {
  const trimmed = (mobile || '').trim();
  if (!trimmed) {
    return { isValid: false, formatted: '', error: 'Mobile number is required' };
  }

  // Remove spaces, hyphens, parentheses
  const cleaned = trimmed.replace(/[\s\-()]/g, '');

  let digits = cleaned;
  if (cleaned.startsWith('+91')) {
    digits = cleaned.slice(3);
  } else if (cleaned.startsWith('91') && cleaned.length === 12) {
    digits = cleaned.slice(2);
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    digits = cleaned.slice(1);
  }

  // Indian mobile numbers must be exactly 10 digits starting with 6, 7, 8, or 9
  const indianMobileRegex = /^[6-9]\d{9}$/;
  if (!indianMobileRegex.test(digits)) {
    return {
      isValid: false,
      formatted: trimmed,
      error: 'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9'
    };
  }

  return {
    isValid: true,
    formatted: `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`
  };
}

/**
 * Analyzes password strength and provides actionable feedback.
 * Requirement: Minimum 8 characters with strength indicator.
 */
export interface PasswordStrength {
  score: number; // 0 to 4
  label: 'Very Weak' | 'Weak' | 'Medium' | 'Strong';
  color: string; // Tailwind color class
  bgBarColor: string;
  percentage: number;
  feedback: string[];
}

export function calculatePasswordStrength(password: string): PasswordStrength {
  const pwd = password || '';
  let score = 0;
  const feedback: string[] = [];

  if (pwd.length === 0) {
    return {
      score: 0,
      label: 'Very Weak',
      color: 'text-slate-400',
      bgBarColor: 'bg-slate-200',
      percentage: 0,
      feedback: ['Minimum 8 characters required']
    };
  }

  if (pwd.length >= 8) {
    score += 1;
  } else {
    feedback.push('Must be at least 8 characters long');
  }

  // Check for lowercase & uppercase
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) {
    score += 1;
  } else {
    feedback.push('Add both uppercase and lowercase letters');
  }

  // Check for numbers
  if (/\d/.test(pwd)) {
    score += 1;
  } else {
    feedback.push('Add at least one number (0-9)');
  }

  // Check for symbols
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) {
    score += 1;
  } else {
    feedback.push('Add a special character (e.g. @, #, $, !)');
  }

  // Length bonus
  if (pwd.length >= 12 && score >= 3) {
    score = 4;
  }

  switch (score) {
    case 0:
    case 1:
      return {
        score: 1,
        label: 'Weak',
        color: 'text-red-600',
        bgBarColor: 'bg-red-500',
        percentage: 25,
        feedback: feedback.length > 0 ? feedback : ['Consider adding numbers or symbols']
      };
    case 2:
      return {
        score: 2,
        label: 'Medium',
        color: 'text-amber-600',
        bgBarColor: 'bg-amber-500',
        percentage: 50,
        feedback: feedback.length > 0 ? feedback : ['Good, but adding special characters makes it stronger']
      };
    case 3:
      return {
        score: 3,
        label: 'Medium',
        color: 'text-emerald-600',
        bgBarColor: 'bg-emerald-500',
        percentage: 75,
        feedback: feedback.length > 0 ? feedback : ['Strong password']
      };
    case 4:
    default:
      return {
        score: 4,
        label: 'Strong',
        color: 'text-emerald-700',
        bgBarColor: 'bg-emerald-600',
        percentage: 100,
        feedback: ['Excellent! Highly secure password']
      };
  }
}
