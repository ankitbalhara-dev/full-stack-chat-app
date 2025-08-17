import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("theme") || "light",
  setTheme: (newTheme) => set({ theme: newTheme }),
}));
