/** Normalize Saudi mobile digits (e.g. 5xxxxxxxx -> 9665xxxxxxxx). */
export function normalizeSaudiPhoneDigits(phone) {
  const raw = String(phone || '').replace(/\D/g, '');
  if (!raw) return '';
  if (raw.startsWith('966')) return raw;
  if (raw.startsWith('0')) return `966${raw.slice(1)}`;
  if (raw.length === 9 && raw.startsWith('5')) return `966${raw}`;
  if (raw.startsWith('5')) return `966${raw}`;
  return `966${raw}`;
}

/**
 * When delivery captain skips email, Firebase still needs an email-shaped login id.
 * LoginScreen maps phone-only input to the same value.
 */
export function deliveryAuthEmailFromPhone(phone) {
  const d = normalizeSaudiPhoneDigits(phone);
  if (!d || d === '966') return '';
  return `d_${d}@hasad.app`;
}

export function resolveDeliveryAuthEmail(email, phone) {
  const e = String(email || '').trim().toLowerCase();
  if (e) return e;
  return deliveryAuthEmailFromPhone(phone);
}
