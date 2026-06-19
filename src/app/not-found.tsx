import Link from "next/link";

export default function NotFound() {
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
      <h1 style={{ fontSize: "clamp(3rem, 10vw, 6rem)", fontWeight: 700, lineHeight: 1, margin: "0 0 0.5rem" }}>
        404
      </h1>
      <p style={{ fontSize: "1.25rem", color: "var(--text-muted, #666)", margin: "0 0 2rem" }}>
        Page not found
      </p>
      <Link
        href="/uk"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.75rem 1.5rem",
          borderRadius: "8px",
          background: "var(--accent, #000)",
          color: "#fff",
          textDecoration: "none",
          fontWeight: 500,
        }}
      >
        Go Home
      </Link>
    </main>
  );
}
