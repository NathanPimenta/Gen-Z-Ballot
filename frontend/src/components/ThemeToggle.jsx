import { useTheme } from '../contexts/ThemeContext.jsx';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="theme-toggle">
      <button
        className={theme === 'light' ? 'active' : ''}
        onClick={() => toggleTheme()}
        type="button"
        title="Switch to light mode"
      >
        <span className="theme-toggle-icon">☀️</span>
        Light
      </button>
      <button
        className={theme === 'dark' ? 'active' : ''}
        onClick={() => toggleTheme()}
        type="button"
        title="Switch to dark mode"
      >
        <span className="theme-toggle-icon">🌙</span>
        Dark
      </button>
    </div>
  );
};

export default ThemeToggle;