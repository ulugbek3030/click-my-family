export function normalizePhone(phone: string): string {
  if (!phone) return phone;
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('998')) {
    digits = '+' + digits;
  } else if (digits.startsWith('8') && digits.length === 9) {
    digits = '+998' + digits;
  } else if (!digits.startsWith('+')) {
    digits = '+998' + digits;
  }
  return digits;
}
