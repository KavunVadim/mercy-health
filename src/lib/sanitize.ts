export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/\s+on\w+="[^"]*"/gi, '')
      .replace(/\s+on\w+='[^']*'/gi, '')
      .replace(/\s+on\w+=\S+/gi, '');
  }
  const purify = require('dompurify');
  return purify.sanitize(html);
}
