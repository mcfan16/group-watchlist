"use client";

import { useRef, useState } from "react";

const ACTIONS_WIDTH = 160;
const TAP_THRESHOLD_PX = 5;

export default function SwipeActions({ children, onDelete, onMarkWatched, onTap }) {
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const offsetRef = useRef(0);
  const dragStart = useRef({ x: 0, offset: 0, active: false });

  function updateOffset(next) {
    offsetRef.current = next;
    setOffset(next);
  }

  function handlePointerDown(event) {
    dragStart.current = { x: event.clientX, offset: offsetRef.current, active: true };
    setDragging(true);
  }

  function handlePointerMove(event) {
    if (!dragStart.current.active) return;
    const delta = event.clientX - dragStart.current.x;
    const next = Math.max(-ACTIONS_WIDTH, Math.min(0, dragStart.current.offset + delta));
    updateOffset(next);
  }

  function handlePointerUp(event) {
    if (!dragStart.current.active) return;
    dragStart.current.active = false;
    setDragging(false);
    const delta = event.clientX - dragStart.current.x;

    if (Math.abs(delta) < TAP_THRESHOLD_PX) {
      if (offsetRef.current !== 0) {
        updateOffset(0);
      } else {
        onTap?.();
      }
      return;
    }

    updateOffset(offsetRef.current < -ACTIONS_WIDTH / 2 ? -ACTIONS_WIDTH : 0);
  }

  return (
    <div className="row-gap" style={{ position: "relative", overflow: "hidden", borderRadius: 16 }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: ACTIONS_WIDTH,
          display: "flex",
        }}
      >
        <button
          type="button"
          onClick={() => {
            updateOffset(0);
            onMarkWatched();
          }}
          style={{
            flex: 1,
            background: "var(--color-teal)",
            color: "white",
            border: "none",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Mark
          <br />
          Watched
        </button>
        <button
          type="button"
          onClick={() => {
            updateOffset(0);
            onDelete();
          }}
          style={{
            flex: 1,
            background: "#b3452c",
            color: "white",
            border: "none",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Delete
        </button>
      </div>

      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          position: "relative",
          transform: `translateX(${offset}px)`,
          transition: dragging ? "none" : "transform 0.2s ease",
          touchAction: "pan-y",
          cursor: "pointer",
        }}
      >
        {children}
      </div>
    </div>
  );
}
