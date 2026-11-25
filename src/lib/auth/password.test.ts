import { describe, it, expect } from 'vitest';
import {
  validateNewPassword,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_BYTES,
} from './password';

describe('validateNewPassword', () => {
  it('rejects empty and non-string input', () => {
    expect(validateNewPassword('').ok).toBe(false);
    expect(validateNewPassword(undefined).ok).toBe(false);
    expect(validateNewPassword(12345678).ok).toBe(false);
  });

  it('rejects passwords shorter than the minimum', () => {
    const short = 'ab1'.repeat(Math.max(1, Math.floor(PASSWORD_MIN_LENGTH / 3)));
    const result = validateNewPassword(short);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain(String(PASSWORD_MIN_LENGTH));
  });

  it('accepts a password at exactly the minimum length', () => {
    const exact = 'Forest2026'.slice(0, PASSWORD_MIN_LENGTH);
    expect(validateNewPassword(exact).ok).toBe(true);
  });

  it('requires letters and at least one digit', () => {
    expect(validateNewPassword('__________').ok).toBe(false);
    expect(validateNewPassword('12345678').ok).toBe(false);
    expect(validateNewPassword('forestforest').ok).toBe(false);
    expect(validateNewPassword('forest2026').ok).toBe(true);
  });

  it('accepts cyrillic letters', () => {
    expect(validateNewPassword('Лісовий2026').ok).toBe(true);
  });

  it('rejects values over the bcrypt byte limit', () => {
    const tooLong = 'a1'.repeat(PASSWORD_MAX_BYTES);
    const result = validateNewPassword(tooLong);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain(String(PASSWORD_MAX_BYTES));
  });

  it('counts bytes, not characters, for cyrillic input', () => {
    // 'Лісовий2026' = 11 символів / 18 байт; 5 повторень = 55 символів, але 90 байт > 72
    const cyrillicLong = 'Лісовий2026'.repeat(5);
    expect(cyrillicLong.length).toBeLessThan(PASSWORD_MAX_BYTES);
    expect(new TextEncoder().encode(cyrillicLong).length).toBeGreaterThan(PASSWORD_MAX_BYTES);
    expect(validateNewPassword(cyrillicLong).ok).toBe(false);
  });

  it('rejects surrounding whitespace', () => {
    expect(validateNewPassword(' forest2026').ok).toBe(false);
    expect(validateNewPassword('forest2026 ').ok).toBe(false);
  });

  it('rejects a password equal to the email or its local part', () => {
    expect(validateNewPassword('admin2026@example.com', { email: 'admin2026@example.com' }).ok).toBe(false);
    expect(validateNewPassword('Admin2026', { email: 'admin2026@example.com' }).ok).toBe(false);
    expect(validateNewPassword('Forest2026', { email: 'admin2026@example.com' }).ok).toBe(true);
  });
});
