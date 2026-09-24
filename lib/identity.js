"use client";

import { createContext, useContext } from "react";

const STORAGE_KEY = "groupwatchlist_name";

export const IdentityContext = createContext(null);

export function getSavedName() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_KEY);
}

export function saveName(name) {
  window.localStorage.setItem(STORAGE_KEY, name);
}

export function useIdentity() {
  return useContext(IdentityContext);
}
