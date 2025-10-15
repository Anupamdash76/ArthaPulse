import React, { useEffect } from 'react';
import { useAppStore } from './store';

const ThemeProvider = ({ children }) => {
  const theme = useAppStore((state) => state.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return <>{children}</>;
};

export default ThemeProvider;