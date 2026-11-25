// src/lib/auth/password.ts
// Спільні правила для пароля адміністратора: використовуються і в API
// (register / change-password), і в тестах. Жодного доступу до БД чи env.

export const PASSWORD_MIN_LENGTH = 8;
/** bcrypt мовчки обрізає все після 72 байт — тому це жорстка межа, а не побажання. */
export const PASSWORD_MAX_BYTES = 72;

export type PasswordValidation = { ok: true } | { ok: false; error: string };

/**
 * Перевіряє новий пароль. Повертає українське повідомлення, яке UI показує як є.
 */
export function validateNewPassword(
  password: unknown,
  options: { email?: string } = {},
): PasswordValidation {
  if (typeof password !== 'string' || password.length === 0) {
    return { ok: false, error: 'Введіть новий пароль' };
  }

  if (password !== password.trim()) {
    return { ok: false, error: 'Пароль не може починатися або закінчуватися пробілом' };
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return {
      ok: false,
      error: `Пароль має містити щонайменше ${PASSWORD_MIN_LENGTH} символів`,
    };
  }

  const byteLength = new TextEncoder().encode(password).length;
  if (byteLength > PASSWORD_MAX_BYTES) {
    return { ok: false, error: `Пароль задовгий: максимум ${PASSWORD_MAX_BYTES} байт` };
  }

  if (!/\p{L}/u.test(password) || !/\d/.test(password)) {
    return { ok: false, error: 'Пароль має містити літери та хоча б одну цифру' };
  }

  const email = options.email?.trim().toLowerCase();
  if (email) {
    const localPart = email.split('@')[0];
    const candidate = password.toLowerCase();
    if (candidate === email || (localPart && candidate === localPart)) {
      return { ok: false, error: 'Пароль не може збігатися з адресою електронної пошти' };
    }
  }

  return { ok: true };
}
