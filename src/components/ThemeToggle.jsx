import { useTheme } from "../ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Cambiar tema"
      title="Cambiar tema"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
