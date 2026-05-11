'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'christmas';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  const applyTheme = (nextTheme: Theme) => {
    document.documentElement.classList.remove('dark', 'christmas');

    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }

    if (nextTheme === 'christmas') {
      document.documentElement.classList.add('christmas');
    }
  };

  const isTheme = (value: string | null): value is Theme =>
    value === 'light' || value === 'dark' || value === 'christmas';

  useEffect(() => {
    setMounted(true);
    const storedThemeValue = localStorage.getItem('theme');
    const storedTheme = isTheme(storedThemeValue) ? storedThemeValue : null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme =
      theme === 'light' ? 'dark' : theme === 'dark' ? 'christmas' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Return default values during SSR
    return { theme: 'light' as Theme, toggleTheme: () => {} };
  }
  return context;
}
