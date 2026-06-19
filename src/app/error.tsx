"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100dvh",
      padding: "2rem",
      textAlign: "center",
    }}>
      <h1 style={{ fontSize: "clamp(2rem, 6vw, 3rem)", fontWeight: 700, lineHeight: 1.2, margin: "0 0 0.5rem" }}>
        Something went wrong
      </h1>
      <p style={{ fontSize: "1.1rem", color: "var(--text-muted, #666)", margin: "0 0 2rem" }}>
        Please try again later.
      </p>
      <button
        onClick={reset}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.75rem 1.5rem",
          borderRadius: "8px",
          border: "none",
          background: "var(--accent, #000)",
          color: "#fff",
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        Try Again
      </button>
    </main>
  );
}
