"use client";

import { createContext, useContext, useId, useState } from "react";

const ExclusiveMenuContext = createContext(null);

export function ExclusiveMenuProvider({ children }) {
  const [openId, setOpenId] = useState(null);

  return (
    <ExclusiveMenuContext.Provider value={{ openId, setOpenId }}>
      {children}
    </ExclusiveMenuContext.Provider>
  );
}

// Coordinates row-action dropdown menus (and similar popovers) so opening one
// automatically closes whatever else was open, anywhere in the app. Spread
// the returned props onto a Radix DropdownMenu/Popover root to opt it in.
export function useExclusiveMenu() {
  const ctx = useContext(ExclusiveMenuContext);
  const id = useId();

  if (!ctx) return {};

  const { openId, setOpenId } = ctx;

  return {
    open: openId === id,
    onOpenChange: (next) => setOpenId(next ? id : null)
  };
}
