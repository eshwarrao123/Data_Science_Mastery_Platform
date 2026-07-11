"use client";

import { create } from "zustand";

interface UiState {
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  xpToast: { amount: number; key: number } | null;
  showXpToast: (amount: number) => void;
  clearXpToast: () => void;
}

export const useUi = create<UiState>((set) => ({
  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  xpToast: null,
  showXpToast: (amount) => set({ xpToast: { amount, key: Date.now() } }),
  clearXpToast: () => set({ xpToast: null }),
}));
