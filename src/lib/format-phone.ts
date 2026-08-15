export function formatPhoneDisplay(phone: string): string {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (!cleaned) return phone;
  
  let digits = cleaned;
  if (digits.startsWith("38")) digits = digits.slice(2);
  else if (digits.startsWith("8")) digits = digits.slice(1);
  
  if (!digits.startsWith("0")) digits = "0" + digits;
  
  const match = digits.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);
  if (match) {
    return `+38 ${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
  }
  
  return phone.startsWith("+") ? phone : `+38 ${phone.replace(/\s/g, "")}`;
}

export function formatPhoneLink(phone: string): string {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (!cleaned) return phone;
  return cleaned.startsWith("380") ? `+${cleaned}` : `+38${cleaned.startsWith("0") ? cleaned : "0" + cleaned}`;
}
