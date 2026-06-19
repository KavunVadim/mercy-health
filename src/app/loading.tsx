export default function Loading() {
  return (
    <main style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100dvh",
    }}>
      <div style={{
        width: 32,
        height: 32,
        border: "3px solid var(--border, #e2e8f0)",
        borderTopColor: "var(--accent, #000)",
        borderRadius: "50%",
        animation: "spin 0.6s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </main>
  );
}
