"use client";

import { useState } from "react";

export default function NamePicker({ onSave }) {
  const [name, setName] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (!name.trim()) return;
    onSave(name.trim());
  }

  return (
    <div className="page">
      <div className="empty-state">
        <p style={{ fontSize: 20, fontWeight: 600, color: "var(--color-text)" }}>
          Who&apos;s watching?
        </p>
        <p>Pick your name so we remember it&apos;s you next time you open this.</p>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", gap: 8, justifyContent: "center" }}
        >
          <input
            className="text-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoFocus
          />
          <button className="btn" type="submit">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
