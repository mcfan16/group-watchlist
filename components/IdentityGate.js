"use client";

import { useEffect, useState } from "react";
import { IdentityContext, getSavedName, saveName } from "@/lib/identity";
import NamePicker from "@/components/NamePicker";

export default function IdentityGate({ children }) {
  const [name, setName] = useState(undefined);

  useEffect(() => {
    setName(getSavedName());
  }, []);

  function handleSave(newName) {
    saveName(newName);
    setName(newName);
  }

  if (name === undefined) return null;
  if (!name) return <NamePicker onSave={handleSave} />;

  return (
    <IdentityContext.Provider value={name}>{children}</IdentityContext.Provider>
  );
}
