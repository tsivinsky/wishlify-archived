import create from "zustand";

export type Theme = "dark" | "light";

export type ThemeState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

export const useTheme = create<ThemeState>((set, get) => ({
  theme: "light",
  setTheme: (theme) => {
    set({ theme });
    localStorage.setItem("theme", theme);

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  },
  toggleTheme: () => get().setTheme(get().theme === "dark" ? "light" : "dark"),
}));
