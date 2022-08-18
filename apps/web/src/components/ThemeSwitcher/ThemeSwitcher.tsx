import React from "react";

import { useTheme } from "next-themes";
import { Moon, Sun } from "phosphor-react";

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  let ThemeIcon = theme === "dark" ? Moon : Sun;

  return (
    <button
      className="cursor-pointer p-1 rounded-full transition-colors duration-200 hover:bg-gray-200 hover:dark:bg-neutral-700"
      onClick={toggleTheme}
    >
      <ThemeIcon size={24} color={theme === "dark" ? "white" : "black"} />
    </button>
  );
};

export default ThemeSwitcher;
