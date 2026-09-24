"use client";

export default function StarRating({ value = 0, onChange, size = 26 }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: size,
            lineHeight: 1,
            padding: 0,
            color: n <= value ? "var(--color-primary)" : "var(--color-border)",
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}
