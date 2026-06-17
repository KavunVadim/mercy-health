export function sanitizeHtml(html: string): string {
  // Use consistent sanitization on both server and client
  // Remove script tags
  let result = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  // Remove event handlers
  result = result.replace(/\s+on\w+="[^"]*"/gi, '');
  result = result.replace(/\s+on\w+='[^']*'/gi, '');
  result = result.replace(/\s+on\w+=\S+/gi, '');
  return result;
}
