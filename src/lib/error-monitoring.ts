export async function captureError(error: unknown, context?: Record<string, unknown>) {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  console.error(JSON.stringify({
    level: 'error',
    message,
    stack,
    ...context,
    timestamp: new Date().toISOString(),
  }));

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const text = [
    `⚠️ *Error*`,
    `\`${message}\``,
    stack ? `\`\`\`${stack.slice(0, 1500)}\`\`\`` : null,
    context ? `\`\`\`${JSON.stringify(context, null, 2).slice(0, 1000)}\`\`\`` : null,
  ].filter(Boolean).join('\n\n');

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
    });
  } catch {
    // silently ignore telegram failures
  }
}
